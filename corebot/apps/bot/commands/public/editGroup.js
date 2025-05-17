// apps/bot/commands/public/editgroup.js

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('EditGroup');

module.exports = {
  name: 'editgroup',
  description: 'Edit an existing group in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'group',
      description: 'Select a group to edit',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  async execute(interaction) {
    const groupId = interaction.options.getString('group');

    try {
      // Fetch user's system ID
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      // Fetch group data
      const groupRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups`);
      const groups = await groupRes.json();
      const group = groups.find(g => g.id === groupId);
      if (!group) {
        return await interaction.reply({
          content: '❌ Group not found.',
          ephemeral: true
        });
      }

      // Build modal
      const modal = new ModalBuilder()
        .setCustomId(`editGroupModal:${userData.systemId}:${groupId}`)
        .setTitle('Edit Group');

      const nameInput = new TextInputBuilder()
        .setCustomId('group_name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setValue(group.name || '')
        .setRequired(true);

      const avatarInput = new TextInputBuilder()
        .setCustomId('group_avatar')
        .setLabel('Avatar URL')
        .setStyle(TextInputStyle.Short)
        .setValue(group.avatar || '')
        .setRequired(false);

      const bannerInput = new TextInputBuilder()
        .setCustomId('group_banner')
        .setLabel('Banner URL')
        .setStyle(TextInputStyle.Short)
        .setValue(group.banner || '')
        .setRequired(false);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('group_description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(group.description || '')
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(avatarInput),
        new ActionRowBuilder().addComponents(bannerInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to open editgroup modal:', err);
      await interaction.reply({
        content: '❌ Failed to open modal.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};