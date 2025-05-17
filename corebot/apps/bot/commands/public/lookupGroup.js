const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const paginate = require('../../../../shared/utils/paginateHandler');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

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
    logger.info(`[Command] lookupGroup for ${groupId}`);

    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don’t have a system set up yet.',
          ephemeral: true
        });
      }

      const [groupsRes, proxiesRes] = await Promise.all([
        fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups`),
        fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`)
      ]);

      if (!groupsRes.ok || !proxiesRes.ok) {
        logger.error('[lookupGroup] Failed to fetch group or proxy data');
        throw new Error('Fetch failure');
      }

      const allGroups = await groupsRes.json();
      const allProxies = await proxiesRes.json();
      const group = allGroups.find(g => g.id === groupId);

      if (!group) throw new Error('Group not found');

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

      // Paginate member list inside embed descriptions
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
      logger.error('[Command] Failed to fetch group info:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to retrieve group info.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};