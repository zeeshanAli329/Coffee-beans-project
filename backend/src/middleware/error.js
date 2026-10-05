const { ZodError } = require('zod');
const { isProd } = require('../config/env');
const ApiError = require('../utils/ApiError');

exports.notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return res.status(400).json({ message: details[0]?.message || 'Invalid input', details });
  }
  if (err instanceof ApiError) return res.status(err.status).json({ message: err.message, details: err.details });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier.' });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: isProd ? 'Something went wrong on our side.' : err.message });
};
