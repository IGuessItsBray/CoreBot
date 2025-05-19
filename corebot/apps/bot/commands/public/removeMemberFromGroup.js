// ============================
// Name / Description / Type
// ============================
const { ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('RemoveMemberFromGroup');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
      name: 'group',
      description: 'Select the group to remove the proxy from',
      type: 3, // STRING
      required: true,
      autocomplete: true
    },
    {
      name: 'proxy',
      description: 'Select the proxy to remove from the group',
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
      // Fetch system ID
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const userData = await userRes.json();

      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You don’t have a system yet. Use `/createsystem` first.',
          ephemeral: true
        });
      }

      // Fetch group
      const groupRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${config.botAPIToken}` }
      });
      const group = await groupRes.json();

      if (!group?.id) {
        return await interaction.reply({
          content: '❌ Group not found in your system.',
          ephemeral: true
        });
      }

      logger.info(`[RemoveMember] Group Members: ${group.members.join(', ')}`);

      if (!group.members.includes(proxyId)) {
        return await interaction.reply({
          content: '⚠️ This proxy is not a member of that group.',
          ephemeral: true
        });
      }

      const updatedMembers = group.members.filter(id => id !== proxyId);

      // Update group
      const putRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.botAPIToken}`
        },
        body: JSON.stringify({ members: updatedMembers })
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