const mongoose = require('mongoose');
const schemaName = 'modmailMsgLoggerSchema';

const reqString = {
    type: String,
    required: true,
};
const reqBool = {
    type: Boolean,
    required: true,
};
const reqDate = {
    type: Date,
    required: true,
};
const reqNum = {
    type: Number,
    required: true,
};
const reqArray = {
    type: Array,
    required: true,
};

const schema = mongoose.Schema({
    guild: reqString,
    UserId: reqString,
    UserName: reqString,
    message: reqString,
    type: reqString,
    timestamp: reqString,
    id: reqString
});

module.exports = mongoose.model(schemaName, schema, schemaName);