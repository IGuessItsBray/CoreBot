const mongoose = require('mongoose');
const schemaName = 'proxy';

const reqString = {
    type: String,
    required: true,
};
const reqBool = {
    type: Boolean,
    required: true,
};
const reqNum = {
    type: Number,
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

const schema = mongoose.Schema({
    _id: reqString,
    userID: reqString,
    name: reqString,
    pronouns: reqString,
    avatar: reqString,
    proxy: reqString,
    color: reqString,
});

module.exports = mongoose.model(schemaName, schema, schemaName);