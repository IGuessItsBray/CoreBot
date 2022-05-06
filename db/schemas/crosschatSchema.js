const mongoose = require('mongoose');
const schemaName = 'crosschat';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
	string: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);