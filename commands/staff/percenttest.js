const { Client, Intents, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, CommandInteraction, ApplicationCommandType } = require('discord.js');
const { PermissionFlagsBits, ButtonStyle } = require('discord.js');
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ptest',
    description: 'percent test',
    type: ApplicationCommandType.ChatInput,
    enabled: true,
    permissions: [PermissionFlagsBits.SendMessages],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'votes',
            description: 'votes',
            type: OPTION.NUMBER,
            required: true,
        },
        {
            name: 'voters',
            description: 'voters',
            type: OPTION.NUMBER,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const votes = interaction.options.getNumber('votes');
        const voters = interaction.options.getNumber('voters');
        const percent = `${votes / voters * 100}`
        interaction.reply(`${percent}%`)
    },

    // ------------------------------------------------------------------------------
};