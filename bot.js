// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot
// ------------------------------------------------------------------------------

const { config } = require('./util/localStorage');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const { token } = require('./util/localStorage').config;
const { blue, bold, underline, yellow, red, green } = require('colorette');
//const {totalUsers} = require("./util/totalUsers.js");
//const {statusChanger} = require("./util/status");
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
require('./modules/api/express').init(4500);

client.login(token);
client.once('ready', async () => {
	const guilds = client.guilds.cache;
	var totalUsers = 0;

	guilds.forEach((guild) => {
		totalUsers += guild.memberCount;
	});

	console.log(client.shard.count)
	if (client.user.id === "955267092800733214") {
		const status = [
			`Dev build`,
			"Not a production version",
			"Made with ♥️",
			"Unstable!",
			"I probably crashed lol",
			`Serving ${totalUsers} users!`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [{
					type: ActivityType.Custom,
					name: `${newActivity}`,
				}],
				status: 'dnd',
			});
		}, 10000);
	}
	if (client.user.id === "950525282434048031") {
		const status = [
			`CB v4.0.0`,
			"Made with ♥️",
			"Built on DJS14",
			"Hi Seth!",
			`Serving ${totalUsers} users!`
				`${client.guilds.cache.size} Discord Servers`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [{
					type: ActivityType.Custom,
					name: `${newActivity}`,
				}],
				status: 'online',
			});
		}, 10000);

	}
	if (client.user.id === "1019253573139316776") {
		const status = [
			`CB Beta v4.0.0`,
			"Not prod lol",
			"Made with ♥️",
			"Built on DJS14",
			"Updates daily!",
			`${client.guilds.cache.size} Servers | ${totalUsers} users!`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [{
					type: ActivityType.Custom,
					name: `${newActivity}`,
				}],
				status: 'idle',
			});
		}, 10000);
	}


	console.info(underline(blue(`
	Ready & Running as ${client.user.tag}
	${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${totalUsers} Users`)));
	console.log(blue(`
${client.user.tag}
Made with ♥️ by iguessitsbray, seth and pmass
For help, contact iguessitsbray
Support server: https://discord.gg/GAAj6DDrCJ
`))
});
// ------------------------------------------------------------------------------
// Addons
// ------------------------------------------------------------------------------
//Modules
const buttons = require("./modules/buttons");
console.log(green('✅ Buttons │ Buttons online!'));
buttons(client);
console.log(green('✅ Reminders │ Remind online!'));
