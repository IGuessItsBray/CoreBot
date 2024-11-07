// ------------------------------------------------------------------------------
// initCommands.js
// Initializes commands and loads them into the client
// ------------------------------------------------------------------------------

const { Collection, InteractionType } = require("discord.js");
const cmdUtils = require("../util/commandUtils");
const { addException } = require("../db/dbAccess");
const { blue, bold, underline, yellow, red, green } = require("colorette");
require("../modules/instrument");
const Sentry = require("@sentry/node");
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
		...privateCommands,
	]) {
		if (!command.enabled) continue;
		client.commands[command.name] = command;
	}

	client.on("interactionCreate", async (interaction) => {
		if (interaction.type !== InteractionType.ApplicationCommand) return;

		const guild = interaction.guild;
		const user = interaction.user;
		const type = "Command"
		const subcommand = interaction.options._subcommand ?? '';
		const group = interaction.options._group ?? '';
		const options = (subcommand || group ? interaction.options.data[0].options : interaction.options.data)
			.map(option => `${option.name}:${option.value}`).join(' ');

		const logPrefix = `${client.shard.ids[0] + 1}-${guild.id}-${user.id}`;
		const logCommand = `${interaction.commandName}${group ? ` ${group} ` : ''}${subcommand} ${options ? `${options} ` : ''}`;
		try {
			console.log(`${logPrefix}: /${logCommand}`);
			await client
				.commands[interaction.commandName]
				.execute(interaction, undefined, interaction.locale);
		}
		catch (error) {
			if (error.message.includes('Shards are still being spawned')) {
				await interaction.reply({
					content: 'The bot is still starting up, please try again in a few minutes.'
						+ '\n-# Need help? Join our [support server](<https://discord.gg/PW7VzKtGSn>)',
					ephemeral: true,
				}).catch(() => {
					console.error(`${logPrefix}: Something went wrong executing this interaction.`);
				});
			}
			else {
				Sentry.captureException(error, `${logPrefix}: Something went wrong executing this interaction.`);
				const dbException = await addException(
					error,
					logCommand,
					type,
					interaction?.guild?.id,
					interaction?.channel?.id,
					interaction?.user?.id,
				).catch(() => undefined);
				console.log(`${logPrefix}: Exception logged - ${dbException?.identifier}, ${error.message}`);
				await interaction.reply({
					content: 'Something went wrong executing this interaction.'
						+ `\n-# Error Identifier: \`${dbException.identifier}\``
						+ '\n-# Need help? Join our [support server](<https://discord.gg/PW7VzKtGSn>)',
					ephemeral: false,
				}).catch(() => {
					console.error(`${logPrefix}: Something went wrong executing this interaction.`);
				});
			}
		}
	});
}

// ------------------------------------------------------------------------------