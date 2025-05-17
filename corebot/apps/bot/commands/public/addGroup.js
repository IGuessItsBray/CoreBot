const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

module.exports = {
  name: 'addgroup',
  description: 'Create a new group in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [], // No slash options anymore

  async execute(interaction) {
    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You must have a system before creating groups.',
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId(`createGroupModal:${userData.systemId}`)
        .setTitle('Create New Group');

      const nameInput = new TextInputBuilder()
        .setCustomId('group_name')
        .setLabel('Group Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('group_description')
        .setLabel('Group Description (optional)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to open group modal:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to open modal. Please try again.',
        ephemeral: true
      });
    }
  }
};