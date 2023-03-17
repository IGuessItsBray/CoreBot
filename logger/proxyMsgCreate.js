const fn = require('../util/genUtils')
const { getMembersByTag, getMembers } = require('../db/dbAccess');
const axios = require('axios');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'proxy MsgCreate',
    type: 'messageCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const guild = message.guild.id
        const user = message.author.tag
        const owner = message.author.id
        const content = message.content
        const channel = message.channel
        const m = await getMembers(owner)
        const tags = m.map(m => m.tags)
        //console.log(tags)
        if (content.startsWith(tags)) {

        };
        if (!content.startsWith(tags)) {
            return;
        };
    },

    // ------------------------------------------------------------------------------
};