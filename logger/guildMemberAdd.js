module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildMemberAdd Example',
    type: 'guildMemberAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "EMOJI_CREATE",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const { executor, target } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**EMOJI:** Emoji <#${target.id}> \`${target.name}\`| Added by <@${executor.id}> | time`);
    },

    // ------------------------------------------------------------------------------
};