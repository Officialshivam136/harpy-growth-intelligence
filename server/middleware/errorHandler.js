/**
 * Centralised Express Error Handling Middleware
 */

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : err.status || 500;

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: 'Database Validation Error',
      errors: messages,
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Conflict: Duplicate record detected for ${field}`,
      keyValue: err.keyValue,
    });
  }

  // CastError (invalid ObjectId or format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Resource format invalid: ${err.path}`,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;

