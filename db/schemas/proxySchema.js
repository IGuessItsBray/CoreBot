const mongoose = require("mongoose");
const schemaName = "proxySchema";

const reqString = {
  type: String,
  required: true,
};
const reqNumber = {
  type: Number,
  required: true,
};

const schema = mongoose.Schema({
  _id: reqString,
  owner: reqString,
  name: reqString,
  desc: reqString,
  pronouns: reqString,
  avatar: reqString,
  tags: reqString,
  color: reqString,

  messages: reqNumber,
  characters: reqNumber,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
