const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check if user owns resource or is admin
const requireOwnerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin,
};
