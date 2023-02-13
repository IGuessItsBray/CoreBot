const fn = require('../util/genUtils')
const { addToUser } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageCreate User Count',
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
        await addToUser(message.author.id, message.guild.id, 1, message.content.length);
    },

    // ------------------------------------------------------------------------------
};