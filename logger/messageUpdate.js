const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
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
        const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
            type: "MESSAGE_UPDATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await oldMessage.client.channels.fetch((await getLogChannel(oldMessage.guild.id)).logChannel);
        const embed = new MessageEmbed()
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