const mongoose = require('mongoose');

const StatusReportSchema = new mongoose.Schema({
  source: { type: String, required: true, unique: true }, // e.g., 'gateway', 'bot', 'dashboard'
  timestamp: { type: Date, default: Date.now },
  latency: { type: Number, required: true }, // in ms
  shardStatus: { type: Map, of: String }, // optional
  additional: { type: mongoose.Schema.Types.Mixed }, // optional metadata
});

module.exports = mongoose.model('StatusReport', StatusReportSchema);