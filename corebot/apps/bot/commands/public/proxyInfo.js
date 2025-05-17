// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

module.exports = {
  name: 'proxyinfo',
  description: 'View information about one of your proxies',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'proxy',
      description: 'Select a proxy to view',
      type: 3, // STRING
      required: true,
      autocomplete: true
    },
    {
      name: 'ephemeral',
      description: 'Only show this to you (default: true)',
      type: 5, // BOOLEAN
      required: false
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    logger.info(`[Command] proxyInfo for ${proxyId}`);
    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don’t have a system set up yet.',
          ephemeral: true
        });
      }

      const allRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
      if (!allRes.ok) {
        const html = await allRes.text();
        logger.error(`[proxyInfo] Failed to fetch proxies: ${html}`);
        throw new Error('Failed to fetch proxies');
      }
      const allProxies = await allRes.json();
      const proxy = allProxies.find(p => p.id === proxyId);
      if (!proxy) throw new Error('Proxy not found');
      if (!proxy?.id) throw new Error('Proxy not found');

      const embed = new EmbedBuilder()
        .setTitle(proxy.display_name || proxy.name)
        .setDescription(proxy.description || '*No description provided.*')
        .setThumbnail(proxy.avatar || null)
        .setImage(proxy.banner || null)
        .addFields(
          { name: 'Name', value: proxy.name, inline: true },
          { name: 'Pronouns', value: proxy.pronouns || 'N/A', inline: true },
          { name: 'Messages', value: proxy.messageCount?.toLocaleString() || '0', inline: true },
          { name: 'Characters', value: proxy.characterCount?.toLocaleString() || '0', inline: true },
          { name: 'ID', value: `\`${proxy.id}\``, inline: false }
        )
        .setColor(0x8e44ad);

      await interaction.reply({
        embeds: [embed],
        ephemeral
      });
    } catch (err) {
      logger.error('[Command] Failed to fetch proxy info:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to retrieve proxy info.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};