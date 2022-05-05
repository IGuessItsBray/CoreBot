const fn = require('../util/genUtils')
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
            type: "ROLE_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send({
            content: `**ROLE:** Role \`${channel.name}\`| Deleted by <@${executor.id}> | ${time}`,
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};