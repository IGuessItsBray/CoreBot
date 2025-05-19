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

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'editproxy',
  description: 'Edit an existing proxy in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'proxy',
      description: 'Select a proxy to edit',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');

    try {
      // ✅ Fetch the proxy directly by ID (bot-only route)
      const proxyRes = await fetch(`${config.apiBaseUrl}/proxy/${proxyId}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`,
        },
      });

      const proxy = await proxyRes.json();

      if (!proxyRes.ok || !proxy?.id) {
        return await interaction.reply({
          content: '❌ Proxy not found or does not belong to your system.',
          ephemeral: true,
        });
      }

      // ✅ Build modal with values from proxy
      const modal = new ModalBuilder()
        .setCustomId(`editProxyModal:${proxy.systemId}:${proxyId}`)
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
        ephemeral: true,
      }).catch(() => null);
    }
  },
};