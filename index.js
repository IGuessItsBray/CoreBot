// ------------------------------------------------------------------------------
// index.js
// The actual running of the bot.
// ------------------------------------------------------------------------------

const config = require('./config.json');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const { token } = require('./config.json');
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
Made with ♥️ by Bray#1051, Seth#0110 and PMass#0001
For help, contact @Bray#1051
Support server: https://discord.gg/GAAj6DDrCJ
`))
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
			client.user.setActivity(`${newActivity}`, { type: ActivityType.Watching });
		}, 10000);
		const embed = new EmbedBuilder()
			.setColor('#2f3136')
			.setAuthor({ name: 'Status Update' })
			.setDescription(`<@${client.user.id}> is online! <:ONLINE:960716360416124990> `)
			.setFooter({ text: "Corebot" })
			.setTimestamp();
		client.channels.cache.get("1013084321478885386").send({ embeds: [embed] });
	}
	if (client.user.id === "950525282434048031") {
		const status = [
			`CB v4.0.0`,
			"also checkout CBMusic!",
			"Made with ♥️",
			"Built on DJS14",
			"Hi Seth!",
			`Serving ${totalUsers} users!`
				`${client.guilds.cache.size} Discord Servers`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setActivity(`${newActivity}`, { type: ActivityType.Watching });
		}, 10000);

		const embed = new EmbedBuilder()
			.setColor('#2f3136')
			.setAuthor({ name: 'Status Update' })
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
			`${client.guilds.cache.size} Discord Servers`,
			`Serving ${totalUsers} users!`
		];
		setInterval(() => {
			const randomIndex = Math.floor(Math.random() * (status.length - 1) + 1);
			const newActivity = status[randomIndex];
			client.user.setActivity(`${newActivity}`, { type: ActivityType.Watching });
		}, 10000);

		const embed = new EmbedBuilder()
			.setColor('#2f3136')
			.setAuthor({ name: 'Status Update' })
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
console.log(green('✅ Buttons │ Buttons online!'));
buttons(client);
console.log(green('✅ Reminders │ Remind online!'));
