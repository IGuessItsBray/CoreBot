const mongoose = require("mongoose");
const schemaName = "userMmSchema";

const reqString = {
  type: String,
  required: true,
};

const schema = mongoose.Schema({
  _id: reqString,
  guildId: reqString,
  userId: reqString,
  channelId: reqString,
  reason: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
