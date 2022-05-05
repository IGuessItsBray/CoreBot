const fn = require('../util/genUtils')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageDeleteBulk Example',
    type: 'messageDeleteBulk',

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
        const messageDeleted = new Date()
        const logCreated = log.createdAt;
        messageDeleted.setMilliseconds(0);
        logCreated.setMilliseconds(0);
        if (logCreated == messageDeleted) {
            const sendchannel = await channel.client.channels.fetch('955266949447811072');
            await sendchannel.send({
                content: `**MESSAGE:** Multiple messages \`${channel.content}\` sent by ${channel.member} in ${channel.channel}| Deleted by <@${executor.id}> | ${time}`,
                allowedMentions: { parse: [] },
            });
        }
        else {
            console.log
        }
    },

    // ------------------------------------------------------------------------------
};