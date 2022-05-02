module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'channelCreate Example',
    type: 'channelCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "CHANNEL_CREATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**CHANNEL:** Channel <#${target.id}> \`${target.name}\`| created by <@${executor.id}> | time`);
    },

    // ------------------------------------------------------------------------------
};