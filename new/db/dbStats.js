// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------

const statSchema = require('./schemas/statSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
    getAllStats,
    getStat,
    updateStat,
};

// ------------------------------------------------------------------------------

// get all stats
async function getAllStats() {
    return await mongo().then(async () => {
        try {
            return await statSchema.find();
        }
        catch (e) {
            console.error(e);
        }
    });
}


// get stat
async function getStat(name) {
    return await mongo().then(async () => {
        try {
            return (await statSchema.findOne({ name }))?.value ?? 0;
        }
        catch (e) {
            console.error(e);
        }
    });
}

// update stat
async function updateStat(name, value) {
    return await mongo().then(async () => {
        try {
            return await statSchema.findOneAndUpdate(
                { name },
                { value },
                { new: true, upsert: true });
        }
        catch (e) {
            console.error(e);
        }
    });
}