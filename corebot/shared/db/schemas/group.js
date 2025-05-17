const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const generateId = () => customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)();

const groupSchema = new mongoose.Schema({
  id: { type: String, default: () => generateId(), unique: true },
  systemId: String,
  name: String,
  avatar: String,
  banner: String,
  description: String,
  members: [String], // array of member IDs
});

module.exports = mongoose.model('Group', groupSchema);