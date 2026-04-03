const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String },
  category: { type: String, enum: ['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Insect'], required: true },
  isEndangered: { type: Boolean, default: false },
  conservationStatus: { type: String, enum: ['CR', 'EN', 'VU', 'NT', 'LC'], default: 'LC' },
  imageUrl: { type: String, default: '' },
  location: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  detectedAt: { type: Date, default: Date.now },
  alertSent: { type: Boolean, default: false },
  forest: { type: String, required: true },
  officeName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Species', speciesSchema);
