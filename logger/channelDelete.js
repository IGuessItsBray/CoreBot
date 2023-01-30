const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'channelDelete Example',
    type: 'channelDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "CHANNEL_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch((await getServerSettings(channel.guild.id)).logChannel);
        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`**CHANNEL:** Channel <#${target.id}> \`${target.name}\`| Deleted by <@${executor.id}> | ${time}`)
        await sendchannel.send({
            embeds: [embed],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};