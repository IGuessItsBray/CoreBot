const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('GroupInfo');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'groupinfo',
  description: 'View information about one of your groups',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'group',
      description: 'Select a group to view',
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
    const groupId = interaction.options.getString('group');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    logger.info(`[Command] groupInfo for ${groupId}`);

    try {
      // Fetch user to resolve system
const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
      headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const userData = await userRes.json();


      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don’t have a system set up yet.',
          ephemeral: true
        });
      }

      const systemId = userData.systemId;

      // Fetch group
      const groupRes = await fetch(`${config.apiBaseUrl}/group/${groupId}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const group = await groupRes.json();

      if (!groupRes.ok || !group?.id) {
        throw new Error('Group not found or fetch failed');
      }

      if (group.systemId !== systemId) {
        logger.warn(`[Group] Mismatched systemId! Group has: ${group.systemId}, User has: ${systemId}`);
        return await interaction.reply({
          content: '❌ That group does not belong to your system.',
          ephemeral: true
        });
      }

      // Fetch proxies for this system (bot route)
      const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const proxies = await proxiesRes.json();


      const memberNames = (group.members || []).map(id => {
        const proxy = proxies.find(p => p.id === id);
        return proxy?.display_name || proxy?.name || id;
      });


      const embed = new EmbedBuilder()
        .setTitle(group.name)
        .setDescription(group.description || '*No description provided.*')
        .setThumbnail(group.avatar || null)
        .setImage(group.banner || null)
        .addFields(
          { name: 'Name', value: group.name, inline: true },
          { name: 'Members', value: `${group.members?.length || 0}`, inline: true },
          { name: 'ID', value: `\`${group.id}\``, inline: false }
        )
        .setColor(0x3498db);
      if (memberNames.length) {
        embed.addFields({
          name: 'Member List',
          value: memberNames.join(', ').slice(0, 1024),
          inline: false
        });
      }

      await interaction.reply({
        embeds: [embed],
        ephemeral
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