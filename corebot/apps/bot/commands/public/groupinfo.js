// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

module.exports = {
  name: 'groupinfo',
  description: 'View information about one of your groups',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
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

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const groupId = interaction.options.getString('group');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    logger.info(`[Command] groupInfo for ${groupId}`);
    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don’t have a system set up yet.',
          ephemeral: true
        });
      }

      const allRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups`);
      if (!allRes.ok) {
        const html = await allRes.text();
        logger.error(`[groupInfo] Failed to fetch groups: ${html}`);
        throw new Error('Failed to fetch groups');
      }
      const allGroups = await allRes.json();
      const group = allGroups.find(g => g.id === groupId);
      if (!group) throw new Error('Group not found');

      const embed = new EmbedBuilder()
        .setTitle(group.name)
        .setDescription(group.description || '*No description provided.*')
        .setThumbnail(group.avatar || null)
        .setImage(group.banner || null)
        .addFields(
          { name: 'Name', value: group.name, inline: true },
          { name: 'Members', value: `${group.memberIds?.length || 0}`, inline: true },
          { name: 'ID', value: `\`${group.id}\``, inline: false }
        )
        .setColor(0x3498db);

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