const mongoose = require('mongoose');
const schemaName = 'setup';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    logChannel: reqString,
    
});

module.exports = mongoose.model(schemaName, schema, schemaName);