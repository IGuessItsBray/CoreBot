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
require('./init/initEvents').init(client);
require('./init/initLogs').init(client);

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
//CrossChat
const { bot } = require('./src/bot');
const { setup } = require('./src/index');
function formatDate() {
	const date = new Date();

	return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}`;
}
setup(bot, config);
bot.connect();
bot.on('error', (err) => console.log(`${formatDate()} : ${err.stack || err.message}`));
bot.on('warn', (msg) => console.log(`${formatDate()} : ${msg}`));

//Modules
const buttons = require("./modules/buttons");
console.log('✅ Buttons │ Buttons online!');
buttons(client);
const ctv = require("./modules/ctv");
// ------------------------------------------------------------------------------
