const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('../../config/configLoader');
const createLogger = require('../../shared/utils/logger');
const logger = createLogger('Bot');
const Sentry = require('@sentry/node');
const handleCommands = require('./handlers/commandHandler');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ============================
// Sentry Initialization
// ============================
if (config.sentry?.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    tracesSampleRate: 1.0,
  });
  logger.info('Sentry initialized.');
}

// ============================
// Discord Client Setup
// ============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

client.once('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`);
});

// ============================
// Interaction Handling
// ============================
client.on('interactionCreate', async (interaction) => {
  try {
    await handleCommands(interaction, client);
  } catch (err) {
    logger.error('Error handling interaction:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
});

// ============================
// Login to Discord
// ============================
client.login(config.token).catch(err => {
  logger.error('Login failed:', err);
  if (config.sentry?.enabled) Sentry.captureException(err);
});

// ============================
// Latency Reporting to API
// ============================
setInterval(async () => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/status/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.botAPIToken}`,
      },
      body: JSON.stringify({
        source: 'bot',
        latency: client.ws.ping,
        timestamp: new Date().toISOString(),
        shardStatus: {
          '0': client.ws.status.toString()
        }
      }),
    });

    if (!res.ok) {
      logger.warn(`[Latency] Failed to post latency report: ${res.status}`);
    }
  } catch (err) {
    logger.error('[Latency] Error posting status report:', err);
    if (config.sentry?.enabled) Sentry.captureException(err);
  }
}, 30_000); // every 30 seconds