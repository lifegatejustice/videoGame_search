const Platform = require('../models/platformModel');
const Game = require('../models/gameModel');

// Get all platforms without pagination and filtering
const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find()
      .select('-__v')
      .sort({ name: 1 });

    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ message: 'Error fetching platforms' });
  }
};

// Get platform by ID
const getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id)
      .select('-__v');

    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    res.json(platform);
  } catch (error) {
    console.error('Error fetching platform:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid platform ID format' });
    }
    res.status(500).json({ message: 'Error fetching platform' });
  }
};

// Create platform (admin only)
const createPlatform = async (req, res) => {
  try {
    const platform = new Platform(req.body);
    await platform.save();

    res.status(201).json(platform);
  } catch (error) {
    console.error('Error creating platform:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Platform with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating platform' });
  }
};

// Update platform (admin only)
const updatePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    res.json(platform);
  } catch (error) {
    console.error('Error updating platform:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid platform ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Platform with this name already exists' });
    }
    res.status(500).json({ message: 'Error updating platform' });
  }
};

// Delete platform (admin only)
const deletePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);

    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }

    res.json({ message: 'Platform deleted successfully' });
  } catch (error) {
    console.error('Error deleting platform:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid platform ID format' });
    }
    res.status(500).json({ message: 'Error deleting platform' });
  }
};

// Get games by platform
const getGamesByPlatform = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const games = await Game.find({ platforms: req.params.id })
      .populate('characters', 'name')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Game.countDocuments({ platforms: req.params.id });

    res.json({
      games,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching games for platform:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid platform ID format' });
    }
    res.status(500).json({ message: 'Error fetching games for platform' });
  }
};

module.exports = {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getGamesByPlatform,
};
