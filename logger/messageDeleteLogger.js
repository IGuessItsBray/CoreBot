const fn = require('../util/genUtils')
const { setDeletedMessageLog } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDelete Logger',
    type: 'messageDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageCreate,
            limit: 1
        });
        //console.log(message)
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        await setDeletedMessageLog(message);
    },

    // ------------------------------------------------------------------------------
};