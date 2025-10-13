// Custom validation utilities
const mongoose = require('mongoose');

// Check if string is valid MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate date format (ISO 8601)
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validate rating (0-10)
const isValidRating = (rating) => {
  return typeof rating === 'number' && rating >= 0 && rating <= 10;
};

// Validate release year
const isValidReleaseYear = (year) => {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(year) && year >= 1970 && year <= currentYear + 5;
};

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

// Validate array of strings
const validateStringArray = (arr, maxLength = 100) => {
  if (!Array.isArray(arr)) return false;
  return arr.every(item =>
    typeof item === 'string' &&
    item.trim().length > 0 &&
    item.length <= maxLength
  );
};

module.exports = {
  isValidObjectId,
  isValidEmail,
  isValidUrl,
  isValidDate,
  isValidRating,
  isValidReleaseYear,
  sanitizeString,
  validateStringArray,
};
