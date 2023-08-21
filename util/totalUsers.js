// ------------------------------------------------------------------------------
// Function + Prop Exports

const { ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, ActionRowBuilder } = require("discord.js");
const { max } = require("moment/moment");

// ------------------------------------------------------------------------------
module.exports = {
	totalUsers
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function totalUsers() {
    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'), //This requests the client.guilds.cache.size from all servers in all shards
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)), //Basically math tbh, broadcastEval makes all the shards evaluate the given method, in this case is the reduce
    ];
    
    Promise.all(promises)
        .then(results => {
            const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
            const totalUsers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        })
}