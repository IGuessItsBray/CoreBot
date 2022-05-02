const fn = require('../util/genUtils')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDelete Example',
    type: 'messageDelete',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MESSAGE_DELETE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**MESSAGE:** Message  ${target.name}| Deleted by <@${executor.id}> | ${time}`);
    },

    // ------------------------------------------------------------------------------
};