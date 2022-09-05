const mongoose = require('mongoose');
const schemaName = 'modmailID';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    guildId: reqString,
    
});

module.exports = mongoose.model(schemaName, schema, schemaName);