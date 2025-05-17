const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const messageSchema = new mongoose.Schema({
  id: { type: String, default: () => generateId() },
  timestamp: { type: Date, default: Date.now },
  guild: String,
  channel: String,
  content: String,
});

const guildLogSchema = new mongoose.Schema({
  guildId: String,
  messages: [messageSchema],
});

const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => generateId(),
    unique: true,
    index: true, // <-- add this line
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