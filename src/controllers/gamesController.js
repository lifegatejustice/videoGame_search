const Game = require('../models/gameModel');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all games with filters and pagination
const getGames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.genre) {
      filter.genres = { $in: req.query.genre.split(',') };
    }
    if (req.query.platform) {
      filter.platforms = req.query.platform;
    }
    if (req.query.developer) {
      filter.developer = new RegExp(req.query.developer, 'i');
    }

    const games = await Game.find(filter)
      .populate('platforms', 'name')
      .populate('characters', 'name')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Game.countDocuments(filter);

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
    res.status(500).json({ message: 'Error fetching games' });
  }
};

// Search games
const searchGames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term required' });
    }

    const games = await Game.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .populate('platforms', 'name')
      .populate('characters', 'name')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ score: { $meta: 'textScore' } });

    const total = await Game.countDocuments({ $text: { $search: searchTerm } });

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
    res.status(500).json({ message: 'Error searching games' });
  }
};

// Get game by ID
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('platforms', 'name manufacturer')
      .populate('characters', 'name portraitUrl')
      .populate('createdBy', 'username')
      .select('-__v');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game' });
  }
};

// Create game (admin only)
const createGame = async (req, res) => {
  try {
    const gameData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const game = new Game(gameData);
    await game.save();

    await game.populate('platforms', 'name');
    await game.populate('characters', 'name');

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error creating game' });
  }
};

// Update game (admin only)
const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('platforms', 'name')
      .populate('characters', 'name')
      .select('-__v');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error updating game' });
  }
};

// Delete game (admin only)
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game' });
  }
};

// Upload cover image (admin only)
const uploadCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'game-covers',
      public_id: `game-${req.params.id}`,
      overwrite: true,
    });

    // Update game with cover URL
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { coverImage: result.secure_url },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ coverImage: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading cover image' });
  }
};

module.exports = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  searchGames,
  uploadCover,
};
