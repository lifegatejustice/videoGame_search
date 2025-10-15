const Character = require('../models/characterModel');

// Get all characters with pagination
const getCharacters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const characters = await Character.find()
      .populate('games', 'title')
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Character.countDocuments();

    res.json({
      characters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }
    res.status(500).json({ message: 'Error fetching characters' });
  }
};

// Get character by ID
const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('games', 'title coverImage releaseDate')
      .select('-__v');

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid character ID format' });
    }
    res.status(500).json({ message: 'Error fetching character' });
  }
};

// Create character (admin only)
const createCharacter = async (req, res) => {
  try {
    const character = new Character(req.body);
    await character.save();

    await character.populate('games', 'title');

    res.status(201).json(character);
  } catch (error) {
    console.error('Error creating character:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Character with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating character' });
  }
};

// Update character (admin only)
const updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('games', 'title')
      .select('-__v');

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Error updating character:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid character ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Character with this name already exists' });
    }
    res.status(500).json({ message: 'Error updating character' });
  }
};

// Delete character (admin only)
const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Error deleting character:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid character ID format' });
    }
    res.status(500).json({ message: 'Error deleting character' });
  }
};

module.exports = {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
