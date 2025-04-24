const mongoose = require('mongoose');
const schemaName = 'sample';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
	string: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);