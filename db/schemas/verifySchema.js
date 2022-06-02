const mongoose = require('mongoose');
const schemaName = 'verify';

const reqString = {
	type: String,
	required: true,
};

const schema = mongoose.Schema({

    guildId: reqString,

    failMessage: String,
    successMessage: String,

    channelId: String,
    password: String,

    addRole: String
});

module.exports = mongoose.model(schemaName, schema, schemaName);