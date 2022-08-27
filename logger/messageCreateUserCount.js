const fn = require('../util/genUtils')
const { addToUser } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageCreate User COunt',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: "MESSAGE_CREATE",
            limit: 1
        });
        await addToUser(message.author.id, message.guild.id, 1, message.content.length);
    },

    // ------------------------------------------------------------------------------
};