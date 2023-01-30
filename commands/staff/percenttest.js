const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ptest',
    description: 'percent test',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

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