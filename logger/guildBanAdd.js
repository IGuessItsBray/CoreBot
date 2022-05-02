module.exports = {

    // ------------------------------------------------------------------------------
    // Definition
    // ------------------------------------------------------------------------------

    name: 'guildBanAdd Example',
    type: 'guildBanAdd',

    // ------------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------------
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            type: "MEMBER_BAN_ADD",
            limit: 1
        });
        const log = fetchedLogs.entries.first();
        const { executor, target, GuildAuditLogsEntry } = log;
        const sendchannel = await channel.client.channels.fetch('955266949447811072');
        await sendchannel.send(`**MEMBER:** Member <@${target.id}> \`${target.username}\`| Banned by <@${executor.id}>| time`);
    },

    // ------------------------------------------------------------------------------
};