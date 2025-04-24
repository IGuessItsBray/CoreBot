const fn = require("../util/genUtils");
const { getLeave } = require("../db/dbAccess");
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "guildMemberRemove join/leave MEMBER LEAVES",
  type: "guildMemberRemove",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(member) {
    const message = (await getServerSettings(member.guild.id)).leaveMessage;
    const sendchannel = await member.client.channels.fetch(
      (
        await getServerSettings(member.guild.id)
      ).leaveChannel
    );
    const user = member.user.id;
    await sendchannel.send(`<@${user}>, ${message}`);
  },

  // ------------------------------------------------------------------------------
};
