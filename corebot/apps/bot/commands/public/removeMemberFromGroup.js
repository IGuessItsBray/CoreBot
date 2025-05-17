// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

module.exports = {
  name: 'removememberfromgroup',
  description: 'Remove a proxy (member) from a group',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'proxy',
      description: 'Select the proxy to remove from the group',
      type: 3, // STRING
      required: true,
      autocomplete: true
    },
    {
      name: 'group',
      description: 'Select the group to remove the proxy from',
      type: 3, // STRING
      required: true,
      autocomplete: true
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    const proxyId = interaction.options.getString('proxy');
    const groupId = interaction.options.getString('group');

    logger.info(`[Command] removememberfromgroup: ${proxyId} → ${groupId}`);

    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don\'t have a system yet. Use `/createsystem` first.',
          ephemeral: true
        });
      }

      // Fetch group data
      const groupRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups/${groupId}`);
      const group = await groupRes.json();
      if (!group?.id || !group.memberIds.includes(proxyId)) {
        return await interaction.reply({
          content: '⚠️ This proxy is not a member of that group.',
          ephemeral: true
        });
      }

      // Update group (remove proxy)
      const updatedMemberIds = group.memberIds.filter(id => id !== proxyId);

      const putRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberIds: updatedMemberIds })
      });

      const result = await putRes.json();
      if (!putRes.ok) throw new Error(result.error || 'Unknown error');

      await interaction.reply({
        content: `✅ Proxy removed from group **${result.name}**`,
        ephemeral: true
      });

    } catch (err) {
      logger.error('[Command] Failed to remove proxy from group:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to remove proxy from group.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};
