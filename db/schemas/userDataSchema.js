const mongoose = require('mongoose');
const schemaName = 'userData';

const reqString = {
    type: String,
    required: true,
};
const reqBool = {
    type: Boolean,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    user: reqString,
    autoproxy_state: reqBool,
    autoproxy_member_id: reqString
});

module.exports = mongoose.model(schemaName, schema, schemaName);