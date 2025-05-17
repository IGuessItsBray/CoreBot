// corebot/apps/gateway/index.js

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
    proxyToUse = proxies.find(p => {
      return (p.proxyTags || []).some(tag => message.content.startsWith(tag));
    });

    if (proxyToUse) {
      contentToSend = message.content.replace(new RegExp(`^${proxyToUse.proxyTags.join('|')}`), '').trim();

      // Update lastUsedProxyId if in latch mode
      if (systemData.autoproxy?.mode === 'latch') {
        await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/autoproxy`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: systemData.autoproxy?.mode,
            lastUsedProxyId: proxyToUse.id
          })
        });
      }
    }

    // ========== 2. Latch Fallback ==========
    if (!proxyToUse && systemData.autoproxy?.mode === 'latch' && systemData.lastUsedProxyId) {
      proxyToUse = proxies.find(p => p.id === systemData.lastUsedProxyId);
    }

    if (!proxyToUse || !contentToSend) return;

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

    if (config.directDBQuery === false) {
      await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyToUse.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: message.channel.id,
          guild: message.guild.id,
          content: contentToSend,
          timestamp: new Date().toISOString(),
        })
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
