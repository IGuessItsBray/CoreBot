// corebot/apps/bot/handlers/commandHandler.js

const config = require('../../../config/configLoader');
const Sentry = require('@sentry/node');
const logger = require('../../../shared/utils/logger')('Bot');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${config.botAPIToken}`
};

module.exports = async (interaction) => {
  try {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;
      logger.info(`[Command] /${interaction.commandName}`);
      await command.execute(interaction);
      return;
    }

    // Modal Submit Handlers
    if (interaction.isModalSubmit()) {
      const { customId, fields } = interaction;

      const updateThing = async (url, data, label) => {
        try {
          const res = await fetch(url, {
            method: 'PUT',
            headers: apiHeaders,
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Unknown error');
          await interaction.reply({ content: `✅ ${label} updated.`, ephemeral: true });
        } catch (err) {
          logger.error(`[Modal] Failed to update ${label}:`, err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: `❌ Failed to update ${label}.`, ephemeral: true }).catch(() => null);
        }
      };

      if (customId === 'createSystemModal') {
        const payload = {
          ownerId: interaction.user.id,
          name: fields.getTextInputValue('system_name'),
          description: fields.getTextInputValue('system_description'),
          avatar: fields.getTextInputValue('system_avatar'),
          banner: fields.getTextInputValue('system_banner')
        };

        try {
          const checkRes = await fetch(`${config.apiBaseUrl}/user/${interaction.user.id}`, { headers: apiHeaders });
          const checkData = await checkRes.json();
          if (checkRes.ok && checkData.systemId) {
            return await interaction.reply({ content: '⚠️ You already have a system.', ephemeral: true });
          }

          const res = await fetch(`${config.apiBaseUrl}/system`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(payload)
          });

          const sys = await res.json();
          if (!res.ok) throw new Error(sys.error || 'Unknown error');

          await fetch(`${config.apiBaseUrl}/user`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({ discordId: interaction.user.id, systemId: sys.id })
          });

          await interaction.reply({ content: `✅ System created: **${sys.name}**`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] System creation failed:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create system.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      if (customId.startsWith('editSystemModal:')) {
        const id = customId.split(':')[1];
        return updateThing(`${config.apiBaseUrl}/system/${id}`, {
          name: fields.getTextInputValue('system_name'),
          avatar: fields.getTextInputValue('system_avatar'),
          banner: fields.getTextInputValue('system_banner'),
          description: fields.getTextInputValue('system_description')
        }, 'System');
      }

      if (customId.startsWith('editGroupModal:')) {
        const [, systemId, groupId] = customId.split(':');
        return updateThing(`${config.apiBaseUrl}/system/${systemId}/groups/${groupId}`, {
          name: fields.getTextInputValue('group_name'),
          avatar: fields.getTextInputValue('group_avatar'),
          banner: fields.getTextInputValue('group_banner'),
          description: fields.getTextInputValue('group_description')
        }, 'Group');
      }

      if (customId.startsWith('createGroupModal:')) {
        const systemId = customId.split(':')[1];
        const payload = {
          name: fields.getTextInputValue('group_name'),
          description: fields.getTextInputValue('group_description'),
          systemId
        };

        try {
          const res = await fetch(`${config.apiBaseUrl}/group`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(payload)
          });

          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Group **${result.name}** created!`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Group creation failed:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create group.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      if (customId.startsWith('addProxyModal:')) {
        const systemId = customId.split(':')[1];
        const payload = {
          systemId,
          name: fields.getTextInputValue('proxy_name'),
          avatar: fields.getTextInputValue('proxy_avatar'),
          banner: fields.getTextInputValue('proxy_banner'),
          pronouns: fields.getTextInputValue('proxy_pronouns'),
          description: fields.getTextInputValue('proxy_description')
        };

        try {
          const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify(payload)
          });

          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Unknown error');

          await interaction.reply({ content: `✅ Proxy **${result.name}** created!`, ephemeral: true });
        } catch (err) {
          logger.error('[Modal Submit] Proxy creation failed:', err);
          if (config.sentry?.enabled) Sentry.captureException(err);
          await interaction.reply({ content: '❌ Failed to create proxy.', ephemeral: true }).catch(() => null);
        }
        return;
      }

      if (customId.startsWith('editProxyModal:')) {
        const [, systemId, proxyId] = customId.split(':');
        return updateThing(`${config.apiBaseUrl}/system/${systemId}/proxies/${proxyId}`, {
          name: fields.getTextInputValue('proxy_name'),
          avatar: fields.getTextInputValue('proxy_avatar'),
          banner: fields.getTextInputValue('proxy_banner'),
          pronouns: fields.getTextInputValue('proxy_pronouns'),
          description: fields.getTextInputValue('proxy_description')
        }, 'Proxy');
      }
    }

    // Button Interactions
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('deleteProxy_confirm:')) {
  const [, systemId, proxyId] = interaction.customId.split(':');

  if (interaction.user.id !== interaction.message.interaction.user.id) {
    return await interaction.reply({ content: '⚠️ Only the original user may confirm this action.', ephemeral: true });
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies/${proxyId}`, {
      method: 'DELETE',
      headers: apiHeaders
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Unknown error');

    await interaction.update({ content: `✅ Proxy \`${proxyId}\` deleted.`, components: [] });
  } catch (err) {
    logger.error('[Button] Failed to delete proxy:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
    await interaction.update({ content: '❌ Failed to delete proxy.', components: [] });
  }
}
    }

    // Autocomplete Interactions
    if (interaction.isAutocomplete()) {
      const autocompleteHandler = require('./autocompleteHandler');
      await autocompleteHandler(interaction);
    }
  } catch (err) {
    logger.error('[CommandHandler] Interaction error:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
    const msg = { content: '⚠️ There was an error processing this interaction.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => null);
    } else {
      await interaction.reply(msg).catch(() => null);
    }
  }
};
