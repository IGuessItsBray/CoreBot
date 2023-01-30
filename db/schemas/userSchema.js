const mongoose = require('mongoose');
const schemaName = 'user';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    userId: reqString,
    name: reqString,
    channelId: reqString,
    reason: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);