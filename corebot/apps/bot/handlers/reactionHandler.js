// corebot/apps/bot/handlers/reactionHandler.js

const config = require('../../../config/configLoader');
const logger = require('../../../shared/utils/logger')('ReactionHandler');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Shared bot auth header
const apiHeaders = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.botAPIToken}`
};

module.exports = async (reaction, user) => {
  try {
    if (user.bot) return;

    const emoji = reaction.emoji.name;
    if (!['❓', '⁉️', '❔', '❕', '❓‍🟥'].includes(emoji)) return;

    const message = reaction.message;
    if (!message || !message.guild || !message.author || message.author.bot) return;

    // Fetch system for message author
    const authorRes = await fetch(`${config.apiBaseUrl}/user/${message.author.id}`, {
      headers: apiHeaders
    });
    if (!authorRes.ok) return;
    const authorData = await authorRes.json();
    if (!authorData?.systemId) return;

    // Fetch proxies for that system
    const proxyRes = await fetch(`${config.apiBaseUrl}/system/${authorData.systemId}/proxies`, {
      headers: apiHeaders
    });
    if (!proxyRes.ok) return;
    const proxies = await proxyRes.json();
    if (!Array.isArray(proxies)) return;

    const found = proxies.find(p =>
      p.guildLogs?.some(log =>
        log.guildId === message.guild.id &&
        log.messages?.some(m => m.messageId === message.id)
      )
    );
    if (!found) return;

    // Fetch system details
    const systemRes = await fetch(`${config.apiBaseUrl}/system/${authorData.systemId}`, {
      headers: apiHeaders
    });
    if (!systemRes.ok) return;
    const system = await systemRes.json();

    const embed = {
      title: `${found.name} (${found.id})`,
      description: found.description || '*No description provided.*',
      fields: [
        { name: 'System', value: `${system.name} (${system.id})` },
        { name: 'Pronouns', value: found.pronouns || 'N/A', inline: true },
        { name: 'Messages', value: `${found.messageCount || 0}`, inline: true },
        { name: 'Characters', value: `${found.characterCount || 0}`, inline: true }
      ],
      thumbnail: found.avatar ? { url: found.avatar } : null,
      image: found.banner ? { url: found.banner } : null,
      color: 0x7289da
    };

    await user.send({ embeds: [embed] });
  } catch (err) {
    logger.error('[ReactionHandler] Failed to process reaction:', err);
    if (config.sentry?.enabled) require('@sentry/node').captureException(err);
  }
};