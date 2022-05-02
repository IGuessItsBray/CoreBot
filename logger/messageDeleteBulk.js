module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'emojiCreate Example',
    type: 'emojiCreate',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        guild.fetchAuditLogs(CHANNEL_CREATE)
            .then(audit => console.log(audit.entries.first()))
            .catch(console.error);
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "EMOJI_CREATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**EMOJI:** Emoji <#${target.id}> \`${target.name}\`| Added by <@${executor.id}> | ${time}`);
    },

    // ------------------------------------------------------------------------------
};