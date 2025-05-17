const { ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Bot');

module.exports = {
  name: 'addgroup',
  description: 'Create a new group in your system',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'name',
      description: 'Name of the group',
      type: 3, // STRING
      required: true
    },
    {
      name: 'description',
      description: 'Description of the group (optional)',
      type: 3,
      required: false
    }
  ],

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description') || '';

    try {
      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You must have a system before creating groups.',
          ephemeral: true
        });
      }

      const res = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          avatar: '',
          banner: '',
          memberIds: [],
          systemId: userData.systemId
        })
      });

      const group = await res.json();
      if (!res.ok) throw new Error(group.error || 'Unknown error');

      await interaction.reply({
        content: `✅ Group **${group.name}** created.`,
        ephemeral: true
      });
    } catch (err) {
      logger.error('[Command] Failed to create group:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to create group.',
        ephemeral: true
      });
    }
  }
};