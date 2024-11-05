const fn = require("../util/genUtils");
const { getJoin } = require("../db/dbAccess");
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require("discord.js");
const { getServerSettings } = require("../db/dbProxy");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "Join/Leave MEMBER JOINS",
  type: "guildMemberAdd",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(member) {
    const message = (await getServerSettings(member.guild.id)).joinMessage;
    const sendchannel = await member.client.channels.fetch(
      (
        await getServerSettings(member.guild.id)
      ).joinChannel
    );
    const user = member.user.id;
    await sendchannel.send(`<@${user}>, ${message}`);
  },

  // ------------------------------------------------------------------------------
};
