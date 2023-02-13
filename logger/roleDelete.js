const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { AuditLogEvent, Events } = require('discord.js');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'roleDelete Example',
    type: 'roleDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel, message) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.roleDelete,
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
          const sendchannel = await channel.client.channels.fetch((await getServerSettings(channel.guild.id)).logChannel);
        const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`**ROLE:** Role \`${channel.name}\`| Deleted by <@${executor.id}> | ${time}`)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};