const fn = require('../util/genUtils')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'threadUpdate Example',
    type: 'threadUpdate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel, message) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "THREAD_UPDATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send({
            content: `**THREAD:** Thread <#${channel.id}> updated | Created by <@${channel.ownerId}> | ${time}`,
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};