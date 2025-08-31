import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

// Authentication middleware for wallet-based authentication
export class AuthMiddleware {
  // Verify JWT token and extract wallet address
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token) {
        return res.status(401).json({ error: 'Invalid token format' });
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.walletAddress) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }

      // Add user info to request
      req.user = {
        walletAddress: decoded.walletAddress,
        tokenId: decoded.tokenId,
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }

      res.status(500).json({ error: 'Authentication error' });
    }
  }

  // Generate JWT token for wallet address
  static generateToken(walletAddress) {
    const payload = {
      walletAddress,
      tokenId: `token_${Date.now()}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  // Optional authentication - doesn't fail if no token
  static async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // Continue without authentication
      }

      const token = authHeader.substring(7);

      if (!token) {
        return next(); // Continue without authentication
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.walletAddress) {
        req.user = {
          walletAddress: decoded.walletAddress,
          tokenId: decoded.tokenId,
        };
      }

      next();
    } catch (error) {
      // Continue without authentication on error
      console.error('Optional auth error:', error);
      next();
    }
  }

  // Verify wallet ownership for specific resource
  static async verifyOwnership(resourceType) {
    return async (req, res, next) => {
      try {
        if (!req.user || !req.user.walletAddress) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const { walletAddress } = req.user;
        let resourceId;

        // Extract resource ID based on resource type
        switch (resourceType) {
        case 'fish':
          resourceId = req.params.fishId;
          break;
        case 'aquarium':
          resourceId = req.params.aquariumId;
          break;
        case 'session':
          resourceId = req.params.sessionId;
          break;
        default:
          return res.status(400).json({ error: 'Invalid resource type' });
        }

        if (!resourceId) {
          return res.status(400).json({ error: 'Resource ID required' });
        }

        // Verify ownership in database
        const isOwner = await this.checkResourceOwnership(
          resourceType,
          resourceId,
          walletAddress
        );

        if (!isOwner) {
          return res
            .status(403)
            .json({ error: 'Access denied - not the owner' });
        }

        next();
      } catch (error) {
        console.error('Ownership verification error:', error);
        res.status(500).json({ error: 'Ownership verification failed' });
      }
    };
  }

  // Check if wallet owns the specified resource
  static async checkResourceOwnership(resourceType, resourceId, walletAddress) {
    try {
      let tableName, idField;

      switch (resourceType) {
      case 'fish':
        tableName = 'fish_nfts';
        idField = 'fish_id';
        break;
      case 'aquarium':
        tableName = 'aquarium_nfts';
        idField = 'aquarium_id';
        break;
      case 'session':
        tableName = 'minigame_sessions';
        idField = 'session_id';
        break;
      default:
        return false;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select('owner_address')
        .eq(idField, resourceId)
        .eq('owner_address', walletAddress)
        .single();

      if (error || !data) {
        return false;
      }

      return data.owner_address === walletAddress;
    } catch (error) {
      console.error('Error checking resource ownership:', error);
      return false;
    }
  }

  // Rate limiting middleware
  static rateLimit(limit = 100, windowMs = 15 * 60 * 1000) {
    // 100 requests per 15 minutes
    const requests = new Map();

    return (req, res, next) => {
      const key = req.user?.walletAddress || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean old requests
      if (requests.has(key)) {
        requests.set(
          key,
          requests.get(key).filter(timestamp => timestamp > windowStart)
        );
      } else {
        requests.set(key, []);
      }

      const userRequests = requests.get(key);

      if (userRequests.length >= limit) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      userRequests.push(now);
      next();
    };
  }
}

// Simple authentication middleware for Aqua Stark
// Validates player ID from request headers

export const simpleAuth = (req, res, next) => {
  try {
    // Get player ID from headers
    const playerId = req.headers['x-player-id'];

    // Check if player ID is provided
    if (!playerId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Player ID must be provided in x-player-id header',
      });
    }

    // Validate player ID format (basic validation)
    if (typeof playerId !== 'string' || playerId.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid player ID',
        message: 'Player ID must be a non-empty string',
      });
    }

    // Add user info to request object
    req.user = {
      playerId: playerId.trim(),
      authenticated: true,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication',
    });
  }
};

// Optional authentication middleware (for endpoints that can work with or without auth)
export const optionalAuth = (req, res, next) => {
  try {
    const playerId = req.headers['x-player-id'];

    if (
      playerId &&
      typeof playerId === 'string' &&
      playerId.trim().length > 0
    ) {
      req.user = {
        playerId: playerId.trim(),
        authenticated: true,
      };
    } else {
      req.user = {
        authenticated: false,
      };
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    req.user = { authenticated: false };
    next();
  }
};

// Ownership validation middleware
export const validateOwnership = resourceType => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.authenticated) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'Must be authenticated to access this resource',
        });
      }

      const { playerId } = req.user;
      const resourceId = req.params[`${resourceType}Id`] || req.params.id;

      if (!resourceId) {
        return res.status(400).json({
          error: 'Resource ID required',
          message: `${resourceType} ID is required`,
        });
      }

      // Import services dynamically to avoid circular dependencies
      let service;
      switch (resourceType) {
      case 'fish': {
        const { FishService } = await import('../services/fishService.js');
        service = FishService;
        break;
      }
      case 'decoration': {
        const { DecorationService } = await import(
          '../services/decorationService.js'
        );
        service = DecorationService;
        break;
      }
      case 'player': {
        const { PlayerService } = await import(
          '../services/playerService.js'
        );
        service = PlayerService;
        break;
      }
      default:
        return res.status(400).json({
          error: 'Invalid resource type',
          message: `Unknown resource type: ${resourceType}`,
        });
      }

      // Get resource and check ownership
      const resource =
        await service[
          `get${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}State`
        ](resourceId);

      if (!resource) {
        return res.status(404).json({
          error: 'Resource not found',
          message: `${resourceType} not found`,
        });
      }

      if (resource.player_id !== playerId) {
        return res.status(403).json({
          error: 'Access denied',
          message: `You don't own this ${resourceType}`,
        });
      }

      // Add resource to request for controllers to use
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership validation error:', error);
      res.status(500).json({
        error: 'Ownership validation failed',
        message: 'Internal server error during ownership validation',
      });
    }
  };
};
