const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, CommandInteraction } = require('discord.js');
const { FLAGS } = require('discord.js').Permissions;
const { COMMAND, OPTION, CHANNEL } = require('../../util/enum').Types;
const { setAP } = require('../../db/dbAccess');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'set-ap',
    description: 'set the autoproxy status for your account',
    type: COMMAND.CHAT_INPUT,
    enabled: true,
    permissions: [FLAGS.SEND_MESSAGES],

    // ------------------------------------------------------------------------------
    // Options
    // ------------------------------------------------------------------------------

    options: [
        {
            name: 'status',
            description: 'is AP on or off?',
            type: OPTION.BOOLEAN,
            required: true,
        },
    ],

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------

    async execute(interaction) {
        const ap = interaction.options.getBoolean('status')
        const userID = interaction.user.id
        await setAP(userID, ap)
        interaction.reply({ content: `Autoproxy set to ${ap}`, ephemeral: true })
    },

    // ------------------------------------------------------------------------------
};