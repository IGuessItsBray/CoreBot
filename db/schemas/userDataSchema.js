const mongoose = require('mongoose');
const schemaName = 'userData';

const reqString = {
    type: String,
    required: true,
};

const schema = mongoose.Schema({
    _id: reqString,
    user: reqString,
    autoproxy_state: reqString,
    autoproxy_member_id: reqString
});

module.exports = mongoose.model(schemaName, schema, schemaName);