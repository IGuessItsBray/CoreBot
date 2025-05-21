const mongoose = require('mongoose');
const { customAlphabet, nanoid } = require('nanoid');

const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

// Message schema
const messageSchema = new mongoose.Schema({
  id: { type: String, default: () => generateId() },
  timestamp: { type: Date, default: Date.now },
  guild: { type: String, required: true },
  channel: { type: String, required: true },
  content: { type: String, required: true },
  messageId: { type: String, required: true },
  messageLink: { type: String, required: true },
}, { _id: false });

// Guild log schema
const guildLogSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  messages: [messageSchema],
}, { _id: false });

// Main member (proxy) schema
const memberSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => nanoid(),
    immutable: true,
    unique: true,
    index: true,
  },
  id: {
    type: String,
    default: () => generateId(),
    unique: true,
    index: true,
  },
  name: { type: String },
  display_name: { type: String },
  avatar: { type: String },
  banner: { type: String },
  pronouns: { type: String },
  birthday: { type: String },
  description: { type: String },
  systemId: { type: String, required: true },
  messageCount: { type: Number, default: 0 },
  characterCount: { type: Number, default: 0 },
  proxyTags: {
    prefix: { type: [String], default: [] },
    suffix: { type: [String], default: [] },
  },
  guildLogs: [guildLogSchema],
});

module.exports = mongoose.model('Member', memberSchema);