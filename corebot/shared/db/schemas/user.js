// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  systemId: { type: String, required: true }, // FK to System
  preferences: {
    autoproxy: { type: Boolean, default: false },
    lastUsedMemberId: { type: String, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);