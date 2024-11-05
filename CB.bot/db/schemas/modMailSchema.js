const mongoose = require("mongoose");
const schemaName = "modMailSchema";

const reqString = {
  type: String,
  required: true,
};

const schema = mongoose.Schema({
  _id: reqString,
  guildId: reqString,
  catagory: reqString,
  channel: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
