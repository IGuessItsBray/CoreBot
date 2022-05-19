const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const axios = require('axios');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {
    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDelete Example',
    type: 'messageDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel, message) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MESSAGE_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch((await getLogChannel(channel.guild.id)).logChannel);
        const PKTOKEN = require('../config.json').PKTOKEN;
        if (PKTOKEN) {
            try {
                const requestConfig = { headers: { 'Authorization': PKTOKEN } };
                const res = await axios.get(`https://api.pluralkit.me/v2/messages/${channel.id}`, requestConfig);
                if (res?.status === 200) return;
            }
            catch { undefined; }
        }
        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**MESSAGE DELETED:** Sent by ${channel.member} in ${channel.channel} | ${time}
        \`\`\`${channel.content}\`\`\``)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};