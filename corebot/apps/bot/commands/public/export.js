const { ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const config = require('../../../../config/configLoader');
const logger = require('../../../../shared/utils/logger')('ExportData');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'export',
  description: 'Export your proxy system (proxies, groups, metadata) as a JSON file.',
  type: ApplicationCommandType.ChatInput,
  enabled: true,
  default_member_permissions: null,

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const userId = interaction.user.id;

      const res = await fetch(`${config.apiBaseUrl}/export/${userId}`, {
        headers: {
          Authorization: `Bearer ${config.botAPIToken}`
        }
      });

      if (!res.ok) {
        const error = await res.text();
        logger.warn(`[ExportData] API error: ${error}`);
        return interaction.editReply('❌ Failed to fetch your system export.');
      }

      const json = await res.json();
      const buffer = Buffer.from(JSON.stringify(json, null, 2));
      const file = new AttachmentBuilder(buffer, { name: 'corebot-export.json' });

      await interaction.user.send({
        content: 'Here is your full system export:',
        files: [file]
      });

      return interaction.editReply('✅ Export sent via DM!');
    } catch (err) {
      logger.error('[ExportData] Failed to export data:', err);
      return interaction.editReply('❌ Something went wrong while generating your export.');
    }
  }
};