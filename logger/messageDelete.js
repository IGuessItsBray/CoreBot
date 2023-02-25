const fn = require('../util/genUtils')
const { getServerSettings, getTboxContent } = require('../db/dbAccess');
const axios = require('axios');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDelete',
    type: 'messageDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(message) {
        const fetchedLogs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const guild = message.guild.id
        const content = await getTboxContent(guild)
        const cleanContent = content.content
        const { executor, target } = log;
        const sendchannel = await message.client.channels.fetch((await getServerSettings(message.guild.id)).logChannel);
        const PKTOKEN = require('../config.json').PKTOKEN;
        if (PKTOKEN) {
            try {
                const requestConfig = { headers: { 'Authorization': PKTOKEN } };
                const res = await axios.get(`https://api.pluralkit.me/v2/messages/${message.id}`, requestConfig);
                if (res?.status === 200) return;
                console.log(res)
            }
            catch { undefined; }
        }
        const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`**MESSAGE DELETED:** Sent by ${message.member} in ${message.channel} | ${time}
        \`\`\`${message.content}\`\`\``)
        .setFooter({ text: `${message.id}` })
        if (message.content === cleanContent) {
        }
        else {
            await sendchannel.send({
                embeds: [ embed ],
                allowedMentions: { parse: [] },
            });
        }

    },

    // ------------------------------------------------------------------------------
};