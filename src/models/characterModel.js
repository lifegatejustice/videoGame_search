const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  firstAppearance: {
    type: String,
    trim: true,
  },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  }],
  abilities: [{
    type: String,
    trim: true,
  }],
  portraitUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

characterSchema.index({ name: 'text', bio: 'text' });

module.exports = mongoose.model('Character', characterSchema);
