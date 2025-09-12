import rateLimit from 'express-rate-limit';

const defaultOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use walletAddress if user is authenticated, otherwise use IP
    if (req.user?.walletAddress) {
      return req.user.walletAddress;
    }
    // Use express-rate-limit's built-in function for IPv6 compatibility
    return req.ip;
  },
  skip: (req) => {
    // Skip health check endpoint
    return req.path === '/health';
  }
};

/**
 * Rate limit presets for different endpoint types
 * 
 * @type {Object}
 * @property {Function} default - General API endpoints (500 req/15min)
 * @property {Function} authenticated - Authenticated endpoints (300 req/15min)
 * @property {Function} minigame - Minigame endpoints (300 req/15min)
 * @property {Function} create - Custom rate limit creator
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
      message: 'Rate limit exceeded for authenticated endpoints. Please try again later.',
      retryAfter: '15 minutes'
    }
  }),

  minigame: rateLimit({
    ...defaultOptions,
    max: 300,
    windowMs: 15 * 60 * 1000,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded for minigame endpoints. Please try again later.',
      retryAfter: '15 minutes'
    }
  }),

  create: (options = {}) => {
    return rateLimit({
      ...defaultOptions,
      ...options,
      message: {
        ...defaultOptions.message,
        ...options.message
      }
    });
  }
};

/**
 * Legacy rate limit for backward compatibility
 * @param {number} limit - Max requests
 * @param {number} windowMs - Time window in ms
 * @returns {Function} Express middleware
 */
export const legacyRateLimit = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimitPresets.create({
    max: limit,
    windowMs,
    keyGenerator: (req) => req.user?.walletAddress || req.ip,
    message: {
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: `${Math.ceil(windowMs / 60000)} minutes`
    }
  });
};

export default {
  legacyRateLimit,
  presets: rateLimitPresets
};
