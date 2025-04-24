const mongoose = require('mongoose');
const schemaName = 'global-stats';

const reqString = {
    type: String,
    required: true,
};

const reqObject = {
    type: Object,
    required: true,
};

const schema = mongoose.Schema({
    name: reqString,
    value: reqObject,
});

module.exports = mongoose.model(schemaName, schema, schemaName);