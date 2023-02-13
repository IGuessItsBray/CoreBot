const fn = require('../util/genUtils')
const { updateMessageLog } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents, MessageReaction } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageCreate Logger',
    type: 'MessageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        if (message.channel.type == "DM") return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageCreate,
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