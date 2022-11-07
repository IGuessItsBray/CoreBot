const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require ('../../util/enum').Types;
const { setProxy } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'set-proxy',
    description: 'adds proxy to a member',
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
            name: 'proxy',
            description: 'The proxy for the member',
            type: OPTION.STRING,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const id = interaction.options.getString('member')
        const proxy = interaction.options.getString('proxy');
        await setProxy(id, proxy)
        interaction.reply({ content: `Proxy ${proxy} added to member!`, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};