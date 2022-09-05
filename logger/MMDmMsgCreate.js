const fn = require('../util/genUtils')
const { updateMessageLog } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents, MessageReaction } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'ModMail DM Msg Create',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        if (message.channel.type == 'DM');
        console.log
    },

    // ------------------------------------------------------------------------------
};