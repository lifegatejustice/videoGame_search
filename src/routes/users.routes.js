const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
} = require('../controllers/usersController');
const {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin,
} = require('../middleware/authMiddleware');
const {
  validateUserId,
  validateGameId,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, getUsers);

// Get user by ID
router.get('/:userId', authenticateToken, validateUserId, getUserById);

// Update user (owner or admin)
router.put('/:userId', authenticateToken, requireOwnerOrAdmin, validateUserId, updateUser);

// Delete user (owner or admin)
router.delete('/:userId', authenticateToken, requireOwnerOrAdmin, validateUserId, deleteUser);

// Add game to favorites
router.post('/:userId/favorites', authenticateToken, requireOwnerOrAdmin, validateUserId, validateGameId, addToFavorites);

// Remove game from favorites
router.delete('/:userId/favorites/:gameId', authenticateToken, requireOwnerOrAdmin, validateUserId, validateGameId, removeFromFavorites);

module.exports = router;
