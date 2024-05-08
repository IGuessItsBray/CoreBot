//File of methods w sharding

//Fetch guild
const client = interaction.client
const id = interaction.options.getString('guild');
const promise = client.shard.broadcastEval(
    (c, { guildId }) => {
        return c.guilds.cache.get(guildId);
    },
    { context: { guildId: id } }
);
const result = (await promise).find(e => e);