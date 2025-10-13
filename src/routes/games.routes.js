const express = require('express');
const multer = require('multer');
const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  searchGames,
  uploadCover,
} = require('../controllers/gamesController');
const {
  authenticateToken,
  requireAdmin,
} = require('../middleware/authMiddleware');
const {
  validateGameCreation,
  validateId,
  validatePagination,
} = require('../middleware/validationMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all games with filters and pagination
router.get('/', validatePagination, getGames);

// Search games
router.get('/search', validatePagination, searchGames);

// Get game by ID
router.get('/:id', validateId, getGameById);

// Create game (admin only)
router.post('/', authenticateToken, requireAdmin, validateGameCreation, createGame);

// Update game (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateId, validateGameCreation, updateGame);

// Delete game (admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteGame);

// Upload cover image (admin only)
router.post('/:id/cover', authenticateToken, requireAdmin, validateId, upload.single('cover'), uploadCover);

module.exports = router;
