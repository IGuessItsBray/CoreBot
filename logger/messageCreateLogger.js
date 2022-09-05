const fn = require('../util/genUtils')
const { updateMessageLog } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents, MessageReaction } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageCreate Logger',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        if (message.channel.type == 'DM') return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: "MESSAGE_CREATE",
            limit: 1
        });
        //console.log(message)
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        await updateMessageLog(message);
        
    },

    // ------------------------------------------------------------------------------
};