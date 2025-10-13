const express = require('express');
const {
  getPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getGamesByPlatform,
} = require('../controllers/platformsController');
const {
  authenticateToken,
  requireAdmin,
} = require('../middleware/authMiddleware');
const {
  validatePlatformCreation,
  validateId,
  validatePagination,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Get all platforms with pagination
router.get('/', validatePagination, getPlatforms);

// Get platform by ID
router.get('/:id', validateId, getPlatformById);

// Create platform (admin only)
router.post('/', authenticateToken, requireAdmin, validatePlatformCreation, createPlatform);

// Update platform (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateId, validatePlatformCreation, updatePlatform);

// Delete platform (admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateId, deletePlatform);

// Get games by platform
router.get('/:id/games', validateId, validatePagination, getGamesByPlatform);

module.exports = router;
