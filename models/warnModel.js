const mongoose = require("mongoose");

module.exports = mongoose.model(
    "warnings",
    new mongoose.Schema({
        userId: String,
        GuildId: String,
        ModeratorId: String,
        Reason: String,
        Timestamp: Number,
    })
);