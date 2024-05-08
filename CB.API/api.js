const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const { apiip, apiport, statip, statport, token } = require("./config.json");

module.exports = { client };

client.login(token);
client.once("ready", async () => {
  require("./api/db/mongo").init();
  const req = require("express/lib/request");
  require("./api/express").init(apiport);

  const g = "955230769939353623";
  const c = "1234488052005470331";
  const t = "1234490192438755338";
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
            **API - ${apiip}:${apiport}**
            **Stats - ${statip}:${statport}**`
    )
    .setFooter({ text: `Watchtower` })
    .setTimestamp();
  return await thread.send({ embeds: [embed2] });
});
