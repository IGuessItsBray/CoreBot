const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const paginate = require('../../../../shared/utils/paginateHandler');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('LookupGroup');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'lookupgroup',
  description: 'Look up a group by ID',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'group',
      description: 'Select a group to look up',
      type: 3, // STRING
      required: true,
      autocomplete: true
    }
  ],

  async execute(interaction) {
    const groupId = interaction.options.getString('group');
    logger.info(`[lookupGroup] Lookup for ${groupId}`);

    try {
      const groupRes = await fetch(`${config.apiBaseUrl}/group/${groupId}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });

      if (!groupRes.ok) throw new Error(`Failed to fetch group: ${groupRes.statusText}`);
      const group = await groupRes.json();

      const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${group.systemId}/proxies`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });

      const allProxies = proxiesRes.ok ? await proxiesRes.json() : [];

      const memberList = group.members?.map(id => {
        const match = allProxies.find(p => p.id === id);
        const name = match?.display_name || match?.name || 'Unknown';
        return `\`${id}\` | ${name}`;
      }) || [];

      const baseEmbed = new EmbedBuilder()
        .setTitle(group.name)
        .setDescription(group.description || '*No description provided.*')
        .setThumbnail(group.avatar || null)
        .setImage(group.banner || null)
        .addFields(
          { name: 'ID', value: `\`${group.id}\``, inline: true },
          { name: 'Members', value: group.members?.length?.toString() || '0', inline: true }
        )
        .setColor(0x3498db);

      if (memberList.length === 0) {
        baseEmbed.addFields({ name: 'Member List', value: 'No members in this group.', inline: false });
        return await interaction.reply({ embeds: [baseEmbed], ephemeral: true });
      }

      const pages = [];
      let current = '';
      for (const entry of memberList) {
        if ((current + entry + '\n').length > 1900) {
          pages.push(current);
          current = '';
        }
        current += entry + '\n';
      }
      if (current) pages.push(current);

      await paginate(interaction, pages, {
        ephemeral: true,
        embedTemplate: baseEmbed,
        fieldName: 'Member List'
      });

    } catch (err) {
      logger.error('[lookupGroup] Failed:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to retrieve group info.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};