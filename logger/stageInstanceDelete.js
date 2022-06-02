const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'stageInstanceDelete Example',
    type: 'stageInstanceDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel, message) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "STAGE_INSTANCE_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch((await getLogChannel(channel.guild.id)).logChannel);
        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**STAGE:** Stage \`${channel.channel}\` ended | ${time}
        Topic: 
        \`\`\`${channel.topic}\`\`\``)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};