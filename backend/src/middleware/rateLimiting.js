import { rateLimit } from 'express-rate-limit';

/**
 * Default configuration options for rate limiting middleware
 * @type {Object}
 * @property {number} windowMs - Time window in milliseconds (15 minutes)
 * @property {number} max - Maximum number of requests per window (100)
 * @property {Object} message - Response message when rate limit is exceeded
 * @property {boolean} standardHeaders - Include rate limit info in headers
 * @property {boolean} legacyHeaders - Disable legacy headers
 * @property {Function} handler - Custom handler for rate limit violations with logging
 * @property {Function} skip - Skip rate limiting for certain requests (health checks)
 */
const defaultOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    try {
      console.warn('Rate limit exceeded:', {
        ip: req.ip,
        max: options?.max,
        windowMs: options?.windowMs,
        path: req.originalUrl || req.path,
        method: req.method,
        userAgent: req.get('User-Agent') || 'Unknown',
        timestamp: new Date().toISOString(),
      });
    } catch (logError) {
      console.error('Error logging rate limit violation:', logError);
    }

    res.status(options.statusCode).json(options.message);
  },
  skip: req => {
    return req.path === '/health';
  },
};

/**
 * Pre-configured rate limiting presets for different endpoint types.
 * All presets use IP-based rate limiting with detailed violation logging.
 *
 * @namespace rateLimitPresets
 * @property {Function} default - General API endpoints (500 req/15min)
 * @property {Function} authenticated - Authenticated endpoints (300 req/15min)
 * @property {Function} minigame - Minigame endpoints (300 req/15min)
 * @property {Function} create - Factory function for custom rate limiters
 *
 * @example
 * // Apply to all routes
 * app.use(rateLimitPresets.default);
 *
 * @example
 * // Apply to specific routes
 * router.use('/auth', rateLimitPresets.authenticated);
 */
export const rateLimitPresets = {
  default: rateLimit({
    ...defaultOptions,
    max: 500,
    windowMs: 15 * 60 * 1000,
  }),

  authenticated: rateLimit({
    ...defaultOptions,
    max: 300,
    windowMs: 15 * 60 * 1000,
    message: {
      error: 'Too many requests',
      message:
        'Rate limit exceeded for authenticated endpoints. Please try again later.',
      retryAfter: '15 minutes',
    },
  }),

  minigame: rateLimit({
    ...defaultOptions,
    max: 300,
    windowMs: 15 * 60 * 1000,
    message: {
      error: 'Too many requests',
      message:
        'Rate limit exceeded for minigame endpoints. Please try again later.',
      retryAfter: '15 minutes',
    },
  }),

  /**
   * Factory function to create custom rate limiters with error handling
   * @param {Object} [options={}] - Custom rate limiting options
   * @param {number} [options.max] - Maximum requests per window
   * @param {number} [options.windowMs] - Time window in milliseconds
   * @param {Object|string} [options.message] - Custom error message (object or string)
   * @returns {Function} Express middleware for rate limiting
   * @example
   * // Create custom rate limiter
   * const customLimiter = rateLimitPresets.create({
   *   max: 1000,
   *   windowMs: 60 * 1000, // 1 minute
   * });
   */
  create: (options = {}) => {
    try {
      return rateLimit({
        ...defaultOptions,
        ...options,
        message:
          typeof options.message === 'object'
            ? {
                ...defaultOptions.message,
                ...options.message,
              }
            : (options.message ?? defaultOptions.message),
      });
    } catch (error) {
      console.error('Error creating rate limiter:', error);
      // Return default limiter as fallback
      return rateLimitPresets.default;
    }
  },
};

/**
 * Legacy rate limit function for backward compatibility
 * @param {number} [limit=100] - Maximum requests per window
 * @param {number} [windowMs=900000] - Time window in milliseconds (default: 15 minutes)
 * @returns {Function} Express middleware function for rate limiting
 * @example
 * // Apply 50 requests per 10 minutes
 * app.use('/api', legacyRateLimit(50, 10 * 60 * 1000));
 */
export const legacyRateLimit = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimitPresets.create({
    max: limit,
    windowMs,
    message: {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: `${Math.ceil(windowMs / 60000)} minutes`,
    },
  });
};

export default {
  legacyRateLimit,
  presets: rateLimitPresets,
};
