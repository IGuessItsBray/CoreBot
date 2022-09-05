const mongoose = require('mongoose');
const schemaName = 'mediaChannel';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    guild: reqString,
	channel: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);