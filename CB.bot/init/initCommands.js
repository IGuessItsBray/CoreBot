// ------------------------------------------------------------------------------
// initCommands.js
// Initializes commands and loads them into the client
// ------------------------------------------------------------------------------

const { Collection, InteractionType } = require('discord.js');
const cmdUtils = require('../util/commandUtils');
const { blue, bold, underline, yellow, red, green } = require('colorette');
module.exports = {
	init,
};

// ------------------------------------------------------------------------------

function init(client) {
	const { 
		helpCommands,
		miscCommands,
		modCommands,
		proxyCommands,
		privateCommands,
		mmCommands,
	} = cmdUtils.readFiles();

	client.commands = new Collection();
	for (const command of [
		...helpCommands,
		...miscCommands,
		...modCommands,
		...proxyCommands,
		...mmCommands,
		...privateCommands
	]) {
		if (!command.enabled) continue;
		client.commands[command.name] = command;
	}

	client.on('interactionCreate', async interaction => {
		if (interaction.type !== InteractionType.ApplicationCommand) return;

		const guild = interaction.guild;
		const user = interaction.user;
		const channel = interaction.channel
		const subcommand = interaction.options._subcommand ?? '';

		try {
			if (interaction.channel.type == "DM") {
				console.log(green(`DM: ${user.tag}: Executed ${interaction.commandName} ${subcommand}`))
			}
			else {
				console.log(green(`${guild.name} | ${channel.name}: ${user.tag}: Executed ${interaction.commandName} ${subcommand}`));
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
				console.error(red(`${guild.id}: ${user.tag}: Something went wrong executing this interaction.`));
			});
		}
	});
}

// ------------------------------------------------------------------------------