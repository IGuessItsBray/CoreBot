const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('lookupProxy');

module.exports = {
  name: 'lookupproxy',
  description: 'Lookup a proxy by its ID (any system)',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'id',
      description: 'Proxy ID to look up',
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

  async execute(interaction) {
    const proxyId = interaction.options.getString('id');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    logger.info(`[Command] lookupproxy for ${proxyId}`);

    try {
      const res = await fetch(`${config.apiBaseUrl}/proxy/${proxyId}`);
      const proxy = await res.json();

      if (!res.ok || !proxy?.id) throw new Error(proxy.error || 'Proxy not found');

      // 🔍 Fetch groups this proxy is in
      const groupsRes = await fetch(`${config.apiBaseUrl}/proxy/${proxy.id}/groups`);
      const groups = await groupsRes.ok ? await groupsRes.json() : [];

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
        .setColor(0x2980b9);

      if (proxy.proxyTags?.length) {
        embed.addFields({
          name: 'Tags',
          value: proxy.proxyTags.join(', '),
          inline: false
        });
      }

      if (groups?.length) {
        embed.addFields({
          name: 'Groups',
          value: groups.map(g => g.name).join(', '),
          inline: false
        });
      }

      await interaction.reply({ embeds: [embed], ephemeral });
    } catch (err) {
      logger.error('[Command] Failed to look up proxy:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to look up proxy. Ensure the ID is valid.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};