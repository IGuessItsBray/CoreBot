const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('Bot');
const Sentry = require('@sentry/node');
const handleCommands = require('./handlers/commandHandler');

// Initialize Sentry if enabled
if (config.sentry?.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
  });
  logger.info('Sentry initialized.');
}

// Create Discord client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Ready event
client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

// Interaction handling
client.on('interactionCreate', async (interaction) => {
    try {
      await handleCommands(interaction, client);
    } catch (err) {
      logger.error('Error handling interaction:', err);
      if (config.sentry?.enabled) Sentry.captureException(err);
    }
  });

// Login
client.login(config.token).catch(err => {
  logger.error('Login failed:', err);
  if (config.sentry?.enabled) Sentry.captureException(err);
});