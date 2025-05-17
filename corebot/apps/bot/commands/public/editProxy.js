const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('EditProxy');

// ------------------------------------------------------------------------------
// Definition
// ------------------------------------------------------------------------------

module.exports = {
  name: 'editproxy',
  description: 'Edit an existing proxy in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ------------------------------------------------------------------------------
  // Options
  // ------------------------------------------------------------------------------

  options: [
    {
      name: 'proxy',
      description: 'Select a proxy to edit',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');

    try {
      // Get user data (to get the correct systemId)
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      // Get the selected proxy data
      const proxyRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
      const proxies = await proxyRes.json();
      const proxy = proxies.find(p => p.id === proxyId);

      if (!proxy) {
        return await interaction.reply({
          content: '❌ Proxy not found.',
          ephemeral: true
        });
      }

      // Build modal with values from the proxy
      const modal = new ModalBuilder()
        .setCustomId(`editProxyModal:${userData.systemId}:${proxyId}`)
        .setTitle('Edit Proxy');

      const nameInput = new TextInputBuilder()
        .setCustomId('proxy_name')
        .setLabel('Name')
        .setStyle(TextInputStyle.Short)
        .setValue(proxy.name || '')
        .setRequired(true);

      const avatarInput = new TextInputBuilder()
        .setCustomId('proxy_avatar')
        .setLabel('Avatar URL')
        .setStyle(TextInputStyle.Short)
        .setValue(proxy.avatar || '')
        .setRequired(false);

      const bannerInput = new TextInputBuilder()
        .setCustomId('proxy_banner')
        .setLabel('Banner URL')
        .setStyle(TextInputStyle.Short)
        .setValue(proxy.banner || '')
        .setRequired(false);

      const pronounsInput = new TextInputBuilder()
        .setCustomId('proxy_pronouns')
        .setLabel('Pronouns')
        .setStyle(TextInputStyle.Short)
        .setValue(proxy.pronouns || '')
        .setRequired(false);

      const descriptionInput = new TextInputBuilder()
        .setCustomId('proxy_description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(proxy.description || '')
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
      logger.error('[Command] Failed to open editproxy modal:', err);
      await interaction.reply({
        content: '❌ Failed to open modal.',
        ephemeral: true
      }).catch(() => null);
    }
  }

  // ------------------------------------------------------------------------------
};
