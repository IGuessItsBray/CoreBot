// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('SetProxyTags');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'settags',
  description: 'Set proxy tags (e.g. [bray] or bray:)',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'proxy',
      description: 'The proxy to update',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: 'tags',
      description: 'Comma-separated list of tags (e.g. bray, mod)',
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');
    const rawTags = interaction.options.getString('tags');

    const tags = rawTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    try {
      // Get authenticated user's system
const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
          headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const userData = await userRes.json();

      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '❌ You do not have a system set up.',
          ephemeral: true,
        });
      }

      // Update proxy's tags
      const response = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies/${proxyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({ proxyTags: tags }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unknown error');

      return await interaction.reply({
        content: `✅ Tags updated for **${result.name}**: \`${tags.join(', ')}\``,
        ephemeral: true,
      });
    } catch (err) {
      logger.error('[Command] Failed to set proxy tags:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      return await interaction.reply({
        content: '❌ Failed to update tags. Please try again.',
        ephemeral: true,
      }).catch(() => null);
    }
  },
};