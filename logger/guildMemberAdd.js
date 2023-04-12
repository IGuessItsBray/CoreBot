const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require('discord.js');
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildMemberAdd Example',
    type: 'guildMemberAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.GuildMemberAdd,
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
          const sendchannel = await channel.client.channels.fetch((await getServerSettings(channel.guild.id)).logChannel);
        const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`**MEMBER:** Member joined | ${time}
        Name: <@${channel.id}> \`${channel.displayName}\`
        Created at: ${channel.createdAt}
        Flags: ${channel.flags}`)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};