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
    proxyToUse = proxies.find(p => (p.proxyTags || []).some(tag => message.content.startsWith(tag)));

    if (proxyToUse) {
      const matchedTag = (proxyToUse.proxyTags || []).find(tag => message.content.startsWith(tag));
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

    const sentMessage = await webhook.send({
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
          messageId: sentMessage.id,
          messageLink: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${sentMessage.id}`,
        }),
      });
    }
  } catch (err) {
    logger.error('Failed to proxy message:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
});

// ============================
// Reaction Handler
// ============================
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const emoji = reaction.emoji.name;
    const validEmojis = ['❓', '⁉️', '❔', '❕'];
    if (!validEmojis.includes(emoji)) return;

    const message = reaction.message;
    if (message.author?.id === user.id) return;

    const res = await fetch(`${config.apiBaseUrl}/system/proxy/lookup/by-message/${message.id}`);
    if (!res.ok) {
      logger.warn(`[Reaction] Lookup failed for message ${message.id} (${res.status})`);
      return;
    }

    const { proxy, system } = await res.json();
    if (!proxy || !system) return;

    const embed = new EmbedBuilder()
      .setTitle(`${proxy.display_name || proxy.name} (${proxy.id})`)
      .setDescription(
        (proxy.description || 'No description provided.')
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean)
          .join(' ')
          .slice(0, 1000)
      )
      .setColor(0x5865f2)
      .setFooter({ text: `Message: ${message.url}` });

    if (proxy.avatar) embed.setThumbnail(proxy.avatar);
    if (proxy.banner) embed.setImage(proxy.banner);
    if (proxy.proxyTags?.length)
      embed.addFields({ name: 'Tags', value: proxy.proxyTags.join(', '), inline: false });
    if (system.name)
      embed.addFields({ name: 'System', value: system.name, inline: false });

    await user.send({ embeds: [embed] });
    try {
      await reaction.users.remove(user.id);
    } catch (err) {
      logger.warn(`[Reaction] Failed to remove reaction: ${err.message}`);
    }

    logger.info(`[Reaction] Sent proxy card to ${user.tag} for message ${message.id}`);
  } catch (err) {
    logger.error(`[Reaction] Failed to process message reaction: ${err.message}`);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
});

// ============================
// Login
// ============================
client.login(config.token);