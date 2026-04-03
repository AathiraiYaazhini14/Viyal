const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  category: { type: String, enum: ['vegetation', 'animal_movement', 'water', 'climate', 'soil'], required: true },
  metric: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  trend: { type: String, enum: ['increasing', 'decreasing', 'stable'], default: 'stable' },
  recommendation: { type: String },
  month: { type: String },
  forest: { type: String, required: true },
  officeName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Insight', insightSchema);
