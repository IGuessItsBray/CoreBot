const mongoose = require("mongoose");

/**
 * GuildSchema defines the persistent settings for a Discord Server.
 */
const GuildSchema = new mongoose.Schema({
    modLogChannelId: { type: String, default: null },
  // The unique ID of the Discord Guild (Snowflake)
  guildId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },

  access: {
  password: { type: String },
  roleId: { type: String },
  enabled: { type: Boolean, default: false },
  lastUpdated: { type: Date }
},
  
  // Custom prefix for non-slash commands (if you use them)
  prefix: { 
    type: String, 
    default: "!" 
  },

  // ID of the channel where the bot sends logs
  logChannelId: { 
    type: String, 
    default: null 
  },

  // Example of a boolean flag for features
  isPremium: { 
    type: Boolean, 
    default: false 
  },

  // Metadata for the guild
  guildName: {
    type: String,
    default: "Unknown Guild"
  }
}, { 
  // Automatically adds createdAt and updatedAt fields
  timestamps: true 
});

module.exports = mongoose.model("Guild", GuildSchema);