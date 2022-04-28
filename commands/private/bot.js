const { MessageEmbed, Collection } = require('discord.js');
const { OPTION } = require ('../../util/enum').Types;
const cmdUtils = require('../../util/commandUtils');

// ------------------------------------------------------------------------------
// Reload Commands Subcommand
// ------------------------------------------------------------------------------

const reloadCommands = {
	options: {
		name: 'reload_commands',
		description: 'Reload Command files',
		type: OPTION.SUB_COMMAND,
		options: [],
	},
	execute: async function (interaction) {
		// Retrieve the client
		const client = require('../../index2.js').client;

		// Re-Read command files
		const {
			publicCommands,
			privateCommands,
		} = cmdUtils.readFiles();

		// Create a new collection of commands
		client.commands = new Collection();
		for (const command of [...publicCommands, ...privateCommands]) {
			if(!command.enabled) continue;
			client.commands[command.name] = command;
		}

		// Success message
		const statusEmbed = new MessageEmbed()
			.setColor('#2f3136')
			.setFooter({ text: `✅ ${this.options.name} finished` });
		interaction.editReply({ embeds: [statusEmbed] });
	},
};

// ------------------------------------------------------------------------------
// Register Commands Subcommand
// ------------------------------------------------------------------------------

const registerCommands = {
	options: {
		name: 'register_commands',
		description: 'Register/Deploy Commands',
		type: OPTION.SUB_COMMAND,
		options: [],
	},
	execute: async function (interaction) {
		// Redeploy the commands
		require('../../util/commandUtils').deploy(false);

		// Success message
		const statusEmbed = new MessageEmbed()
			.setColor('#2f3136')
			.setFooter({ text: `✅ ${this.options.name} finished` });
		interaction.editReply({ embeds: [statusEmbed] });
	},
};

// ------------------------------------------------------------------------------
// Reload Mongo Subcommand
// ------------------------------------------------------------------------------

const reloadMongo = {
	options: {
		name: 'reload_mongo',
		description: 'Reload the MongoDB Connection.',
		type: OPTION.SUB_COMMAND,
		options: [],
	},
	execute: async function (interaction) {
		(await require('../../db/mongo').mongoose())
			.disconnect()
			.then(() => {
				require('../../db/mongo').initMongo(false);
			});

		const statusEmbed = new MessageEmbed()
			.setColor('#2f3136')
			.setFooter({ text: `✅ ${this.options.name} finished` });
		interaction.editReply({ embeds: [statusEmbed] });
	},
};

// ------------------------------------------------------------------------------
// Command Execution
// ------------------------------------------------------------------------------

module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'bot',
	description: 'Bot Utilities & Setup',
	type: '1',
	enabled: true,

	// ------------------------------------------------------------------------------
	// Options
	// ------------------------------------------------------------------------------

	options: [
		reloadMongo.options,
		reloadCommands.options,
		registerCommands.options,
	],

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction, ephemeral = true) {
		await interaction.deferReply({ ephemeral });

		switch (interaction.options.getSubcommand()) {

		case registerCommands.options.name:
			registerCommands.execute(interaction);
			break;

		case reloadCommands.options.name:
			reloadCommands.execute(interaction);
			break;

		case reloadMongo.options.name:
			reloadMongo.execute(interaction);
			break;

		}
	},

};