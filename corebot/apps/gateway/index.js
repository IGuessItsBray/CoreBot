// corebot/apps/gateway/index.js

const { Client, GatewayIntentBits, Partials, WebhookClient } = require('discord.js');
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
    logger.info(`[Proxy] Received message in ${message.channel?.name}`);
  if (message.author.bot || message.channel.type !== 0) return; // Ignore bots and non-text channels
  try {
    // Fetch system info for user
    const userRes = await fetch(`${config.apiBaseUrl}/user/${message.author.id}`);
    const userData = await userRes.json();
    if (!userData?.systemId) return;

    const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
    const proxies = await proxiesRes.json();

    const match = proxies.find(p => {
      return (p.proxyTags || []).some(tag => message.content.startsWith(tag));
    });

    if (!match) return; // No matching tag found

    const contentWithoutTag = message.content.replace(new RegExp(`^${match.proxyTags.join('|')}`), '').trim();
    if (!contentWithoutTag) return; // Don't send empty messages

    const webhooks = await message.channel.fetchWebhooks();
    let webhook = webhooks.find(h => h.name === 'Corebot Proxy');
    if (!webhook) {
      webhook = await message.channel.createWebhook({
        name: 'Corebot Proxy',
        avatar: client.user.displayAvatarURL(),
      });
    }

    await webhook.send({
      content: contentWithoutTag,
      username: match.display_name || match.name,
      avatarURL: match.avatar || undefined,
    });

    await message.delete();

    // Log proxied message
    if (config.directDBQuery === false) {
      await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${match.id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: message.channel.id,
          guild: message.guild.id,
          content: contentWithoutTag,
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
