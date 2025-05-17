const { Client, GatewayIntentBits, Partials } = require('discord.js');
const Sentry = require('@sentry/node');
const config = require('../../config/configLoader');
const logger = require('../../shared/utils/logger')('Gateway');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ============================
// Sentry Initialization
// ============================
if (config.sentry?.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
    environment: config.sentry.environment || 'gateway',
  });
  logger.info('Sentry initialized.');
}

// ============================
// Discord Client Setup
// ============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once('ready', () => {
  logger.info(`Gateway is online as ${client.user.tag}`);
});

// ============================
// Message Create Handler
// ============================
client.on('messageCreate', async (message) => {
  if (message.author.bot || message.channel.type !== 0) return;

  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${message.author.id}`);
    const userData = await userRes.json();
    if (!userData?.systemId) return;

    const systemRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}`);
    const systemData = await systemRes.json();
    if (!systemData) return;

    const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
    const proxies = await proxiesRes.json();

    let proxyToUse = null;
    let contentToSend = message.content;

    // ========== 1. Tag Matching ==========
    proxyToUse = proxies.find(p =>
      (p.proxyTags || []).some(tag => message.content.startsWith(tag))
    );

    if (proxyToUse) {
      const matchedTag = (proxyToUse.proxyTags || []).find(tag =>
        message.content.startsWith(tag)
      );
      contentToSend = message.content.slice(matchedTag.length).trim();

      // Update lastUsedProxyId if in latch mode
      if (systemData.autoproxy?.mode === 'latch') {
        await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/autoproxy`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'latch',
            lastUsedProxyId: proxyToUse.id,
          }),
        });
      }
    }

    // ========== 2. Latch Fallback ==========
    if (!proxyToUse && systemData.autoproxy?.mode === 'latch' && systemData.lastUsedProxyId) {
      proxyToUse = proxies.find(p => p.id === systemData.lastUsedProxyId);
    }

    if (!proxyToUse || !contentToSend.trim()) return;

    const webhooks = await message.channel.fetchWebhooks();
    let webhook = webhooks.find(h => h.name === 'Corebot Proxy');
    if (!webhook) {
      webhook = await message.channel.createWebhook({
        name: 'Corebot Proxy',
        avatar: client.user.displayAvatarURL(),
      });
    }

    await webhook.send({
      content: contentToSend,
      username: proxyToUse.display_name || proxyToUse.name,
      avatarURL: proxyToUse.avatar || undefined,
    });

    await message.delete();

    // ========== Log Message ==========
    if (config.directDBQuery === false) {
      await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyToUse.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guild: message.guild.id,
          channel: message.channel.id,
          content: contentToSend,
          timestamp: new Date().toISOString(),
          messageId: message.id,
          messageLink: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
        }),
      });
    }
  } catch (err) {
    logger.error('Failed to proxy message:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
});

// ============================
// Login
// ============================
client.login(config.token);