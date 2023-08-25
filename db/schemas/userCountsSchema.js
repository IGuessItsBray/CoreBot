const mongoose = require("mongoose");
const schemaName = "userCounts";

const reqString = {
  type: String,
  required: true,
};
const reqNumber = {
  type: Number,
  required: true,
};

const schema = mongoose.Schema({
  user: reqString,
  guild: reqString,
  messages: reqNumber,
  characters: reqNumber,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
