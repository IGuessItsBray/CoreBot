const mongoose = require("mongoose");
const schemaName = "proxyGroupSchema";

const reqString = {
  type: String,
  required: true,
};
const reqNumber = {
  type: Number,
  required: true,
};
const reqObj = {
  type: Object,
  required: true,
};
const reqArray = {
  type: Array,
  required: true,
};

const schema = mongoose.Schema({
  _id: reqString,
  owner: reqString,
  name: reqString,
  desc: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);
