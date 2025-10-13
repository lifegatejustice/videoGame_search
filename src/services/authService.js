// Auth service - additional auth logic if needed
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

// Create user from OAuth profile
const createUserFromOAuth = async (profile, provider) => {
  const userData = {
    oauthProvider: provider,
    providerId: profile.id,
    username: profile.displayName || profile.username,
    email: profile.emails ? profile.emails[0].value : null,
    avatarUrl: profile.photos ? profile.photos[0].value : null,
    role: 'user',
  };

  const user = new User(userData);
  await user.save();
  return user;
};

// Find or create user from OAuth
const findOrCreateUser = async (profile, provider) => {
  let user = await User.findOne({
    providerId: profile.id,
    oauthProvider: provider,
  });

  if (!user) {
    user = await createUserFromOAuth(profile, provider);
  }

  return user;
};

module.exports = {
  generateToken,
  verifyToken,
  createUserFromOAuth,
  findOrCreateUser,
};
