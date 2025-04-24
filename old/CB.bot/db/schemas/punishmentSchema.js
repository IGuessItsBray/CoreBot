const mongoose = require("mongoose");
const schemaName = "punishment";

const reqString = {
  type: String,
  required: true,
};

const schema = mongoose.Schema({
  guild: reqString,
  user: reqString,
  type: reqString,
  message: reqString,
  timestamp: reqString,
  staffUser: reqString, //user for the staff that did the interaction (kick/ban/warn etc)
});

module.exports = mongoose.model(schemaName, schema, schemaName);
