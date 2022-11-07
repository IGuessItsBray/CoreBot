const mongoose = require('mongoose');
const schemaName = 'proxyCounts';

const reqString = {
    type: String,
    required: true,
};
const reqNumber = {
    type: Number,
    required: true,
};

const schema = mongoose.Schema({
    proxy: reqString,
    messages: reqNumber,
    characters: reqNumber,
});

module.exports = mongoose.model(schemaName, schema, schemaName);