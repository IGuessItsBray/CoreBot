const fn = require('../util/genUtils')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildMemberRemove Example',
    type: 'guildMemberRemove',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "GUILD_MEMBER_REMOVE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send({
            content: `**MEMBER:** Member <@${channel.id}> \`${channel.displayName}\` Left | ${time}`,
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};