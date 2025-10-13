const express = require('express');
const {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} = require('../controllers/charactersController');
const {
  authenticateToken,
  requireAdmin,
} = require('../middleware/authMiddleware');
const {
  validateCharacterCreation,
  validateId,
  validatePagination,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Get all characters with pagination
router.get('/', validatePagination, getCharacters);

// Get character by ID
router.get('/:id', validateId, getCharacterById);

// Create character (admin only)
router.post('/', authenticateToken, requireAdmin, validateCharacterCreation, createCharacter);

// Update character (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateId, validateCharacterCreation, updateCharacter);

// Delete character (admin only)
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteCharacter);

module.exports = router;
