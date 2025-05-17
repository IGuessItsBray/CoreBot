// corebot/apps/bot/commands/public/import.js

const { ApplicationCommandType } = require('discord.js');
const config = require('../../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../../shared/utils/logger')('Import');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: 'import',
  description: 'Import members and groups from a PluralKit-style JSON file.',
  type: ApplicationCommandType.ChatInput,
  enabled: true,

  options: [
    {
      name: 'file',
      description: 'Upload your PluralKit-style .json file',
      type: 11,
      required: false
    },
    {
      name: 'url',
      description: 'Or provide a direct URL to a .json file',
      type: 3,
      required: false
    }
  ],

  async execute(interaction) {
    const file = interaction.options.getAttachment('file');
    const url = interaction.options.getString('url');
    logger.info(`[Import] file.name = ${file?.name}`);
    logger.info(`[Import] url = ${url}`);
    let jsonURL;
    if (file && file.name.endsWith('.json')) {
      jsonURL = file.url;
    } else if (url && url.toLowerCase().includes('.json')) {
      jsonURL = url;
    } else {
      return await interaction.reply({
        content: '❌ Please upload a valid `.json` file or provide a URL.',
        ephemeral: true
      });
    }

    logger.info(`[Import] Fetching from: ${jsonURL}`);

    try {
      const res = await fetch(jsonURL);
      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType?.includes('application/json')) {
        const raw = await res.text();
        logger.error(`[Import] Invalid file response. Status: ${res.status}, Content preview: ${raw.slice(0, 200)}`);
        return await interaction.reply({
          content: '❌ Failed to fetch file. It might be expired, blocked, or not valid JSON.',
          ephemeral: true
        });
      }

      const data = await res.json();

      if (!data.members || !Array.isArray(data.members)) {
        logger.error('[Import] Invalid JSON: no members array');
        return await interaction.reply({
          content: '❌ JSON is missing a valid `members` array.',
          ephemeral: true
        });
      }

      const userRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) {
        return await interaction.reply({
          content: '❌ You do not have a system set up yet.',
          ephemeral: true
        });
      }

      const systemId = userData.systemId;
      const [existingProxies, existingGroups] = await Promise.all([
        fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`).then(r => r.json()),
        fetch(`${config.apiBaseUrl}/system/${systemId}/groups`).then(r => r.json())
      ]);

      let importedMembers = 0;
      let importedGroups = 0;

      for (const member of data.members) {
        if (existingProxies.find(p => p.name === member.name)) continue;

        const proxyTags = member.proxy_tags?.flatMap(tag => {
          const tags = [];
          if (tag.prefix) tags.push(tag.prefix);
          if (tag.suffix) tags.push(tag.suffix);
          return tags;
        }) || [];

        const payload = {
          name: member.name,
          display_name: member.display_name || '',
          avatar: member.avatar_url || '',
          banner: '',
          pronouns: member.pronouns || '',
          description: member.description || '',
          proxyTags
        };

        logger.info(`[Import] Creating proxy: ${member.name} → Tags: [${proxyTags.join(', ')}]`);

        await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        importedMembers++;
      }

      for (const group of data.groups || []) {
        if (existingGroups.find(g => g.name === group.name)) continue;

        const payload = {
          name: group.name,
          description: group.description || '',
          avatar: '',
          banner: '',
          memberIds: group.members || [],
          systemId
        };

        logger.info(`[Import] Creating group: ${group.name}`);

        await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        importedGroups++;
      }

      await interaction.reply({
        content: `✅ Import complete: ${importedMembers} proxies, ${importedGroups} groups.`,
        ephemeral: true
      });
    } catch (err) {
      logger.error('[Import] Failed to import JSON:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
      await interaction.reply({
        content: '❌ Failed to import data. Check file structure and console logs.',
        ephemeral: true
      }).catch(() => null);
    }
  }
};