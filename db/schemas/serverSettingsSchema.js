const mongoose = require('mongoose');
const schemaName = 'serverSettings';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    name: reqString,

    logChannel: reqString,

    failMessage: String,
    successMessage: String,

    verifyChannelId: String,
    password: String,

    addRole: String,

    modMailChannel: reqString,

    joinChannel: reqString,
    joinMessage: reqString,

    leaveChannel: reqString,
    leaveMessage: reqString,

    ccChannelId: reqString,
	webhookId: reqString,
	webhookToken: reqString,

	reportChannelId: reqString,
    
});

module.exports = mongoose.model(schemaName, schema, schemaName);