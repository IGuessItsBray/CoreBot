const { ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('SetID');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'setid',
  description: 'Manually change the ID for a proxy, group, or system (dev only)',
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  default_member_permissions: 0,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'user',
      description: 'Target user ID',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'type',
      description: 'Type of item to change',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Proxy', value: 'member' },
        { name: 'Group', value: 'group' },
        { name: 'System', value: 'system' },
      ]
    },
    {
      name: 'item',
      description: 'Select the item to rename',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    },
    {
      name: 'newid',
      description: 'New ID (2–9 uppercase characters)',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const userId = interaction.options.getString('user');
    const type = interaction.options.getString('type');
    const itemId = interaction.options.getString('item');
    const newId = interaction.options.getString('newid');

    if (!/^[A-Z0-9]{2,9}$/.test(newId)) {
      return await interaction.reply({
        content: '❌ New ID must be **2–9 characters**, using only **uppercase letters (A–Z)** and numbers.',
        ephemeral: true
      });
    }

    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${userId}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({ content: '❌ That user does not have a system.', ephemeral: true });
      }

      const systemId = userData.systemId;
      let route;
      if (type === 'member') {
        route = `${config.apiBaseUrl}/system/${systemId}/member/${itemId}/setid`;
      } else if (type === 'group') {
        route = `${config.apiBaseUrl}/system/${systemId}/groups/${itemId}/setid`;
      } else if (type === 'system') {
        route = `${config.apiBaseUrl}/system/${itemId}/setid`;
      }

      const response = await fetch(route, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newId })
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.includes('application/json')) {
        const raw = await response.text();
        if (raw.includes('Invalid ID format')) {
          return await interaction.reply({
            content: '❌ Invalid ID format: IDs must be 2–9 uppercase characters using A–Z and 0–9.',
            ephemeral: true
          });
        }
        throw new Error(`Unexpected response:\n${raw}`);
      }

      const result = await response.json();

      await interaction.reply({
        content: `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} ID changed to \`${newId}\``,
        ephemeral: true
      });
    } catch (err) {
      logger.error('[SetID] Failed to set ID:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to change the ID. Check logs for details.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};