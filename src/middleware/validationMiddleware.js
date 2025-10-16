const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Validation rules for user creation
const validateUserCreation = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  handleValidationErrors,
];

// Validation rules for game creation
const validateGameCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('releaseDate')
    .optional()
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  body('genres')
    .optional()
    .isArray()
    .withMessage('Genres must be an array'),
  body('platforms')
    .optional()
    .isArray()
    .withMessage('Platforms must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        for (const id of value) {
          if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error('Each platform ID must be a valid ObjectId');
          }
        }
      }
      return true;
    }),
  body('characters')
    .optional()
    .isArray()
    .withMessage('Characters must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        for (const id of value) {
          if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error('Each character ID must be a valid ObjectId');
          }
        }
      }
      return true;
    }),
  body('ratingAverage')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  handleValidationErrors,
];

// Validation rules for character creation
const validateCharacterCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),
  body('abilities')
    .optional()
    .isArray()
    .withMessage('Abilities must be an array'),
  handleValidationErrors,
];

// Validation rules for platform creation
const validatePlatformCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('manufacturer')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Manufacturer must be less than 100 characters'),
  body('releaseYear')
    .optional()
    .isInt({ min: 1970, max: new Date().getFullYear() + 5 })
    .withMessage('Release year must be a valid year'),
  body('type')
    .optional()
    .isIn(['console', 'handheld', 'pc', 'mobile', 'other'])
    .withMessage('Type must be one of: console, handheld, pc, mobile, other'),
  handleValidationErrors,
];

// Validation rules for ID parameters
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors,
];

const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  handleValidationErrors,
];

const validateGameId = [
  param('gameId')
    .isMongoId()
    .withMessage('Invalid game ID format'),
  handleValidationErrors,
];

const validatePlatformId = [
  param('platformId')
    .isMongoId()
    .withMessage('Invalid platform ID format'),
  handleValidationErrors,
];

// Validation rules for pagination
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  validateUserCreation,
  validateGameCreation,
  validateCharacterCreation,
  validatePlatformCreation,
  validateId,
  validateUserId,
  validateGameId,
  validatePlatformId,
  validatePagination,
};
