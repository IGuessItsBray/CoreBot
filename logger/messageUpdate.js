const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageUpdate Example',
    type: 'messageUpdate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(oldMessage, newMessage) {
        //console.log(oldMessage)
        //console.log(newMessage)
        const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageUpdate,
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const guildId = oldMessage.guild.id
        const rawDB = await getServerSettings(guildId)
        const data = rawDB.logChannel
        const sendchannel = await oldMessage.guild.channels.fetch(data)
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`**MESSAGE:** Message sent by ${oldMessage.member} in ${oldMessage.channel}| *Edited;*
        \`\`\`${oldMessage.content}\`\`\`
        \`\`\`${newMessage.content}\`\`\`
        ${time}`)
        await sendchannel.send({
            embeds: [embed],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};