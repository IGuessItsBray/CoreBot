const mongoose = require("mongoose");
const schemaName = "proxyMessages";

const reqString = {
  type: String,
  required: true,
};
const reqBool = {
  type: Boolean,
  required: true,
};
const reqDate = {
  type: Date,
  required: true,
};
const reqNum = {
  type: Number,
  required: true,
};
const reqArray = {
  type: Array,
  required: true,
};

const schema = mongoose.Schema({
  guild: reqString,
  channel: reqString,
  user: reqString,
  content: reqString,
  timestamp: reqString,
  attachments: reqArray,
  messageId: reqString,
  messageLink: reqString,
  proxy: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
