const mongoose = require('mongoose');
const schemaName = 'join';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    channel: reqString,
    message: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);