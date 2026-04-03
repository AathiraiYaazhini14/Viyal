const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['human_intrusion', 'vehicle', 'chainsaw', 'gunshot', 'fire', 'landslide'],
    required: true,
  },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  location: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Resolved', 'Investigating'], default: 'Active' },
  forest: { type: String, required: true },
  officeName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
