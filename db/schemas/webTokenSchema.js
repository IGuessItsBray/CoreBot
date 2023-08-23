const mongoose = require('mongoose');
const schemaName = 'web-token';

const reqString = {
	type: String,
	required: true,
};

const reqDate = {
	type: Date,
	required: true,
};

const schema = mongoose.Schema({
	token: reqString,
	access: reqString,
	refresh: reqString,
	expires: reqDate,
	scope: reqString,
	type: reqString,
	user: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);