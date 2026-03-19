const fs = require("fs");
const path = require("path");

class CommandRouter {
  constructor(container) {
    this.container = container;
    this.client = container.get("client");
    this.logger = container.get("logger");

    // Command storage: Map of commandName => command object
    this.commands = new Map();
    
    // Reverse lookup: Map of pluginName => Set of commandNames
    this.pluginCommands = new Map();

    // Flag to ensure the global listener is only attached ONCE
    this.listenerAttached = false;
  }

  /**
   * Load all commands from a plugin's commands subdirectory
   */
  loadPluginCommands(pluginFolder, pluginName) {
    const commandsPath = path.join(pluginFolder, "commands");
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath);
    const commandNames = new Set();

    for (const file of commandFiles) {
      if (!file.endsWith(".js")) continue;

      const fullPath = path.join(commandsPath, file);

      try {
        const command = require(fullPath);

        if (!command?.data?.name) {
          this.logger.warn(`Invalid command structure in ${file} (Plugin: ${pluginName})`);
          continue;
        }

        const cmdName = command.data.name;

        // Add to global registry
        this.commands.set(cmdName, command);
        commandNames.add(cmdName);

        this.logger.debug(`Loaded command /${cmdName} from plugin ${pluginName}`);
      } catch (err) {
        this.logger.error(err, `Failed to load command file ${file}`);
      }
    }

    if (commandNames.size > 0) {
      this.pluginCommands.set(pluginName, commandNames);
    }
  }

  /**
   * Purges commands associated with a plugin from the registry
   */
  removePluginCommands(pluginName) {
    const commandNames = this.pluginCommands.get(pluginName);
    if (!commandNames) return;

    for (const cmdName of commandNames) {
      this.commands.delete(cmdName);
    }

    this.pluginCommands.delete(pluginName);
    this.logger.debug(`Purged commands for plugin: ${pluginName}`);
  }

  /**
   * Returns an array of Discord-ready JSON schemas for deployment
   */
  getCommandSchema() {
    return Array.from(this.commands.values()).map(cmd => cmd.data.toJSON ? cmd.data.toJSON() : cmd.data);
  }

  /**
   * Attaches the interaction listener ONCE. 
   * It looks up commands dynamically from the Map, so it never needs to be re-attached.
   */
  attachInteractionListener() {
    if (this.listenerAttached) return;

    this.client.on("interactionCreate", async (interaction) => {
      // 1. Resolve the command from the registry
      const command = this.commands.get(interaction.commandName);
      if (!command) return;

      try {
        // 2. Handle Autocomplete
        if (interaction.isAutocomplete()) {
          if (typeof command.autocomplete === "function") {
            await command.autocomplete(interaction, this.container);
          }
          return;
        }

        // 3. Handle Chat Input
        if (interaction.isChatInputCommand()) {
          if (typeof command.execute === "function") {
            await command.execute(interaction, this.container);
          }
        }
      } catch (err) {
        this.logger.error(err, `Error handling command /${interaction.commandName}`);
        
        // Final safety fallback for user feedback
        if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: "There was an internal error executing this command.", 
            ephemeral: true 
          });
        }
      }
    });

    this.listenerAttached = true;
    this.logger.info("CommandRouter: Persistent interaction listener attached.");
  }
}

module.exports = CommandRouter;