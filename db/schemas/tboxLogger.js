const mongoose = require('mongoose');
const schemaName = 'tboxLogger';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
	guild: reqString,
    content: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);