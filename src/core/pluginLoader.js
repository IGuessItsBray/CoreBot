const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const EventRouter = require("./eventRouter");
const CommandRouter = require("./commandRouter");
const PluginManager = require("./pluginManager");

const config = require("../../config/config.json");

class PluginLoader {
  constructor(container) {
    this.container = container;

    // These routers must support .removePluginEvents(name) and .removePluginCommands(name)
    this.eventRouter = new EventRouter(container);
    this.commandRouter = new CommandRouter(container);

    const logger = container.get("logger");
    this.pluginManager = new PluginManager(logger);
  }

  /**
   * Returns an array of all currently loaded plugin names
   * Useful for slash command autocomplete
   */
  getLoadedPluginNames() {
    return Array.from(this.pluginManager.plugins.keys());
  }

  async loadPlugins() {
    const logger = this.container.get("logger");
    const pluginsDir = path.join(__dirname, "../plugins");
    const folders = fs.readdirSync(pluginsDir);

    /* STEP 1: Register plugins */
    for (const folder of folders) {
      const pluginFolder = path.join(pluginsDir, folder);
      const pluginPath = path.join(pluginFolder, "plugin.js");

      if (!fs.existsSync(pluginPath)) continue;

      const plugin = require(pluginPath);

      if (plugin.enabled === false) {
        logger.info(`Skipping disabled plugin: ${plugin.name}`);
        continue;
      }

      plugin.__folder = pluginFolder;
      this.pluginManager.register(plugin);
    }

    /* STEP 2: Resolve dependency order */
    const orderedPlugins = this.pluginManager.resolveLoadOrder();

    /* STEP 3: Initialize plugins */
    for (const plugin of orderedPlugins) {
      logger.info(`Initializing plugin: ${plugin.name}`);

      // 1. Setup internal logic
      await plugin.init?.(this.container);

      // 2. Attach listeners
      this.eventRouter.registerEvents(plugin);

      // 3. Load commands into memory
      this.commandRouter.loadPluginCommands(plugin.__folder, plugin.name);

      // 4. Start active tasks (intervals, etc)
      await plugin.start?.(this.container);
    }

    /* STEP 4: Attach the global interaction listener */
    this.commandRouter.attachInteractionListener();

    /* STEP 5: Sync with Discord API */
    await this.deployCommands();
  }

  async deployCommands() {
    const logger = this.container.get("logger");
    const commands = this.commandRouter.getCommandSchema();
    const rest = new REST({ version: "10" }).setToken(config.discord.token);

    try {
      logger.info(`Deploying ${commands.length} slash commands to Discord...`);
      await rest.put(
        Routes.applicationCommands(config.discord.clientId),
        { body: commands }
      );
      logger.info("Slash commands deployed successfully.");
    } catch (err) {
      logger.error(err, "Failed to deploy slash commands");
    }
  }

  async reloadPlugin(pluginName) {
    const logger = this.container.get("logger");
    const pluginsDir = path.join(__dirname, "../plugins");
    const pluginFolder = path.join(pluginsDir, pluginName);
    const pluginPath = path.join(pluginFolder, "plugin.js");

    if (!fs.existsSync(pluginPath)) {
      logger.warn(`Cannot reload: Plugin folder not found for ${pluginName}`);
      return;
    }

    try {
      logger.info(`--- Starting Reload: ${pluginName} ---`);

      const oldPlugin = this.pluginManager.plugins.get(pluginName);

      /* 1. Trigger the Stop Hook */
      if (oldPlugin?.stop) {
        logger.debug(`Calling stop() hook for ${pluginName}`);
        await oldPlugin.stop(this.container);
      }

      /* 2. Physical Cleanup */
      // Remove listeners from the Client
      this.eventRouter.removePluginEvents(pluginName);
      
      // Remove command logic from CommandRouter
      this.commandRouter.removePluginCommands(pluginName);

      /* 3. Cache Busting */
      // We must delete the specific plugin files from Node's memory 
      // otherwise 'require' just grabs the old version.
      Object.keys(require.cache).forEach((key) => {
        if (key.startsWith(pluginFolder)) {
          delete require.cache[key];
        }
      });

      /* 4. Re-Load & Re-Register */
      const plugin = require(pluginPath);
      plugin.__folder = pluginFolder;
      
      this.pluginManager.register(plugin);

      /* 5. Re-Initialize Lifecycle */
      await plugin.init?.(this.container);
      this.eventRouter.registerEvents(plugin);
      this.commandRouter.loadPluginCommands(pluginFolder, plugin.name);
      await plugin.start?.(this.container);

      /* 6. Update Discord Slash Commands */
      await this.deployCommands();

      logger.info(`--- Reload Successful: ${pluginName} ---`);
    } catch (err) {
      logger.error(err, `Critical error during reload of ${pluginName}`);
    }
  }
}

module.exports = PluginLoader;