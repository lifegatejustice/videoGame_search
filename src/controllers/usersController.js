const User = require('../models/userModel');
const Game = require('../models/gameModel');

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('favorites', 'title coverImage')
      .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user (owner or admin)
const updateUser = async (req, res) => {
  try {
    const allowedFields = ['username', 'email', 'avatarUrl'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (owner or admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Add game to favorites
const addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const game = await Game.findById(req.body.gameId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (user.favorites.includes(req.body.gameId)) {
      return res.status(400).json({ message: 'Game already in favorites' });
    }

    user.favorites.push(req.body.gameId);
    await user.save();

    res.json({ message: 'Game added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

// Remove game from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.gameId);
    await user.save();

    res.json({ message: 'Game removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
};
