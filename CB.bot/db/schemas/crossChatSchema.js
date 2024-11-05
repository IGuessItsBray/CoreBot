const mongoose = require("mongoose");
const schemaName = "crosschat";

const reqString = {
  type: String,
  required: true,
};

const schema = mongoose.Schema({
  guildId: reqString,
  channelId: reqString,
  webhookId: reqString,
  webhookToken: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
