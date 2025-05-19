// corebot/apps/bot/commands/public/setAvatar.js

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require('discord.js');

const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('SetAvatar');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ------------------------------------------------------------------------------
module.exports = {
  name: 'setavatar',
  description: 'Set a new avatar URL for one of your proxies',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ------------------------------------------------------------------------------
  options: [
    {
      name: 'proxy',
      description: 'Which proxy to update',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'url',
      description: 'Direct image URL for the new avatar',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  // ------------------------------------------------------------------------------
  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');
    const newUrl = interaction.options.getString('url');

    try {
      // Fetch user context
const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
              headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const userData = await userRes.json();

      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      // Update the proxy avatar
      const updateRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
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