// ------------------------------------------------------------------------------
// bot.js
// The actual running of the bot.
// ------------------------------------------------------------------------------

const { config } = require('./util/localStorage');
const { Client, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus: Status } = require('discord.js');
const Sentry = require('@sentry/node');
const schedule = require('node-schedule');

// Sentry.init({ dsn: config.DSN, environment: config.DEVMODE ? 'development' : 'production' });

const client =
	new Client({
	    intents: [
	        GatewayIntentBits.Guilds,
	        GatewayIntentBits.GuildMessages,
	    ],
	    partials: [
	        Partials.Message,
	    ],
	});

// ------------------------------------------------------------------------------
// Initializing Bot Components
// ------------------------------------------------------------------------------

// Open this shard's DB Connection
require('./db/mongo').init(false);

// Register Events & Commands on this shard's Client
require('./init/initCommands').init(client);
require('./init/initEvents').init(client);

client.login(config.TOKEN);
client.once('ready', async () => {
    let i = 0;
    // Extracted function to update the bot's status
    async function updateStatus() {
        const appFacts = await require('./util/genUtils').getAppFacts(client);
        const { formatNumber } = require('./util/genUtils');
        const { getAllStats } = require('./db/dbStats');

        const devMode = config.DEVMODE;
        const stats = (await getAllStats()).map(stat => ({
            name: stat.name,
            value: formatNumber(stat.value),
            placeholder: stat.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        }));
        const status = [
            // Statuses to cycle through
            ...(devMode ? [`devmode - s${client.shard.ids.map(s => s + 1).join(', ')} - ${appFacts.tagName}`] : []),
            ...config.STATUS,
        ].map(s => s.replace(/%(\w+)%/g, (_, key) => stats.find(stat => stat.placeholder === key)?.value ?? '-1'));
        client.user.setPresence({
            activities: [{
                type: ActivityType.Custom,
                name: status[i],
            }],
            status: devMode ? Status.Idle : Status.Online,
        });
        i = (i + 1) % status.length;
    }
    // Update the status for the first time
    updateStatus();
    // Schedule the status update function to run every 10 minutes
    schedule.scheduleJob('*/10 * * * *', updateStatus);
    // assign a reference to the client to the vars file
    require('./util/vars').shard = client.shard;
});

// ------------------------------------------------------------------------------