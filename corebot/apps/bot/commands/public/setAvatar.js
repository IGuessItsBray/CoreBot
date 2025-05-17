// corebot/apps/bot/commands/public/setAvatar.js

const {
    ApplicationCommandType,
    ApplicationCommandOptionType,
  } = require('discord.js');
  
  const config = require('../../../../config/configLoader');
  const logger = require('../../../../shared/utils/logger')('SetAvatar');
  
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------
  
  module.exports = {
    name: 'setavatar',
    description: 'Set a new avatar URL for one of your proxies',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
  
    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------
  
    options: [
      {
        name: 'proxy',
        description: 'Which proxy to update',
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true
      },
      {
        name: 'url',
        description: 'Direct image URL for the new avatar',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ],
  
    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
  
    async execute(interaction) {
      const proxyId = interaction.options.getString('proxy');
      const newUrl = interaction.options.getString('url');
  
      try {
        const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
        const userData = await userRes.json();
        if (!userRes.ok || !userData?.systemId) {
          return await interaction.reply({
            content: '⚠️ You must create a system first using `/createsystem`.',
            ephemeral: true
          });
        }
  
        const updateRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: newUrl })
        });
  
        const result = await updateRes.json();
        if (!updateRes.ok) throw new Error(result.error || 'Unknown error');
  
        await interaction.reply({
          content: `✅ Updated avatar for **${result.name}**.`,
          ephemeral: true
        });
      } catch (err) {
        logger.error('[Command] Failed to update avatar:', err);
        if (config.sentry?.enabled) require('@sentry/node').captureException(err);
        await interaction.reply({
          content: '❌ Failed to update avatar. Please try again.',
          ephemeral: true
        }).catch(() => null);
      }
    }
  };