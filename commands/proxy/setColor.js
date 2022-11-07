const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { setProxy } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'set-color',
    description: 'adds color to a member',
    type: COMMAND.CHAT_INPUT,
	enabled: true,
	permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'member',
            description: 'The member to add proxy to',
            type: OPTION.STRING,
            required: true,
            autocomplete: true
        },
        {
            name: 'color',
            description: 'The color for the member',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const id = interaction.options.getString('member')
        const color = interaction.options.getString('color');
        await setProxy(id, color)
        interaction.reply({ content: `color ${color} set for member!`, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};