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
			require('../commands/public/remind').buttonHandling(interaction);
		}
	},

	// ------------------------------------------------------------------------------
};