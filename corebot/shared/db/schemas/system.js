const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const generateId = () => customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)();

const systemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => generateId(),
    unique: true,
  },
  ownerId: { type: String, required: true }, // Discord user ID
  name: String,
  description: String,
  avatar: String,
  banner: String,
  autoproxy: {
  mode: { type: String, enum: ['off', 'latch', 'member'], default: 'off' },
  memberId: { type: String, default: null }
},
lastUsedProxyId: {
  type: String,
  default: null,
}
});

module.exports = mongoose.model('System', systemSchema);