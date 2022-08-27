// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot.
// ------------------------------------------------------------------------------

const config = require('./config.json');
const { Client, Intents, MessageEmbed } = require('discord.js');
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
	const embed = new MessageEmbed()
		.setColor('#2f3136')
		.setAuthor('Status Update')
		.setDescription('<@955267092800733214> is online! <:ONLINE:960716360416124990> ')
		.setFooter({ text: "Corebot" })
		.setTimestamp();
	client.channels.cache.get("1013084321478885386").send({ embeds: [embed] });
});

// ------------------------------------------------------------------------------
// Addons
// ------------------------------------------------------------------------------
//Modules
const buttons = require("./modules/buttons");
console.log('✅ Buttons │ Buttons online!');
buttons(client);
const ctv = require("./modules/ctv");
// ------------------------------------------------------------------------------
