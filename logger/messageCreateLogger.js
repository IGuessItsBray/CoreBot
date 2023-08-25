const fn = require("../util/genUtils");
const { updateMessageLog, addToUser } = require("../db/dbAccess");
const {
  CommandInteraction,
  MessageEmbed,
  Intents,
  MessageReaction,
  AuditLogEvent,
} = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "messageCreate Logger",
  type: "messageCreate",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(message) {
    if (message.channel.type == "DM") return;
    const fetchedLogs = await message.guild.fetchAuditLogs({
      type: AuditLogEvent.MessageCreate,
      limit: 1,
    });
    //console.log(message)
    const log = fetchedLogs.entries.first();
    const time = await fn.getDateAndTime();
    const { executor, target } = log;
    await updateMessageLog(message);
    await addToUser(
      message.author.id,
      message.guild.id,
      1,
      message.content.length
    );
  },

  // ------------------------------------------------------------------------------
};
