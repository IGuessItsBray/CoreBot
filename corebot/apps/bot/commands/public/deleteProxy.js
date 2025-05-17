const {
    ApplicationCommandType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require('discord.js');
  const config = require('../../../../config/configLoader');
  const logger = require('../../../../shared/utils/logger')('DeleteProxy');
  
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------
  
  module.exports = {
    name: 'deleteproxy',
    description: 'Delete one of your proxies (members)',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
  
    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------
  
    options: [
      {
        name: 'proxy',
        description: 'The proxy you want to delete',
        type: 3, // STRING
        required: true,
        autocomplete: true,
      },
    ],
  
    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
  
    async execute(interaction) {
      try {
        const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
        const userData = await userRes.json();
  
        if (!userRes.ok || !userData?.systemId) {
          return await interaction.reply({
            content: '⚠️ You must create a system first using `/createsystem`.',
            ephemeral: true,
          });
        }
  
        const proxyId = interaction.options.getString('proxy');
        const proxyRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
        const proxies = await proxyRes.json();
        const selected = proxies.find(p => p.id === proxyId);
  
        if (!selected) {
          return await interaction.reply({
            content: '⚠️ Proxy not found in your system.',
            ephemeral: true,
          });
        }
  
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`deleteProxy_confirm:${userData.systemId}:${proxyId}`)
            .setLabel('Yes, Delete')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('deleteProxy_cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary)
        );
  
        await interaction.reply({
          content: `🗑️ Are you sure you want to delete **${selected.name}** \`(${selected.id})\`?`,
          components: [row],
          ephemeral: true,
        });
      } catch (err) {
        logger.error('[Command] Failed to initiate proxy deletion:', err);
        await interaction.reply({
          content: '❌ Failed to start deletion flow. Please try again.',
          ephemeral: true,
        });
      }
    },
  
    // ------------------------------------------------------------------------------
  };