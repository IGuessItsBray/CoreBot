// ------------------------------------------------------------------------------
// initCommands.js
// Initializes commands and loads them into the client
// ------------------------------------------------------------------------------

const { Collection } = require('discord.js');
const cmdUtils = require('../util/commandUtils');

module.exports = {
	init,
};

// ------------------------------------------------------------------------------

function init(client) {
	const {
		publicCommands,
		privateCommands,
	} = cmdUtils.readFiles();

	client.commands = new Collection();
	for (const command of [...publicCommands, ...privateCommands]) {
		if (!command.enabled) continue;
		client.commands[command.name] = command;
	}

	client.on('interactionCreate', async interaction => {
		if (!interaction.isCommand() && !interaction.isContextMenu()) return;
		const guild = interaction.guild;
		const user = interaction.user;
		const channel = interaction.channel
		const subcommand = interaction.options._subcommand ?? '';

		try {
			if (interaction.channel.type == 'DM') {
				console.log(`DM: ${user.tag}: Executed ${interaction.commandName} ${subcommand}`)
			}
			else {
				console.log(`${guild.name} | ${channel.name}: ${user.tag}: Executed ${interaction.commandName} ${subcommand}`);
				await client
					.commands[interaction.commandName]
					.execute(interaction);
			}
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Something went wrong executing this interaction, see console.',
				ephemeral: true,
			}).catch(() => {
				console.error(`${guild.id}: ${user.tag}: Something went wrong executing this interaction.`);
			});
		}
	});
}

// ------------------------------------------------------------------------------