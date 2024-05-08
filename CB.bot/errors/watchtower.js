const Discord = require("discord.js");
const {
  Client,
  Intents,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const config = require("../util/localStorage");

module.exports = {
  boot,
  startAPI,
};

async function boot(client, data) {
  const g = "955230769939353623";
  const c = "1234488052005470331";
  const t = "1234490192438755338";
  const proxyMsgs = data.proxyMsgs;
  const proxyMembers = data.proxyMembers;
  const gsize = data.gsize;
  const csize = data.csize;
  const shardCount = data.shardCount;
  const res = await client.shard.broadcastEval(
    async (client, { g, c, t, data }) => {
      if (client.guilds.cache.get(g)) {
        const guild = await client.guilds.fetch(g);
        const channel = await guild.channels.fetch(c);
        const thread = await channel.threads.fetch(t);
        const { EmbedBuilder } = require("discord.js");
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Watchtower Alert!" })
          .setDescription(
            `Bot is online - <t:${Math.floor(
              client.readyAt.getTime() / 1000.0
            )}:R><t:${Math.floor(client.readyAt.getTime() / 1000.0)}:D>
          **${data.gsize} Guilds**
          **${data.csize} Channels**
          **${data.shardCount} Shards**
          **${data.proxyMembers} Proxies**
          **${data.proxyMsgs} Proxied Messages**`
          )
          .setFooter({ text: `Watchtower` })
          .setTimestamp();
        return await thread.send({ embeds: [embed] });
      }
    },
    { context: { g, c, t, data } }
  );
}

async function startAPI(client, data) {
  const g = "955230769939353623";
  const c = "1234488052005470331";
  const t = "1234490192438755338";
  const res = await client.shard.broadcastEval(
    async (client, { g, c, t, data }) => {
      if (client.guilds.cache.get(g)) {
        const guild = await client.guilds.fetch(g);
        const channel = await guild.channels.fetch(c);
        const thread = await channel.threads.fetch(t);
        const { EmbedBuilder } = require("discord.js");
        const embed2 = new EmbedBuilder()
          .setAuthor({ name: "Watchtower Alert!" })
          .setDescription(
            `API is online - <t:${Math.floor(
              client.readyAt.getTime() / 1000.0
            )}:R><t:${Math.floor(client.readyAt.getTime() / 1000.0)}:D>
            **API - ${data.apiip}:${data.apiport}**
            **Stats - ${data.statip}:${data.statport}**`
          )
          .setFooter({ text: `Watchtower` })
          .setTimestamp();
        return await thread.send({ embeds: [embed2] });
      }
    },
    { context: { g, c, t, data } }
  );
}
