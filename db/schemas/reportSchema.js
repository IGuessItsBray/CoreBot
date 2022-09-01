const mongoose = require('mongoose');
const schemaName = 'report';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
	channelId: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);