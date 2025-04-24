const { InteractionType } = require('discord.js');

module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'Autocomplete Routing',
	type: 'interactionCreate',

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction) {
		if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;

		if (interaction.commandName === 'remind') {
			require('../commands/misc/remind').autoComplete(interaction);
		}
		if (interaction.commandName === "addtogroup") {
      require("../commands/proxy/addmembertogroup").autoComplete(interaction);
    }
	},

	// ------------------------------------------------------------------------------
};