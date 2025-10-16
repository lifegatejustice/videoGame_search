const Game = require('../models/gameModel');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all games
const getGames = async (req, res) => {
 try{
  const games = await Game.find();
  res.status(200).json({
    success: true,
    count: games.length,
    data: games
  });
 } catch (error) {
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: error.message
  });

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

    // Use regex search instead of text index for broader compatibility
    const regex = new RegExp(searchTerm, 'i');
    const games = await Game.find({
      $or: [
        { title: regex },
        { description: regex },
        { developer: regex },
        { publisher: regex },
      ]
    })
      .populate('platforms', 'name')
      .populate('characters', 'name')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Game.countDocuments({
      $or: [
        { title: regex },
        { description: regex },
        { developer: regex },
        { publisher: regex },
      ]
    });

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
  const game = await Game.create(req.body);
  res.status(201).json({
    success: true,
    data: game
  });
} catch (error) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Game with this title already exists'
    });
  }
  res.status(500).json({
    success: false,
    error: 'Error creating game'
  });
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
