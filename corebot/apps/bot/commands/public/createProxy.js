const {
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('AddProxy');

module.exports = {
  name: 'addproxy',
  description: 'Add a new proxy (member) to your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [],

  async execute(interaction) {
    try {
      // Authenticated call to get user info
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });
      const userData = await userRes.json();

      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      const systemId = userData.systemId;

      const modal = new ModalBuilder()
        .setCustomId(`addProxyModal:${systemId}`)
        .setTitle('Create Proxy');

      const nameInput = new TextInputBuilder()
        .setCustomId('proxy_name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const avatarInput = new TextInputBuilder()
        .setCustomId('proxy_avatar')
        .setLabel('Avatar URL (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const bannerInput = new TextInputBuilder()
        .setCustomId('proxy_banner')
        .setLabel('Banner URL (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const pronounsInput = new TextInputBuilder()
        .setCustomId('proxy_pronouns')
        .setLabel('Pronouns (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('proxy_description')
        .setLabel('Description (optional)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(avatarInput),
        new ActionRowBuilder().addComponents(bannerInput),
        new ActionRowBuilder().addComponents(pronounsInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );

      await interaction.showModal(modal);
    } catch (err) {
      logger.error('[Command] Failed to open addproxy modal:', err);
      await interaction.reply({
        content: '❌ Failed to open modal.',
        ephemeral: true
      });
    }
  }
};