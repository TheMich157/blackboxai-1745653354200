const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (err) {
    next(err);
  }
};

// Middleware to check user roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.accountType)) {
      return res.status(403).json({
        status: 'error',
        message: `User role ${req.user.accountType} is not authorized to access this route`
      });
    }
    next();
  };
};

// Middleware to check if user is suspended
exports.checkAccountStatus = async (req, res, next) => {
  try {
    if (req.user.accountStanding === 'suspended') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account is currently suspended'
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
