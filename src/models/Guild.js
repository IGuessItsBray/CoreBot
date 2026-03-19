const mongoose = require("mongoose");

/**
 * GuildSchema defines the persistent settings for a Discord Server.
 */
const GuildSchema = new mongoose.Schema({
  // The unique ID of the Discord Guild (Snowflake)
  guildId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },

  // Metadata for the guild
  guildName: {
    type: String,
    default: "Unknown Guild"
  },

  // --- Access Control ---
  access: {
    password: { type: String },
    roleId: { type: String },
    enabled: { type: Boolean, default: false },
    lastUpdated: { type: Date }
  },

  // --- Join/Welcome Settings ---
  welcome: {
    enabled: { type: Boolean, default: false },
    channelId: { type: String, default: null },
    message: { type: String, default: "Welcome ${user} to ${guild}!" }
  },

  // --- Leave Settings ---
  leave: {
    enabled: { type: Boolean, default: false },
    channelId: { type: String, default: null },
    message: { type: String, default: "${user} has left ${guild}." }
  },
  
  // ID of the channel where the bot sends logs
  logChannelId: { 
    type: String, 
    default: null 
  },

  modLogChannelId: { type: String, default: null },

  // Custom prefix for non-slash commands
  prefix: { 
    type: String, 
    default: "!" 
  },

  // Example of a boolean flag for features
  isPremium: { 
    type: Boolean, 
    default: false 
  }
}, { 
  // Automatically adds createdAt and updatedAt fields
  timestamps: true 
});

module.exports = mongoose.model("Guild", GuildSchema);