const { addMasterLog } = require("../db/dbAccess");

module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "When the bot joins a Guild",
  type: "guildCreate",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------

  async execute(guild) {
    const g = "1350126112432328704";
  const c = "1350129794238644255";
  const t = "1350130482490118266";
  const res = await client.shard.broadcastEval(
    async (client, { g, c, t, data }) => {
      if (client.guilds.cache.get(g)) {
        const homeGuild = await client.guilds.fetch(g);
        const channel = await guild.channels.fetch(c);
        const thread = await channel.threads.fetch(t);
        const { EmbedBuilder } = require("discord.js");
        const embed = new EmbedBuilder()
          .setAuthor({ name: "Join Guild" })
          .setDescription(
            `The Bot has joined a server - <t:${Math.floor(
              client.readyAt.getTime() / 1000.0
            )}:R><t:${Math.floor(client.readyAt.getTime() / 1000.0)}:D>
            Name: ${guild.name}
            ID: ${guild.id}`
          )
          .setFooter({ text: `Logs` })
          .setTimestamp();
        return await thread.send({ embeds: [embed] });
      }
    },
    { context: { g, c, t, data } }
  );
    await addMasterLog(`Joined Guild ${guild.name} ${guild.id}`);
  },

  // ------------------------------------------------------------------------------
};
