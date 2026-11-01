/**
 * Request Validation Middleware Helper
 */

export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload: Request body is missing or malformed',
      });
    }

    const missing = requiredFields.filter((field) => {
      const val = req.body[field];
      return val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Missing required fields: ${missing.join(', ')}`,
        missingFields: missing,
      });
    }

    next();
  };
};

export default {
  validateBody,
};

