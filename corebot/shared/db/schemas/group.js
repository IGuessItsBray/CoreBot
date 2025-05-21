const mongoose = require('mongoose');
const { customAlphabet, nanoid } = require('nanoid');

const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

const groupSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => nanoid(),
    immutable: true, // Cannot be changed once created
    unique: true,
    index: true,
  },
  id: {
    type: String,
    default: () => generateId(),
    unique: true,
    index: true,
  },
  systemId: { type: String, required: true },
  name: String,
  avatar: String,
  banner: String,
  description: String,
  members: [String], // array of proxy/member IDs
});

module.exports = mongoose.model('Group', groupSchema);