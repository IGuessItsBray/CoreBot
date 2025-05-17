const { ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// ------------------------------------------------------------------------------
// Definition
// ------------------------------------------------------------------------------

module.exports = {
  name: 'createsystem',
  description: 'Create your system (required before using proxy features)',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
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
      new ActionRowBuilder().addComponents(bannerInput),
    );

    await interaction.showModal(modal);
  },

  // ------------------------------------------------------------------------------
};