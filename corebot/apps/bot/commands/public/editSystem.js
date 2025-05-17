// apps/bot/commands/public/editsystem.js

const {
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('EditSystem');

module.exports = {
  name: 'editsystem',
  description: 'Edit your system information',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [],

  async execute(interaction) {
    try {
      // Fetch user’s system
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      const systemRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}`);
      const system = await systemRes.json();
      if (!systemRes.ok || !system) {
        return await interaction.reply({
          content: '❌ Failed to fetch your system.',
          ephemeral: true
        });
      }

      // Build modal
      const modal = new ModalBuilder()
        .setCustomId(`editSystemModal:${system.id}`)
        .setTitle('Edit Your System');

      const nameInput = new TextInputBuilder()
        .setCustomId('system_name')
        .setLabel('System Name')
        .setStyle(TextInputStyle.Short)
        .setValue(system.name || '')
        .setRequired(true);

      const avatarInput = new TextInputBuilder()
        .setCustomId('system_avatar')
        .setLabel('Avatar URL')
        .setStyle(TextInputStyle.Short)
        .setValue(system.avatar || '')
        .setRequired(false);

      const bannerInput = new TextInputBuilder()
        .setCustomId('system_banner')
        .setLabel('Banner URL')
        .setStyle(TextInputStyle.Short)
        .setValue(system.banner || '')
        .setRequired(false);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('system_description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(system.description || '')
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(avatarInput),
        new ActionRowBuilder().addComponents(bannerInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to open editsystem modal:', err);
      await interaction.reply({
        content: '❌ Failed to open modal.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};