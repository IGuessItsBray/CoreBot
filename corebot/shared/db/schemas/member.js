const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const messageSchema = new mongoose.Schema({
  id: { type: String, default: () => generateId() },
  timestamp: { type: Date, default: Date.now },
  guild: { type: String, required: true },
  channel: { type: String, required: true },
  content: { type: String, required: true },
  messageId: { type: String, required: true },       // Discord message ID
  messageLink: { type: String, required: true },     // Full URL to the message
}, { _id: false });

const guildLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  messages: [messageSchema],
}, { _id: false });

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => generateId(),
    unique: true,
    index: true,
  },
  name: String,
  display_name: String,
  avatar: String,
  banner: String,
  pronouns: String,
  birthday: String,
  description: String,
  systemId: { type: String, required: true },
  messageCount: { type: Number, default: 0 },
  characterCount: { type: Number, default: 0 },
  proxyTags: { type: [String], default: [] },
  guildLogs: [guildLogSchema],
});

module.exports = mongoose.model('Member', memberSchema);