const mongoose = require('mongoose');
const schemaName = 'proxySchema';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    owner: reqString,
    name: reqString,
    tags: reqString,
    desc: reqString,
    pronouns: reqString,
    avatar: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);