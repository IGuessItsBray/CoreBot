const mongoose = require("mongoose");
const schemaName = "global-logs";

const schema = mongoose.Schema({
  time: Date,
  message: Object,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
