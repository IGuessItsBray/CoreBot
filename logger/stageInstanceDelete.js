const fn = require('../util/genUtils')
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
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send({
            content: `**STAGE:** Stage ${channel.channel} ended | The topic was \`${channel.topic}\` | ${time}`,
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};