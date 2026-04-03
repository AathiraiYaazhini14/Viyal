const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  event: String,
  time: { type: Date, default: Date.now },
  details: String,
});

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Restricted', 'Safe', 'Buffer'], required: true },
  riskLevel: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  area: { type: String },
  coordinates: { lat: Number, lng: Number },
  activityLogs: [activityLogSchema],
  forest: { type: String, required: true },
  officeName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
