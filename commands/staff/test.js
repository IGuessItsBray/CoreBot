const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'test',
    description: 'autocomplete test',
    type: ApplicationCommandType.ChatInput,
	enabled: true,
	permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: '1',
            description: 'Option 1',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const value = interaction.options.getString('1');
        interaction.reply(value)
        console.log(interaction)
    },

    // ------------------------------------------------------------------------------
};