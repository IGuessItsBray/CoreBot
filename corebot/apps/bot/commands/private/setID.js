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
      let systemId;

      // Step 1: Try to fetch the user's system ID
      logger.info(`[SetID] Fetching system for user: ${userId}`);
      const userRes = await fetch(`${config.apiBaseUrl}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });
      const userData = await userRes.json();

      if (userRes.ok && userData?.systemId) {
        systemId = userData.systemId;
      } else {
        logger.warn(`[SetID] Failed to fetch user system, falling back via object lookup for type: ${type}`);
        const fallbackRoute =
          type === 'member' ? `${config.apiBaseUrl}/proxy/${itemId}` :
          type === 'group' ? `${config.apiBaseUrl}/group/${itemId}` : null;

        if (!fallbackRoute) {
          return await interaction.reply({ content: '❌ Unable to determine system ID.', ephemeral: true });
        }

        const fallbackRes = await fetch(fallbackRoute, {
          headers: {
            Authorization: `Bearer ${config.botAPIToken}`
          }
        });
        const fallbackData = await fallbackRes.json();

        if (!fallbackRes.ok || !fallbackData?.systemId) {
          return await interaction.reply({ content: '❌ That item does not exist or has no system.', ephemeral: true });
        }

        systemId = fallbackData.systemId;
      }

      // Step 2: Build the correct route based on type
      let route;
      if (type === 'member') {
  route = `${config.apiBaseUrl}/system/${systemId}/member/${itemId}/setid`;
} else if (type === 'group') {
        route = `${config.apiBaseUrl}/system/${systemId}/groups/${itemId}/setid`;
      } else if (type === 'system') {
        route = `${config.apiBaseUrl}/system/${itemId}/setid`;
      }

      logger.info(`[SetID] PATCH → ${route}`);
      logger.info(`[SetID] Payload: ${JSON.stringify({ newId })}`);

      // Step 3: Make the request
      const response = await fetch(route, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({ newId })
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.includes('application/json')) {
        const raw = await response.text();
        logger.warn(`[SetID] Non-JSON response: ${raw}`);
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