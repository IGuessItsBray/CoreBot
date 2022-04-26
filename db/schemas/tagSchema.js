const mongoose = require('mongoose');
const schemaName = 'tag';

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
    // should always track which guild it belongs to
    guild: reqNum,
    // embed information, I personally like to reserve
    // author/footer stuff for information about the embed from the bot
    embed: reqObj,
});

module.exports = mongoose.model(schemaName, schema, schemaName);