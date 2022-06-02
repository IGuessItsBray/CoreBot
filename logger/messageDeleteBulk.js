const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDeleteBulk Example',
    type: 'messageDeleteBulk',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MESSAGE_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = fn.getDateAndTime()
        const { executor, target } = log;
        const messageDeleted = new Date()
        const logCreated = log.createdAt;
        messageDeleted.setMilliseconds(0);
        logCreated.setMilliseconds(0);
        if (logCreated == messageDeleted) {
            const sendchannel = await channel.client.channels.fetch((await getLogChannel(channel.guild.id)).logChannel);
            const embed = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`**MULTIPLE MESSAGES DELETED:** Sent by ${channel.member} in ${channel.channel} | ${time}
        \`\`\`${channel.content}\`\`\``)
            await sendchannel.send({
                embeds: [embed],
                allowedMentions: { parse: [] },
            });
        }
        else {
            console.log
        }
    },

    // ------------------------------------------------------------------------------
};