const mongoose = require('mongoose');
const schemaName = 'users';

const schema = mongoose.Schema({
	id: String,
	name: String,
	discriminator: String,
});

module.exports = mongoose.model(schemaName, schema, schemaName);