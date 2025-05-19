// corebot/apps/bot/commands/public/autoProxy.js

const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Autoproxy');

module.exports = {
  name: 'autoproxy',
  description: 'Change how messages are automatically proxied',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

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

  async execute(interaction) {
    const mode = interaction.options.getString('mode');
    const memberId = interaction.options.getString('member');

    if (mode === 'member' && !memberId) {
      return interaction.reply({
        content: '❌ You must select a member for autoproxy mode `member`.',
        ephemeral: true
      });
    }

    try {
      logger.info(`[AutoProxy] Resolving user: ${interaction.user.id}`);

      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });

      const userText = await userRes.text();
      logger.info(`[AutoProxy] User response status: ${userRes.status}`);
      logger.debug(`[AutoProxy] User raw body: ${userText.slice(0, 200)}`);

      let userData;
      try {
        userData = JSON.parse(userText);
      } catch (jsonErr) {
        throw new Error(`Failed to parse user JSON: ${jsonErr.message}`);
      }

      if (!userRes.ok || !userData?.systemId) {
        return await interaction.reply({
          content: '❌ You do not have a system set up.',
          ephemeral: true
        });
      }

      const patchBody = {
        mode,
        memberId: mode === 'member' ? memberId : null
      };

      logger.info(`[AutoProxy] Patching system ${userData.systemId} with: ${JSON.stringify(patchBody)}`);

      const res = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/autoproxy`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchBody)
      });

      const resultText = await res.text();
      logger.info(`[AutoProxy] Patch response status: ${res.status}`);
      logger.debug(`[AutoProxy] Patch raw body: ${resultText.slice(0, 200)}`);

      let result;
      try {
        result = JSON.parse(resultText);
      } catch (jsonErr) {
        throw new Error(`Failed to parse patch JSON: ${jsonErr.message}`);
      }

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