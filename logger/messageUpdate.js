const fn = require('../util/genUtils')
module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'messageUpdate Example',
    type: 'messageUpdate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(oldMessage, newMessage) {
        const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
            type: "MESSAGE_UPDATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const time = await fn.getDateAndTime()
        const { executor, target } = log;
        const sendchannel = await oldMessage.client.channels.fetch('955266949447811072');
        await sendchannel.send({
            content: `**MESSAGE:** Message sent by ${oldMessage.member} in ${oldMessage.channel}| *Edited;*
            Old message: \`${oldMessage.content}\`
            New Message: \`${newMessage.content}\` 
            ${time}`,
            allowedMentions: { parse: [] },
        });
    },

    // ------------------------------------------------------------------------------
};