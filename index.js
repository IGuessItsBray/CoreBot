// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot
// ------------------------------------------------------------------------------

const { config } = require('./util/localStorage');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const { token } = require('./util/localStorage').config;
const { blue, bold, underline, yellow, red, green } = require('colorette');
const client =
	new Client({
		intents: [
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildBans,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
		],
		partials: [
			Partials.Message,
			Partials.Channel,
			Partials.Reaction,
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
	const guilds = client.guilds.cache;
	var totalUsers = 0;

	guilds.forEach((guild) => {
		totalUsers += guild.memberCount;
	});
	console.info(underline(blue(`
	Ready & Running as ${client.user.tag}
	${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${totalUsers} Users`)));
	console.log(blue(`
${client.user.tag}
Made with ♥️ by iguessitsbray, seth and pmass
For help, contact iguessitsbray
Support server: https://discord.gg/GAAj6DDrCJ
`))
	client.user.setPresence({
		activities: [{
			type: ActivityType.Custom,
			name: `CoreBot!`,
		}],
		status: 'online',
	});

});

// ------------------------------------------------------------------------------
// Addons
// ------------------------------------------------------------------------------
//Modules
const buttons = require("./modules/buttons");
console.log(green('✅ Buttons │ Buttons online!'));
buttons(client);
console.log(green('✅ Reminders │ Remind online!'));
