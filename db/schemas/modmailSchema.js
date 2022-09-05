const mongoose = require('mongoose');
const schemaName = 'modmail';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    modMailChannel: reqString,

});

module.exports = mongoose.model(schemaName, schema, schemaName);