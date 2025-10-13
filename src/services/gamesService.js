const Game = require('../models/gameModel');

// Get games with filters
const getGamesWithFilters = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const query = {};
  if (filters.genre) {
    query.genres = { $in: filters.genre.split(',') };
  }
  if (filters.platform) {
    query.platforms = filters.platform;
  }
  if (filters.developer) {
    query.developer = new RegExp(filters.developer, 'i');
  }

  const games = await Game.find(query)
    .populate('platforms', 'name')
    .populate('characters', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Game.countDocuments(query);

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

// Search games using text search
const searchGames = async (searchTerm, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const games = await Game.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } }
  )
    .populate('platforms', 'name')
    .populate('characters', 'name')
    .skip(skip)
    .limit(limit)
    .sort({ score: { $meta: 'textScore' } });

  const total = await Game.countDocuments({ $text: { $search: searchTerm } });

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

// Get game with full details
const getGameWithDetails = async (gameId) => {
  return await Game.findById(gameId)
    .populate('platforms', 'name manufacturer releaseYear')
    .populate('characters', 'name portraitUrl bio')
    .populate('createdBy', 'username');
};

// Create new game
const createGame = async (gameData) => {
  const game = new Game(gameData);
  await game.save();
  return await game.populate('platforms', 'name').populate('characters', 'name');
};

// Update game
const updateGame = async (gameId, updates) => {
  return await Game.findByIdAndUpdate(
    gameId,
    updates,
    { new: true, runValidators: true }
  )
    .populate('platforms', 'name')
    .populate('characters', 'name');
};

// Delete game
const deleteGame = async (gameId) => {
  return await Game.findByIdAndDelete(gameId);
};

// Check if game exists
const gameExists = async (gameId) => {
  const game = await Game.findById(gameId);
  return !!game;
};

module.exports = {
  getGamesWithFilters,
  searchGames,
  getGameWithDetails,
  createGame,
  updateGame,
  deleteGame,
  gameExists,
};
