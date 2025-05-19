// ============================
// editGroup.js – Fixed Version
// ============================
const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('EditGroup');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'editgroup',
  description: 'Edit a group in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'group',
      description: 'Group to edit',
      type: 3, // STRING
      required: true,
      autocomplete: true
    }
  ],

  async execute(interaction) {
    const groupId = interaction.options.getString('group');
    try {
      // ✅ Fetch group directly by ID (bot-only route)
      const groupRes = await fetch(`${config.apiBaseUrl}/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });
      const group = await groupRes.json();

      if (!groupRes.ok || !group?.name) {
        return await interaction.reply({
          content: '❌ Group not found or does not belong to your system.',
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId(`editGroupModal:${group.systemId}:${groupId}`)
        .setTitle('Edit Group');

      const nameInput = new TextInputBuilder()
        .setCustomId('group_name')
        .setLabel('Group Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(group.name || '');

      const avatarInput = new TextInputBuilder()
        .setCustomId('group_avatar')
        .setLabel('Avatar URL')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(group.avatar || '');

      const bannerInput = new TextInputBuilder()
        .setCustomId('group_banner')
        .setLabel('Banner URL')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(group.banner || '');

      const descInput = new TextInputBuilder()
        .setCustomId('group_description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setValue(group.description || '');

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(avatarInput),
        new ActionRowBuilder().addComponents(bannerInput),
        new ActionRowBuilder().addComponents(descInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to open editgroup modal:', err);
      await interaction.reply({
        content: '❌ Failed to open group edit modal.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};