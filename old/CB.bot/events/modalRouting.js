const { ModalBuilder, TextInputBuilder } = require('discord.js')
module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'Modal Routing',
	type: 'interactionCreate',

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;

		if (interaction.customId.startsWith('ntms')) {
			require('../commands/modmail/sendButton').modalHandling(interaction);
		}
       // if (interaction.customId.startsWith('newTicketMan')) {
			//require('../commands/modmail/newTicket').modalHandling(interaction);
		//}
	},

	// ------------------------------------------------------------------------------
};