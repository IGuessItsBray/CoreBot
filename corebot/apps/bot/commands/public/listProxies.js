// corebot/apps/bot/commands/public/listProxies.js

const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../../../config/configLoader');
const paginate = require('../../../../shared/utils/paginateHandler');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('ListProxy');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'listproxies',
  description: 'List all proxies in your system or another system.',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  // ============================
  // Options
  // ============================
  options: [
    {
      name: 'system',
      description: 'Select a system to view (optional)',
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true
    },
    {
      name: 'ephemeral',
      description: 'Whether the response should be ephemeral (default: true)',
      type: ApplicationCommandOptionType.Boolean,
      required: false
    }
  ],

  // ============================
  // Execution
  // ============================
  async execute(interaction) {
    logger.info('[ListProxy] Fetching user data...');
    const systemOverride = interaction.options.getString('system');
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

    try {
      let systemId;

      if (systemOverride) {
        systemId = systemOverride;
        logger.info(`[ListProxy] Using provided system ID: ${systemId}`);
      } else {
        const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
        const userData = await userRes.json();
        if (!userData?.systemId) {
          return await interaction.reply({
            content: '❌ You do not have a system set up.',
            ephemeral: true
          });
        }
        systemId = userData.systemId;
        logger.info(`[ListProxy] Using system ID: ${systemId}`);
      }

      logger.info('[ListProxy] Fetching proxies...');
      const proxiesRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`);
      const proxies = await proxiesRes.json();

      logger.info(`[ListProxy] Total proxies found: ${proxies.length}`);

      if (!Array.isArray(proxies) || proxies.length === 0) {
        return await interaction.reply({
          content: '⚠️ No proxies found for this system.',
          ephemeral: true
        });
      }

      const entries = proxies
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(p => {
          const tags = (p.proxyTags || []).join(', ') || 'No tags';
          return `\`${p.id}\` ${p.name} - ${tags}`;
        });

      // Paginate entries with soft limit of ~1900 characters per page
      const pages = [];
      let current = '';
      for (const entry of entries) {
        if ((current + entry + '\n').length > 1900) {
          pages.push(current);
          current = '';
        }
        current += entry + '\n';
      }
      if (current) pages.push(current);

      await paginate(interaction, pages, { ephemeral });
    } catch (err) {
      logger.error('[ListProxy] Failed to fetch or display proxies:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to list proxies. Check logs for details.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};