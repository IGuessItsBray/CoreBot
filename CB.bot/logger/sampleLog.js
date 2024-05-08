const fn = require("../util/genUtils");
const { getServerSettings, getTboxContent } = require("../db/dbAccess");
const axios = require("axios");
const { CommandInteraction, EmbedBuilder, Intents } = require("discord.js");
const { AuditLogEvent, Events } = require("discord.js");
module.exports = {
  // ------------------------------------------------------------------------------
  // Definition
  // ------------------------------------------------------------------------------

  name: "Sample audit log",
  type: "",

  // ------------------------------------------------------------------------------
  // Execution
  // ------------------------------------------------------------------------------
  async execute(message) {},

  // ------------------------------------------------------------------------------
};
