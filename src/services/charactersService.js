const Character = require('../models/characterModel');

// Get characters with pagination
const getCharacters = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const characters = await Character.find()
    .populate('games', 'title')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Character.countDocuments();

  return {
    characters,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get character with full details
const getCharacterWithDetails = async (characterId) => {
  return await Character.findById(characterId)
    .populate('games', 'title coverImage releaseDate genres');
};

// Create new character
const createCharacter = async (characterData) => {
  const character = new Character(characterData);
  await character.save();
  return await character.populate('games', 'title');
};

// Update character
const updateCharacter = async (characterId, updates) => {
  return await Character.findByIdAndUpdate(
    characterId,
    updates,
    { new: true, runValidators: true }
  ).populate('games', 'title');
};

// Delete character
const deleteCharacter = async (characterId) => {
  return await Character.findByIdAndDelete(characterId);
};

// Check if character exists
const characterExists = async (characterId) => {
  const character = await Character.findById(characterId);
  return !!character;
};

module.exports = {
  getCharacters,
  getCharacterWithDetails,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  characterExists,
};
