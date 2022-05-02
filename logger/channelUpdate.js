module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'channelUpdate Example',
    type: 'channelUpdate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "CHANNEL_UPDATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**CHANNEL:** Channel <#${target.id}> \`${target.name}\`| Updated by <@${executor.id}> | time`);
    },

    // ------------------------------------------------------------------------------
};