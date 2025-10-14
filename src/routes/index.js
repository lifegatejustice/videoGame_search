const express = require('express');
const router = express.Router();

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'CSE341 Group Project API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/auth',
      users: '/api/users',
      games: '/api/games',
      characters: '/api/characters',
      platforms: '/api/platforms',
      docs: '/api-docs'
    }
  });
});

// Health check endpoint
router.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Stats endpoint
router.get('/api/stats', async (req, res) => {
  try {
    const User = require('../models/userModel');
    const Game = require('../models/gameModel');
    const Character = require('../models/characterModel');
    const Platform = require('../models/platformModel');

    const [userCount, gameCount, characterCount, platformCount] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Character.countDocuments(),
      Platform.countDocuments(),
    ]);

    res.json({
      users: userCount,
      games: gameCount,
      characters: characterCount,
      platforms: platformCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Import and use route modules
router.use('/auth', require('./auth.routes'));
router.use('/api/users', require('./users.routes'));
router.use('/api/games', require('./games.routes'));
router.use('/api/characters', require('./characters.routes'));
router.use('/api/platforms', require('./platforms.routes'));

module.exports = router;
