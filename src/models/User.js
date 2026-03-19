const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String },
  warnings: [
    {
      reason: String,
      moderatorId: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  messageCount: { type: Number, default: 0 },
  characterCount: { type: Number, default: 0 },
  lastSeen: { type: Date, default: Date.now },
  isBanned: { type: Boolean, default: false },
  kicks: [
    {
      reason: String,
      moderatorId: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  bans: [
    {
      reason: String,
      moderatorId: String,
      timestamp: { type: Date, default: Date.now },
      type: { type: String, enum: ['BAN', 'UNBAN'] }
    }
  ],
});

// Create a unique index so we don't get duplicate profiles for the same user in the same guild
UserSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);