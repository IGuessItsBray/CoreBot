const mongoose = require('mongoose');
const schemaName = 'messages';

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
    channel: reqString,
    user: reqString,
    content: reqString,
    userMentions: reqArray,
    roleMentions: reqArray,
    timestamp: reqString,
    edited: reqBool,
    editedTimestamp: reqString,
    deleted: reqBool,
    attachments: reqArray,
    messageLink: reqString,
    messageId: reqString,

});

module.exports = mongoose.model(schemaName, schema, schemaName);