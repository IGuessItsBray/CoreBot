// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Autoproxy');

module.exports = {
  name: 'autoproxy',
  description: 'Change how messages are automatically proxied',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'mode',
      description: 'Autoproxy mode',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Off', value: 'off' },
        { name: 'Latch', value: 'latch' },
        { name: 'Member', value: 'member' }
      ]
    },
    {
      name: 'member',
      description: 'Which member to always proxy as (if mode is "member")',
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const userId = interaction.user.id;
    const mode = interaction.options.getString('mode');
    const memberId = interaction.options.getString('member');

    if (mode === 'member' && !memberId) {
      return interaction.reply({
        content: '❌ You must select a member for autoproxy mode `member`.',
        ephemeral: true
      });
    }

    try {
      // Fetch system
      const userRes = await fetch(`${config.apiBaseUrl}/user/${userId}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You do not have a system set up.',
          ephemeral: true
        });
      }

      // Update autoproxy
      const res = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/autoproxy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          memberId: mode === 'member' ? memberId : null
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Unknown error');

      return await interaction.reply({
        content: `✅ Autoproxy set to **${mode}**${mode === 'member' ? ` (ID: \`${memberId}\`)` : ''}.`,
        ephemeral: true
      });
    } catch (err) {
      logger.error('[Command] Failed to update autoproxy:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      return await interaction.reply({
        content: '❌ Failed to update autoproxy mode.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};