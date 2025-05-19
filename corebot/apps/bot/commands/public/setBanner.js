// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const logger = require('../../../../shared/utils/logger')('SetBanner');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'setbanner',
  description: 'Set the banner for one of your proxies',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'proxy',
      description: 'Select the proxy to update',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'url',
      description: 'Banner image URL',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');
    const banner = interaction.options.getString('url');

    try {
      // Fetch user’s systemId
const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
          headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const userData = await userRes.json();

      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '⚠️ You do not have a system set up.',
          ephemeral: true,
        });
      }

      // Update the proxy banner
      const response = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({ banner }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unknown error');

      await interaction.reply({
        content: `✅ Banner updated for **${result.name}**!`,
        ephemeral: true,
      });
    } catch (err) {
      logger.error('[Command] Failed to update proxy banner:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to update banner. Please try again.',
        ephemeral: true,
      }).catch(() => null);
    }
  }
};