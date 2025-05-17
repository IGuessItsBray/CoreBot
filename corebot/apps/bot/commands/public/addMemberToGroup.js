// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

// ============================
// Command Export
// ============================
module.exports = {
  name: 'addmembertogroup',
  description: 'Add a proxy (member) to a group',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'group',
      description: 'Select a group to add to',
      type: 3, // STRING
      required: true,
      autocomplete: true
    },
    {
      name: 'proxy',
      description: 'Select a proxy to add',
      type: 3, // STRING
      required: true,
      autocomplete: true
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const groupId = interaction.options.getString('group');
    const proxyId = interaction.options.getString('proxy');

    logger.info(`[Command] Add Proxy ${proxyId} to Group ${groupId}`);

    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();

      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You must create a system first using `/createsystem`.',
          ephemeral: true
        });
      }

      const response = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ $addToSet: { members: proxyId } })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unknown error');

      await interaction.reply({
        content: `✅ Proxy \`${proxyId}\` added to group \`${groupId}\`.`,
        ephemeral: true
      });
    } catch (err) {
      logger.error('[Command] Failed to add proxy to group:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to add proxy to group.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};