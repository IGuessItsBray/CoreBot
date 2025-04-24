// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------

const exceptionSchema = require('./schemas/exceptionSchema').schema;

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
    addException,
    getException,
    togglePersist,
    updateNote,
};

// ------------------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------------------

async function addException(exception, interaction, guild, channel, user) {
    const time = new Date();
    const identifier = Math.random().toString(36).substring(2, 12).toUpperCase();
    const message = exception.message;

    // Trim the interaction string because trailing spaces are annoying
    interaction = interaction.trim();
    // Remove any circular references from the exception, Mongoose HATES them
    exception = JSON.parse(JSON.stringify(exception, Object.getOwnPropertyNames(exception)));

    return await mongo().then(async () => {
        try {
            return await exceptionSchema.create({
                time,
                identifier,
                exception,
                message,
                interaction,
                guild,
                channel,
                user,
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}

async function getException(identifier) {
    if (identifier) {
        return await mongo().then(async () => {
            try {
                return await exceptionSchema.findOne({ identifier });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    else {
        return await mongo().then(async () => {
            try {
                return await exceptionSchema.find();
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}

async function togglePersist(identifier) {
    return await mongo().then(async () => {
        try {
            const exception = await exceptionSchema.findOne({ identifier });
            exception.persist = !exception.persist;
            return await exceptionSchema.findOneAndUpdate({ identifier }, exception, { new: true, upsert: true });
        }
        catch (err) {
            console.error(err);
        }
    });
}

async function updateNote(identifier, note) {
    if (note.trim() === '') note = undefined;
    return await mongo().then(async () => {
        try {
            if (!note) return await exceptionSchema.findOneAndUpdate({ identifier }, { $unset: { note: 1 } }, { new: true, upsert: true });
            else return await exceptionSchema.findOneAndUpdate({ identifier }, { note }, { new: true, upsert: true });
        }
        catch (err) {
            console.error(err);
        }
    });
}