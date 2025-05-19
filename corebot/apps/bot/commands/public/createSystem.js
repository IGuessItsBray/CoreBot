const {
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('CreateSystem');

module.exports = {
  name: 'createsystem',
  description: 'Create your system (required before using proxy features)',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [],

  async execute(interaction) {
    try {
      // Check if user already has a system
      const userRes = await fetch(`${config.apiBaseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });
      const userData = await userRes.json();

      if (userRes.ok && userData?.systemId) {
        return await interaction.reply({
          content: '❌ You already have a system set up.',
          ephemeral: true
        });
      }

      // Show modal to create system
      const modal = new ModalBuilder()
        .setCustomId('createSystemModal')
        .setTitle('Create System');

      const nameInput = new TextInputBuilder()
        .setCustomId('system_name')
        .setLabel('System Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('system_description')
        .setLabel('Description (optional)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const avatarInput = new TextInputBuilder()
        .setCustomId('system_avatar')
        .setLabel('Avatar URL (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const bannerInput = new TextInputBuilder()
        .setCustomId('system_banner')
        .setLabel('Banner URL (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(avatarInput),
        new ActionRowBuilder().addComponents(bannerInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to show system creation modal:', err);
      await interaction.reply({
        content: '❌ Failed to show modal. Please try again.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};