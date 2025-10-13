const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  releaseDate: {
    type: Date,
  },
  genres: [{
    type: String,
    trim: true,
  }],
  developer: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  platforms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Platform',
  }],
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character',
  }],
  ratingAverage: {
    type: Number,
    min: 0,
    max: 10,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

gameSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Game', gameSchema);
