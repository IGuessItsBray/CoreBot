const mongoose = require('mongoose');
const schemaName = 'warnings';

const reqString = {
	type: String,
	required: true,
};

const reqDate = {
	type: Date,
	required: true,
};

const schema = mongoose.Schema({
	_id: reqString,

	guildId: reqString,
	userId: reqString,
	modId: reqString,

	reason: reqString,
	timestamp: reqDate,
});

module.exports = mongoose.model(schemaName, schema, schemaName);