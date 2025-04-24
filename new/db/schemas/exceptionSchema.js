const mongoose = require('mongoose');
const schemaName = 'exception-logs';

const reqString = {
    type: String,
    required: true,
};

const reqDate = {
    type: Date,
    required: true,
};

const reqObject = {
    type: Object,
    required: true,
};

const optString = {
    type: String,
    required: false,
};

const schema = mongoose.Schema({
    time: reqDate,
    identifier: reqString,
    exception: reqObject,
    message: optString,

    persist: {
        type: Boolean,
        required: true,
        default: false,
    },
    note: optString,

    interaction: optString,
    guild: optString,
    channel: optString,
    user: optString,
});

module.exports = {
    initIndex,
    schema: mongoose.model(schemaName, schema, schemaName),
};

function initIndex() {
    module.exports.schema.collection.dropIndexes().then(() => {
        module.exports.schema.collection.createIndex(
            { time: 1 },
            {
                // expire after 7 days
                expireAfterSeconds: 60 * 60 * 24 * 7,
                partialFilterExpression: {
                    persist: false,
                },
            });
    });
}