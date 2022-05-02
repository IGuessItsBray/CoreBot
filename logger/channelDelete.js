const fn = require('../util/genUtils')
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
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**CHANNEL:** Channel <#${target.id}> \`${target.name}\`| Deleted by <@${executor.id}> | ${time}`);
    },

    // ------------------------------------------------------------------------------
};