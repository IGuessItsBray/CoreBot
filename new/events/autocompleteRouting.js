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

        if (['error'].includes(interaction.commandName)) {
            require('../commands/private/error').autoComplete(interaction);
        }

    },

    // ------------------------------------------------------------------------------
};