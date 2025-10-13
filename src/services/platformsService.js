const Platform = require('../models/platformModel');
const Game = require('../models/gameModel');

// Get platforms with pagination
const getPlatforms = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const platforms = await Platform.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Platform.countDocuments();

  return {
    platforms,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get platform by ID
const getPlatformById = async (platformId) => {
  return await Platform.findById(platformId);
};

// Create new platform
const createPlatform = async (platformData) => {
  const platform = new Platform(platformData);
  await platform.save();
  return platform;
};

// Update platform
const updatePlatform = async (platformId, updates) => {
  return await Platform.findByIdAndUpdate(
    platformId,
    updates,
    { new: true, runValidators: true }
  );
};

// Delete platform
const deletePlatform = async (platformId) => {
  return await Platform.findByIdAndDelete(platformId);
};

// Get games by platform
const getGamesByPlatform = async (platformId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const games = await Game.find({ platforms: platformId })
    .populate('characters', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Game.countDocuments({ platforms: platformId });

  return {
    games,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Check if platform exists
const platformExists = async (platformId) => {
  const platform = await Platform.findById(platformId);
  return !!platform;
};

module.exports = {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getGamesByPlatform,
  platformExists,
};
