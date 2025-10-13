const User = require('../models/userModel');

// Get user with populated favorites
const getUserWithFavorites = async (userId) => {
  return await User.findById(userId)
    .populate('favorites', 'title coverImage ratingAverage')
    .select('-__v');
};

// Check if user exists
const userExists = async (userId) => {
  const user = await User.findById(userId);
  return !!user;
};

// Update user profile
const updateUserProfile = async (userId, updates) => {
  const allowedFields = ['username', 'email', 'avatarUrl'];
  const filteredUpdates = {};

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  return await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  );
};

// Add game to user favorites
const addGameToFavorites = async (userId, gameId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.favorites.includes(gameId)) {
    throw new Error('Game already in favorites');
  }

  user.favorites.push(gameId);
  await user.save();
  return user;
};

// Remove game from user favorites
const removeGameFromFavorites = async (userId, gameId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.favorites = user.favorites.filter(id => id.toString() !== gameId);
  await user.save();
  return user;
};

module.exports = {
  getUserWithFavorites,
  userExists,
  updateUserProfile,
  addGameToFavorites,
  removeGameFromFavorites,
};
