// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot.
// ------------------------------------------------------------------------------

const config = require('./config.json');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client =
	new Client({
		intents: [
			Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
		],
		partials: [
			'MESSAGE',
		],
	});

module.exports = { client };

// ------------------------------------------------------------------------------
// Initializing Bot Components
// ------------------------------------------------------------------------------

require('./db/mongo').init();
require('./init/initCommands').init(client);

client.login(token);

client.once('ready', () => {
	console.info(`Ready & Running as ${client.user.tag}`);
	client.user.setPresence({
		activities: [
			{
				type: 'WATCHING',
				name: `${client.guilds.cache.size} Discord Servers`
			},
		],
		status: 'online'
	});
});

// ------------------------------------------------------------------------------
// Addons
// ------------------------------------------------------------------------------
//Modules
const buttons = require("./modules/buttons");
console.log('✅ Buttons │ Buttons online!');
buttons(client);
//const joinleave = require("./modules/joinleave");
//joinleave(client);
console.log('✅ JoinLeave │ JoinLeave online!');
const logs = require("./modules/logs");
logs(client);
console.log('✅ Logs │ Logs Active!');
const ctv = require("./modules/ctv");
// ------------------------------------------------------------------------------
