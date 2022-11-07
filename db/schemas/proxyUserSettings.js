const mongoose = require('mongoose');
const schemaName = 'proxyUserSettings';

const reqString = {
	type: String,
	required: true,
};
const reqBool = {
    type: Boolean,
    required: true,
};

const schema = mongoose.Schema({
	userID: reqString,
	ap: reqBool,
	lastUsed: reqString
});

module.exports = mongoose.model(schemaName, schema, schemaName);