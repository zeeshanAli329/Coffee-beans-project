const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const tokenFrom = (req) => {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

exports.protect = asyncHandler(async (req, _res, next) => {
  const token = tokenFrom(req);
  if (!token) throw new ApiError(401, 'Please sign in to continue.');
  let payload;
  try { payload = jwt.verify(token, jwtSecret); } catch { throw new ApiError(401, 'Your session has expired. Please sign in again.'); }
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'Account no longer exists.');
  req.user = user;
  next();
});

// Attaches req.user when a valid token is present; never fails (guest checkout).
exports.optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = tokenFrom(req);
  if (token) {
    try {
      const payload = jwt.verify(token, jwtSecret);
      req.user = await User.findById(payload.id);
    } catch { /* treat as guest */ }
  }
  next();
});

exports.adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') return next(new ApiError(403, 'Admin access required.'));
  next();
};
