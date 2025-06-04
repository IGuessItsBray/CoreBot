// shared/db/schemas/incident.js
const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['outage', 'degraded', 'maintenance', 'notice'],
    default: 'outage',
  },
  updates: {
    type: [updateSchema],
    default: [],
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  source: {
    type: String,
    default: 'unknown',
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Incident', incidentSchema);