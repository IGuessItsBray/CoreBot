const fn = require('../util/genUtils')
const { getServerSettings } = require('../db/dbAccess');
const { CommandInteraction, MessageEmbed, Intents } = require("discord.js");
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildBanAdd Example',
    type: 'guildBanAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MEMBER_BAN_ADD",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target, GuildAuditLogsEntry } = log;
          const sendchannel = await channel.client.channels.fetch((await getServerSettings(channel.guild.id)).logChannel);
        const embed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**MEMBER:** Member <@${target.id}> \`${target.username}\`| Banned by <@${executor.id}>| ${time}`)
        await sendchannel.send({
            embeds: [ embed ],
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};