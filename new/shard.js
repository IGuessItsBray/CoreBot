// ------------------------------------------------------------------------------
// shard.js
// The actual running of the bot but sharded.
// ------------------------------------------------------------------------------

const { ShardingManager } = require('discord.js');
const { TOKEN: token, DSN, DEVMODE } = require('./util/localStorage').config;
const schedule = require('node-schedule');
const Sentry = require('@sentry/node');

// Sentry.init({ dsn: DSN, environment: DEVMODE ? 'development' : 'production' });

const options = {};

// Console Info
const appFacts = require('./util/genUtils').gitInfo();
const message = `Non-Production Build ${appFacts.tagName} on ${appFacts.branchName} branch`;
console.log('-'.repeat(message.length));
console.log(message);
console.log('-'.repeat(message.length));
if (DEVMODE) {
    options['amount'] = 2;
    console.log('Spawning 2 shards instead of auto.');
    console.log('-'.repeat(message.length));
}

// Database Compilation & Initialization
require('./db/mongo').init();
// Schema Indexes
require('./db/schemas/exceptionSchema').initIndex();
// Programmatically Initialize Codes Functions

// Bring UP the Shards
const manager = new ShardingManager('bot-sharded.js', { token });
manager.on('shardCreate', shard => {
    const shardLog = `Launched shard ${shard.id} `;
    console.log(`${shardLog}${'-'.repeat(message.length - shardLog.length)}`);
});
manager.spawn(options)
    .then(() => {
        require('./util/vars').shard = manager;

        // every 5 minutes, update stats
        schedule.scheduleJob('*/5 * * * *', async () => {
            const { updateStat, getAllStats } = require('./db/dbStats');
            const { countAllCodes } = require('./db/dbCodes');
            const { shard } = require('./util/vars');
            // Game Count
            const gameCount = Number(Object.keys(require('./util/vars').games).length).toLocaleString();
            await updateStat('game-count', Number(gameCount));
            // Code Count
            const codeCount = Number(await countAllCodes()).toLocaleString();
            await updateStat('code-count', Number(codeCount));
            // Guild Count
            const guildCount = await shard
                .fetchClientValues('guilds.cache.size')
                .then(results => results.reduce((acc, guildCount) => acc + guildCount, 0));
            await updateStat('guild-count', Number(guildCount));
            // User Count
            const userCount = await shard
                .broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
                .then(results => results.reduce((acc, userCount) => acc + userCount, 0));
            await updateStat('user-count', Number(userCount));
        });
    });