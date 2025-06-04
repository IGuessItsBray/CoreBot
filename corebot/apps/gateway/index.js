// corebot/apps/gateway/index.js

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
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
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.once('ready', () => {
  logger.info(`Gateway is online as ${client.user.tag}`);
});

// ============================
// Message Create Handler
// ============================
client.on('messageCreate', async (message) => {
  console.log('[Gateway] Received message:', message.content);
  if (message.author.bot || message.channel.type !== 0) return;

  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${message.author.id}`, {
      headers: { Authorization: `Bearer ${config.botAPIToken}` }
    });
    const userData = await userRes.json();
    console.log('[Gateway] System ID:', userData.systemId);

    if (!userData?.systemId) return;

    const systemRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}`, {
      headers: { Authorization: `Bearer ${config.botAPIToken}` }
    });
    const systemData = await systemRes.json();
    console.log('[Gateway] Autoproxy config:', systemData.autoproxy);
    if (!systemData) return;

    const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`, {
      headers: { Authorization: `Bearer ${config.botAPIToken}` }
    });
    const proxies = await proxiesRes.json();
    console.log('[Gateway] Fetched proxies:', Array.isArray(proxies) ? proxies.length : 'Invalid response');

let proxyToUse = null;
let contentToSend = message.content;

for (const proxy of proxies) {
  const prefixTags = proxy.proxyTags?.prefix || [];
  const suffixTags = proxy.proxyTags?.suffix || [];

  // Check prefix tags
  for (const tag of prefixTags) {
    if (message.content.startsWith(tag)) {
      proxyToUse = proxy;
      contentToSend = message.content.slice(tag.length).trim();
      console.log('[Gateway] Prefix tag matched:', tag);
      break;
    }
  }

  // Check suffix tags only if prefix didn't match
  if (!proxyToUse) {
    for (const tag of suffixTags) {
      if (message.content.endsWith(tag)) {
        proxyToUse = proxy;
        contentToSend = message.content.slice(0, -tag.length).trim();
        console.log('[Gateway] Suffix tag matched:', tag);
        break;
      }
    }
  }

  if (proxyToUse) {
    console.log('[Gateway] Using proxy:', proxyToUse.name, proxyToUse.id);

    if (systemData.autoproxy?.mode === 'latch') {
      await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/autoproxy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({
          mode: 'latch',
          lastUsedProxyId: proxyToUse.id,
        }),
      });
    }
    break;
  }
}

    if (!proxyToUse && systemData.autoproxy?.mode === 'latch' && systemData.lastUsedProxyId) {
      proxyToUse = proxies.find(p => p.id === systemData.lastUsedProxyId);
      console.log('[Gateway] Latch fallback proxy:', proxyToUse?.id);
    }

    if (!proxyToUse || !contentToSend.trim()) {
      console.log('[Gateway] No proxy matched or content empty.');
      return;
    }

    const webhooks = await message.channel.fetchWebhooks();
    let webhook = webhooks.find(h => h.name === 'Corebot Proxy');
    if (!webhook) {
      webhook = await message.channel.createWebhook({
        name: 'Corebot Proxy',
        avatar: client.user.displayAvatarURL(),
      });
    }

    const sentMessage = await webhook.send({
      content: contentToSend,
      username: proxyToUse.display_name || proxyToUse.name,
      avatarURL: proxyToUse.avatar || undefined,
    });
    console.log('[Gateway] Proxy sent:', sentMessage.id);

    await message.delete();

    if (config.directDBQuery === false) {
      await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyToUse.id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({
          guild: message.guild.id,
          channel: message.channel.id,
          content: contentToSend,
          timestamp: new Date().toISOString(),
          messageId: sentMessage.id,
          messageLink: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${sentMessage.id}`,
        }),
      });
      console.log('[Gateway] Log sent to API.');
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

// ============================
// Latency Reporting to API
// ============================
setInterval(async () => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/status/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.botAPIToken}`,
      },
      body: JSON.stringify({
        source: 'gateway',
        latency: client.ws.ping,
        timestamp: new Date().toISOString(),
        shardStatus: {
          '0': client.ws.status.toString()
        }
      }),
    });

    if (!res.ok) {
      logger.warn(`[Latency] Failed to post latency report: ${res.status}`);
    }
  } catch (err) {
    logger.error('[Latency] Error posting status report:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
}, 30_000); // every 30 seconds