const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  district: { type: String, required: true },
  forest: { type: String, required: true },
  officeName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'officer' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
