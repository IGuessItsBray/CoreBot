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
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Intents.FLAGS.DIRECT_MESSAGES,
		],
		partials: [
			'MESSAGE',
			'CHANNEL',
			'REACTION',
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
	console.info(`
	Ready & Running as ${client.user.tag}
	${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${client.users.cache.size} Users`);
	//const version = require(config.version);
	if (client.user.id === "955267092800733214") {
		const status = [
			`Dev build`,
			"Not a production version",
			"Made with ♥️",
			"Unstable!",
			"I probably crashed lol"
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [
					{
						type: 'WATCHING',
						name: newActivity
					},
				],
				status: 'online'
			});
		}, 10000);
		const embed = new MessageEmbed()
			.setColor('#2f3136')
			.setAuthor('Status Update')
			.setDescription(`<@${client.user.id}> is online! <:ONLINE:960716360416124990> `)
			.setFooter({ text: "Corebot" })
			.setTimestamp();
		client.channels.cache.get("1013084321478885386").send({ embeds: [embed] });
	}
	if (client.user.id === "950525282434048031") {
		const status = [
			`CB v3.0.0`,
			"also checkout CBMusic!",
			"Made with ♥️",
			"Built on DJS13",
			"Hi Seth!",
			`${client.guilds.cache.size} Discord Servers`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [
					{
						type: 'WATCHING',
						name: newActivity
					},
				],
				status: 'online'
			});
		}, 10000);
		
		const embed = new MessageEmbed()
			.setColor('#2f3136')
			.setAuthor('Status Update')
			.setDescription(`<@${client.user.id}> is online! <:ONLINE:960716360416124990> `)
			.setFooter({ text: "Corebot" })
			.setTimestamp();
		client.channels.cache.get("1013084321478885386").send({ embeds: [embed] });
	}
	if (client.user.id === "1019253573139316776") {
		const status = [
			`CB Beta v3.0.0`,
			"Not prod lol",
			"Made with ♥️",
			"Built on DJS13, not 14",
			"Updates daily!",
			`${client.guilds.cache.size} Discord Servers`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setPresence({
				activities: [
					{
						type: 'WATCHING',
						name: newActivity
					},
				],
				status: 'online'
			});
		}, 10000);
		
		const embed = new MessageEmbed()
			.setColor('#2f3136')
			.setAuthor('Status Update')
			.setDescription(`<@${client.user.id}> is online! <:ONLINE:960716360416124990> `)
			.setFooter({ text: "Corebot" })
			.setTimestamp();
		client.channels.cache.get("1013084321478885386").send({ embeds: [embed] });
	}

});

// ------------------------------------------------------------------------------
// Addons
// ------------------------------------------------------------------------------
//Modules
const buttons = require("./modules/buttons");
console.log('✅ Buttons │ Buttons online!');
buttons(client);
const ctv = require("./modules/ctv");

const discordModals = require('discord-modals');
discordModals(client);
// ------------------------------------------------------------------------------
// Text Spam
//-------------------------------------------------------------------------------
console.log(`
 ------------------------------------------------------
| 					CoreBot							   |
|	Made with ♥️ by Bray#1051, Seth#0110 and PMass#0001	|
|	      For help, contact @Bray#1051                 |
|	Support server: (https://discord.gg/GAAj6DDrCJ)	   |
 ------------------------------------------------------
`)