// src/bot.js
const { Client, GatewayIntentBits, Partials } = require("discord.js"); // 🔹 Added Partials

const Container = require("./core/container");
const PluginLoader = require("./core/pluginLoader");
const PluginWatcher = require("./core/pluginWatcher");

const RedisService = require("./services/redisService");
const EventBus = require("./services/eventBus");
const DatabaseService = require("./services/databaseService");
const LoggingService = require("./services/loggingService"); // 🔹 Added Logging Service

const logger = require("./utils/logger");
const config = require("./core/config");
const { BROADCAST_CHANNEL } = require("./core/constants");

async function startBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers, // 🔹 Required for Role/Member audit logs
    ],
    // 🔹 Partials allow the bot to see events for messages sent while it was offline
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember]
  });

  const container = new Container();

  /*
  Core services
  */
  container.register("logger", logger);
  container.register("client", client);
  container.register("config", config);

  /*
  Database (MongoDB)
  */
  const dbService = new DatabaseService(container);
  container.register("database", dbService);
  await dbService.init();

  /*
  Redis
  */
  const redis = new RedisService();
  await redis.connect();
  container.register("redis", redis);
  logger.info("Redis connected");

  /*
  Logging Service (Centralized logs)
  */
  const loggingService = new LoggingService(container);
  container.register("logging", loggingService);

  /*
  Event Bus (built on Redis)
  */
  const eventBus = new EventBus(container);
  container.register("eventBus", eventBus);
  await eventBus.start();
  logger.info("EventBus started");

  /*
  Plugin system
  */
  const pluginLoader = new PluginLoader(container);
  container.register("pluginLoader", pluginLoader);
  await pluginLoader.loadPlugins();

  /*
  Hot plugin reload watcher
  */
  const watcher = new PluginWatcher(pluginLoader, container.get("logger"));
  watcher.start();

  /*
  Global Redis broadcast handler
  */
  await eventBus.subscribe(BROADCAST_CHANNEL, async (payload) => {
    const { action, plugin } = payload;
    if (!action) return;

    switch (action) {
      case "reloadPlugin":
        if (plugin) {
          try {
            await pluginLoader.reloadPlugin(plugin);
            logger.info(`Plugin reloaded via broadcast: ${plugin}`);
          } catch (err) {
            logger.error(err, `Failed to reload plugin via broadcast: ${plugin}`);
          }
        }
        break;
      default:
        logger.warn(`Unknown broadcast action: ${action}`);
    }
  });

  /*
  Discord ready event
  */
  client.once("ready", () => {
    const shard = client.shard ? client.shard.ids[0] : 0;
    logger.info(`Shard ${shard} ready as ${client.user.tag}`);
  });

  /*
  Login
  */
  await client.login(config.discord.token);
}

startBot().catch(err => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});