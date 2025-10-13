const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  manufacturer: {
    type: String,
    trim: true,
  },
  releaseYear: {
    type: Number,
    min: 1970,
    max: new Date().getFullYear() + 5,
  },
  type: {
    type: String,
    enum: ['console', 'handheld', 'pc', 'mobile', 'other'],
    default: 'console',
  },
  logoUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Platform', platformSchema);
