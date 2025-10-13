const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  oauthProvider: {
    type: String,
    enum: ['google', 'github'],
    required: true,
  },
  providerId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatarUrl: {
    type: String,
    trim: true,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  }],
}, {
  timestamps: true,
});

userSchema.index({ oauthProvider: 1, providerId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
