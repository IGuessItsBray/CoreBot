// corebot/apps/bot/handlers/commandHandler.js

const config = require('../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../shared/utils/logger')('Bot');
const path = require('path');
const fs = require('fs');

const publicCommandsPath = path.join(__dirname, '../commands/public');
const privateCommandsPath = path.join(__dirname, '../commands/private');

const commands = new Map();

function loadCommandsFrom(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(dir, file));
    if (command.enabled !== false) {
      commands.set(command.name, command);
    }
  }
}

loadCommandsFrom(publicCommandsPath);
loadCommandsFrom(privateCommandsPath);

module.exports = async (interaction) => {
  try {
    // ============================
    // Slash Commands
    // ============================
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;

      logger.info(`[Command] guild: ${interaction.guild?.name} (${interaction.guild?.id}) channel: ${interaction.channel?.name} (${interaction.channel?.id}) - /${interaction.commandName}`);

      await command.execute(interaction);
      return;
    }

    // ============================
    // Modal Submissions
    // ============================
    if (interaction.isModalSubmit()) {
      logger.info(`[Modal Submit] guild: ${interaction.guild?.name} (${interaction.guild?.id}) channel: ${interaction.channel?.name} (${interaction.channel?.id}) - ${interaction.customId}`);

      // ----- System Creation -----
      if (interaction.customId === 'createSystemModal') {
        const name = interaction.fields.getTextInputValue('system_name');
        const description = interaction.fields.getTextInputValue('system_description');
        const avatar = interaction.fields.getTextInputValue('system_avatar');
        const banner = interaction.fields.getTextInputValue('system_banner');

        try {
          const checkRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`);
          const checkData = await checkRes.json();
          if (checkRes.ok && checkData.systemId) {
            return await interaction.reply({ content: '⚠️ You already have a system. You cannot create more than one.', ephemeral: true });
          }

          const systemRes = await fetch(`${config.apiBaseUrl}/system`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ownerId: interaction.user.id, name, description, avatar, banner })
          });

          const systemData = await systemRes.json();
          if (!systemRes.ok) throw new Error(systemData.error || 'Unknown error');

          await fetch(`${config.apiBaseUrl}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discordId: interaction.user.id, systemId: systemData.id })
          });

          await interaction.reply({ content: `✅ System created: **${systemData.name}**`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] System creation failed:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create system. Please try again.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      // ----- Proxy Creation -----
      if (interaction.customId.startsWith('addProxyModal:')) {
        const systemId = interaction.customId.split(':')[1];

        const data = {
          name: interaction.fields.getTextInputValue('proxy_name'),
          avatar: interaction.fields.getTextInputValue('proxy_avatar'),
          banner: interaction.fields.getTextInputValue('proxy_banner'),
          pronouns: interaction.fields.getTextInputValue('proxy_pronouns'),
          description: interaction.fields.getTextInputValue('proxy_description')
        };

        try {
          const response = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Proxy **${result.name}** created!`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Failed to create proxy:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create proxy. Please try again.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      // ----- Proxy Edit -----
      if (interaction.customId.startsWith('editProxyModal:')) {
        const [, systemId, proxyId] = interaction.customId.split(':');

        const updatedData = {
          name: interaction.fields.getTextInputValue('proxy_name'),
          avatar: interaction.fields.getTextInputValue('proxy_avatar'),
          banner: interaction.fields.getTextInputValue('proxy_banner'),
          pronouns: interaction.fields.getTextInputValue('proxy_pronouns'),
          description: interaction.fields.getTextInputValue('proxy_description')
        };

        try {
          const response = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies/${proxyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Proxy **${result.name}** has been updated.`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Failed to update proxy:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to update proxy. Please try again.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      // ----- Group Creation -----
      if (interaction.customId.startsWith('createGroupModal:')) {
        const systemId = interaction.customId.split(':')[1];

        const data = {
          name: interaction.fields.getTextInputValue('group_name'),
          avatar: interaction.fields.getTextInputValue('group_avatar'),
          banner: interaction.fields.getTextInputValue('group_banner'),
          description: interaction.fields.getTextInputValue('group_description')
        };

        try {
          const response = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Group **${result.name}** created!`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Failed to create group:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create group. Please try again.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      // ----- Group Edit -----
      if (interaction.customId.startsWith('editGroupModal:')) {
        const [, systemId, groupId] = interaction.customId.split(':');

        const updatedData = {
          name: interaction.fields.getTextInputValue('group_name'),
          avatar: interaction.fields.getTextInputValue('group_avatar'),
          banner: interaction.fields.getTextInputValue('group_banner'),
          description: interaction.fields.getTextInputValue('group_description')
        };

        try {
          const response = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups/${groupId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Group **${result.name}** has been updated.`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Failed to update group:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to update group. Please try again.', ephemeral: true }).catch(() => null);
        }
        return;
      }
    }

    // ============================
    // Autocomplete
    // ============================
    if (interaction.isAutocomplete()) {
      const { commandName, options, user, guild, channel } = interaction;
      const focused = options.getFocused(true);

      logger.info(`[Autocomplete] guild: ${guild?.name} (${guild?.id}) channel: ${channel?.name} (${channel?.id}) - ${commandName} → "${focused.value}"`);

      const userRes = await fetch(`${config.apiBaseUrl}/user/${user.id}`);
      const userData = await userRes.json();
      if (!userData?.systemId) return await interaction.respond([]);

      const systemId = userData.systemId;

      const fetchAndFilter = async (endpoint, getListFn) => {
        try {
          const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/${endpoint}`);
          const items = await res.json();
          const filtered = items
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(i => i.name.toLowerCase().includes(focused.value.toLowerCase()))
            .slice(0, 25)
            .map(getListFn);
          return await interaction.respond(filtered);
        } catch (err) {
          logger.error(`[Autocomplete] Failed to fetch ${endpoint}:`, err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          return await interaction.respond([]);
        }
      };

      if ([
        'editproxy',
        'deleteproxy',
        'setavatar',
        'settags',
        'setbanner',
        'proxyinfo'
      ].includes(commandName)) {
        return fetchAndFilter('proxies', p => ({ name: `${p.id} - ${p.name}`, value: p.id }));
      }
if (commandName === 'autoproxy' && focused.name === 'member') {
  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${user.id}`);
    const userData = await userRes.json();
    if (!userRes.ok || !userData?.systemId) return await interaction.respond([]);

    const proxyRes = await fetch(`${config.apiBaseUrl}/system/${userData.systemId}/proxies`);
    const proxies = await proxyRes.json();

    const filtered = proxies
      .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 25)
      .map(p => ({ name: `${p.name} (${p.id})`, value: p.id }));

    return await interaction.respond(filtered);
  } catch (err) {
    logger.error('[Autocomplete] Failed to fetch proxies for autoproxy:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
    return await interaction.respond([]);
  }
}
      if (commandName === 'lookupproxy') {
        try {
          const res = await fetch(`${config.apiBaseUrl}/proxy`);
          const allMembers = await res.json();
          const filtered = allMembers
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(m => m.name.toLowerCase().includes(focused.value.toLowerCase()))
            .slice(0, 25)
            .map(m => ({ name: `${m.name} (${m.id})`, value: m.id }));

          return await interaction.respond(filtered);
        } catch (err) {
          logger.error('[Autocomplete] Failed to fetch all members for lookupproxy:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          return await interaction.respond([]);
        }
      }

      if ([
        'groupinfo',
        'editgroup',
        'deletegroup',
        'lookupgroup'
      ].includes(commandName)) {
        return fetchAndFilter('groups', g => ({ name: `${g.id} - ${g.name}`, value: g.id }));
      }

      if (commandName === 'addmembertogroup') {
        if (focused.name === 'proxy') {
          return fetchAndFilter('proxies', p => ({ name: `${p.name}`, value: p.id }));
        }
        if (focused.name === 'group') {
          return fetchAndFilter('groups', g => ({ name: `${g.name}`, value: g.id }));
        }
      }

      if (commandName === 'removememberfromgroup') {
        try {
          if (focused.name === 'group') {
            return fetchAndFilter('groups', g => ({ name: g.name, value: g.id }));
          }
          if (focused.name === 'proxy') {
            const groupId = options.getString('group');
            if (!groupId) return await interaction.respond([]);

            const groupRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`);
            const groups = await groupRes.json();
            const selectedGroup = groups.find(g => g.id === groupId);
            if (!selectedGroup) return await interaction.respond([]);

            const memberRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`);
            const members = await memberRes.json();

            const filteredMembers = members
              .filter(m => selectedGroup.members.includes(m.id))
              .filter(m => m.name.toLowerCase().includes(focused.value.toLowerCase()))
              .slice(0, 25)
              .map(m => ({ name: m.name, value: m.id }));

            return await interaction.respond(filteredMembers);
          }
        } catch (err) {
          logger.error('[Autocomplete] Failed to fetch data for removememberfromgroup:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          return await interaction.respond([]);
        }
      }
      if (commandName === 'setid') {
        const type = options.getString('type');
        const userId = options.getString('user');
        const focused = options.getFocused(true);
      
        if (!type || !userId) return await interaction.respond([]);
      
        try {
          const userRes = await fetch(`${config.apiBaseUrl}/user/${userId}`);
          const userData = await userRes.json();
          if (!userRes.ok || !userData?.systemId) return await interaction.respond([]);
      
          const systemId = userData.systemId;
      
          if (type === 'member') {
            const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`);
            const data = await res.json();
            const filtered = data
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
              .slice(0, 25)
              .map(p => ({ name: `${p.name} (${p.id})`, value: p.id }));
            return await interaction.respond(filtered);
          }
      
          if (type === 'group') {
            const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`);
            const data = await res.json();
            const filtered = data
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(g => g.name.toLowerCase().includes(focused.value.toLowerCase()))
              .slice(0, 25)
              .map(g => ({ name: `${g.name} (${g.id})`, value: g.id }));
            return await interaction.respond(filtered);
          }
      
          if (type === 'system') {
            const res = await fetch(`${config.apiBaseUrl}/system/${systemId}`);
            const system = await res.json();
            return await interaction.respond([
              { name: `${system.name} (${system.id})`, value: system.id }
            ]);
          }
        } catch (err) {
          logger.error('[Autocomplete] Failed to fetch data for /setid:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          return await interaction.respond([]);
        }
      }
      if (commandName === 'listproxies' && focused.name === 'system') {
        try {
          const res = await fetch(`${config.apiBaseUrl}/system`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const systems = await res.json();
      
          const filtered = systems
            .filter(s => s.name.toLowerCase().includes(focused.value.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 25)
            .map(s => ({ name: `${s.name} (${s.id})`, value: s.id }));
      
          return await interaction.respond(filtered);
        } catch (err) {
          logger.error('[Autocomplete] Failed to fetch systems:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          return await interaction.respond([]);
        }
      }
    }

    // ============================
    // Button Interactions
    // ============================
    if (interaction.isButton()) {
      logger.info(`[Button] guild: ${interaction.guild?.name} (${interaction.guild?.id}) channel: ${interaction.channel?.name} (${interaction.channel?.id}) - ${interaction.customId}`);

      if (interaction.customId === 'deleteProxy_cancel') {
        await interaction.update({
          content: '❌ Operation cancelled.',
          components: [],
        });
        return;
      }

      if (interaction.customId.startsWith('deleteProxy_confirm:')) {
        const [, systemId, proxyId] = interaction.customId.split(':');

        if (interaction.user.id !== interaction.message.interaction.user.id) {
          return await interaction.reply({
            content: '⚠️ Only the user who ran the command can use these buttons.',
            ephemeral: true,
          });
        }

        try {
          const response = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies/${proxyId}`, {
            method: 'DELETE',
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Unknown error');

          await interaction.update({
            content: `✅ Proxy \`${proxyId}\` has been deleted.`,
            components: [],
          });
        } catch (err) {
          logger.error(`[Button] Failed to delete proxy ${proxyId}:`, err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.update({
            content: '❌ Failed to delete proxy. Please try again.',
            components: [],
          });
        }

        return;
      }
    }
  } catch (err) {
    logger.error('Error handling interaction:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '⚠️ There was an error while processing this interaction.',
        ephemeral: true,
      }).catch(() => null);
    } else {
      await interaction.reply({
        content: '⚠️ There was an error while processing this interaction.',
        ephemeral: true,
      }).catch(() => null);
    }
  }
};
