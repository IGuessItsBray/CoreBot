const { ModalBuilder, TextInputBuilder } = require('discord.js')
module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'Button Routing',
	type: 'interactionCreate',

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction) {
		if (!interaction.isButton()) return;

		if (interaction.customId.startsWith('r')) {
			require('../commands/misc/remind').buttonHandling(interaction);
		}
		if (interaction.customId.startsWith('nt')) {
			require('../commands/modmail/sendButton').buttonHandling(interaction);
		}
	},

	// ------------------------------------------------------------------------------
};