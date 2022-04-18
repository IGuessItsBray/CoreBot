const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const config = require("./config.json");
const { Player } = require('discord-player')
const { token } = require('./config.json');
const { readdirSync } = require('fs');

//Hello World!!


//CrossChat
const { bot } = require('./src/bot');
const { setup } = require('./src/index');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.once('ready', () => {
	client.user.setPresence({
		activities: [
			{
				type: 'WATCHING',
				name: `${client.guilds.cache.size} Discord Servers`
			},
		],
		status: 'online'
	});


	// Listening / Event Handling
	// Command consumption and handling
	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;
		const guild = interaction.guild;
		const user = interaction.user;
		const subcommand = interaction.options._subcommand ?? ``;
		try {
			//console.log(`${guild.id}: ${user.tag}: Executed ${interaction.commandName} ${subcommand}`);
			await client
				.commands.get(interaction.commandName)
				.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Something went wrong executing this interaction.',
				ephemeral: true,
			}).catch(() => {
				console.error(`${guild.id}: ${user.tag}: Something went wrong executing this interaction.`)
			});
		}
	});
});



//Cross Server Chat 
function formatDate() {
	const date = new Date();

	return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}`;
}

setup(bot, config);

bot.connect();

bot.on('error', (err) => console.log(`${formatDate()} : ${err.stack || err.message}`));
bot.on('warn', (msg) => console.log(`${formatDate()} : ${msg}`));

client.once('ready', () => {
	console.log('✅ Bot │ Bot online!');
});

// Create & Initialize the DB connection
require('./db/mongo').initMongo();



//Addons
client.login(token);
const buttons = require("./buttons");
console.log('✅ Buttons │ Buttons online!');
buttons(client);
//const joinleave = require("./joinleave");
//joinleave(client);
console.log('✅ JoinLeave │ JoinLeave online!');
const logs = require("./logs");
logs(client);
console.log('✅ Logs │ Logs Active!');
const ctv = require("./modules/ctv");