const mongoose = require('mongoose');
const schemaName = 'user';

const reqString = {
    type: String,
    required: true,
};
const reqObj = {
    type: Object,
    required: true,
};
const reqArray = {
    type: Array,
    required: true,
};
const reqNumber = {
    type: Number,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    userId: reqString,
    name: reqString,
    msgCount: reqNumber,
    characters: reqNumber,
    punishments: reqArray,
    messages: reqArray,
    mmLogs: reqArray,
});

module.exports = mongoose.model(schemaName, schema, schemaName);