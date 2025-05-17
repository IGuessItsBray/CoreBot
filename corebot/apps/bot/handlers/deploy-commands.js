const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const config = require('../../../config/configLoader');
const logger = require('../../../shared/utils/logger')('DeployCommands');

const rest = new REST({ version: '10' }).setToken(config.token);

// Load commands from folder
function loadCommandsFrom(dir) {
  const commands = [];
  const files = readdirSync(dir).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(dir, file));
    if (!command?.name || !command?.description || command.enabled === false) {
      logger.warn(`[Deploy] Skipping invalid command file: ${file}`);
      continue;
    }

    // Build command payload manually
    commands.push({
      name: command.name,
      description: command.description,
      type: command.type || 1, // Default to ChatInput
      options: command.options || []
    });
  }

  return commands;
}

(async () => {
  try {
    logger.info('🔁 Registering public commands globally...');
    const publicCommandsPath = path.join(__dirname, '../commands/public');
    const publicCommands = loadCommandsFrom(publicCommandsPath);

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: publicCommands }
    );
    logger.info(`✅ Registered ${publicCommands.length} public command(s) globally.`);

    logger.info(`🔁 Registering private commands to guild ${config.devGuilds}...`);
    const privateCommandsPath = path.join(__dirname, '../commands/private');
    const privateCommands = loadCommandsFrom(privateCommandsPath);

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.devGuilds),
      { body: privateCommands }
    );
    logger.info(`✅ Registered ${privateCommands.length} private command(s) to ${config.devGuilds}.`);

    logger.info('✨ Command registration complete.');
  } catch (err) {
    logger.error('❌ Failed to register commands:', err);
  }
})();