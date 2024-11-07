const mongoose = require('mongoose');
const schemaName = 'error';

const reqString = {
  type: String,
  required: true,
};

const reqDate = {
  type: Date,
  required: true,
};

const reqObject = {
  type: Object,
  required: true,
};

const optString = {
  type: String,
  required: false,
};

const schema = mongoose.Schema({
  time: reqDate,
  identifier: reqString,
  exception: reqObject,

  interaction: optString,
  type: reqString,
  guild: reqString,
  channel: optString,
  user: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);

// add a TTL index to the schema, so that documents will be deleted after 1 month