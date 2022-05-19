const fn = require('../util/genUtils')
const { getLogChannel } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildBanRemove Example',
    type: 'guildBanRemove',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MEMBER_BAN_REMOVE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target, GuildAuditLogsEntry } = log;
        const sendchannel = await channel.client.channels.fetch((await getLogChannel(channel.guild.id)).logChannel);
        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**MEMBER:** Member <@${target.id}> \`${target.username}\`| Unbanned by <@${executor.id}>| ${time}`)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};