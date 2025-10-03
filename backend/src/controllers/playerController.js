import { PlayerService } from '../services/playerService.js';
import { loggingMiddleware } from '../middleware/logging.js';

/**
 * Player Controller
 *
 * Handles HTTP requests related to player operations including profile management,
 * experience tracking, currency updates, statistics, and preferences.
 *
 * All methods follow a consistent response format:
 * - Success: { success: true, data: result, message?: string }
 * - Error: { error: string }
 *
 * @class PlayerController
 */
export class PlayerController {
  /**
   * Get player profile
   *
   * Retrieves the authenticated player's profile information.
   * The resource is pre-validated by ownership middleware.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.resource - Pre-validated player resource from middleware
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with player profile data
   *
   * @example
   * // GET /api/players/profile
   * // Response: { success: true, data: { playerId: "123", walletAddress: "0x...", ... } }
   */
  static async getPlayerProfile(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const playerProfile = req.resource;

      res.json({ success: true, data: playerProfile });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'getPlayerProfile',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get player by wallet address
   *
   * Public endpoint that retrieves player information by wallet address.
   * No authentication required for this endpoint.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.walletAddress - The wallet address to search for
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with player data or error
   *
   * @example
   * // GET /api/players/wallet/0x1234567890abcdef
   * // Response: { success: true, data: { playerId: "123", username: "player1", ... } }
   */
  static async getPlayerByWallet(req, res) {
    try {
      const { walletAddress } = req.params;

      const player = await PlayerService.getPlayerByWallet(walletAddress);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json({ success: true, data: player });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'getPlayerByWallet',
        error,
        {
          walletAddress: req.params?.walletAddress,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create new player
   *
   * Public endpoint that creates a new player account.
   * No authentication required for account creation.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.playerId - Unique player identifier
   * @param {string} req.body.walletAddress - Player's wallet address
   * @param {string} [req.body.username] - Optional username for the player
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with created player data
   *
   * @example
   * // POST /api/players
   * // Body: { playerId: "123", walletAddress: "0x123...", username: "player1" }
   * // Response: { success: true, data: { playerId: "123", ... }, message: "Player created successfully" }
   */
  static async createPlayer(req, res) {
    try {
      const { playerId, walletAddress, username } = req.body;

      const newPlayer = await PlayerService.createPlayer(
        playerId,
        walletAddress,
        username
      );

      res.status(201).json({
        success: true,
        data: newPlayer,
        message: 'Player created successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'createPlayer',
        error,
        {
          playerId: req.body?.playerId,
          walletAddress: req.body?.walletAddress,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update player experience
   *
   * Updates the player's experience points. Players can only update their own experience.
   * Validates that the experience gained is positive.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.body - Request body
   * @param {number} req.body.experienceGained - Amount of experience to add
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated player data
   *
   * @example
   * // PUT /api/players/123/experience
   * // Body: { experienceGained: 50 }
   * // Response: { success: true, data: { ... }, message: "Experience updated: +50 XP" }
   */
  static async updatePlayerExperience(req, res) {
    try {
      const { playerId } = req.params;
      const { experienceGained } = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own experience
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerExperience(
        playerId,
        experienceGained
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: `Experience updated: +${experienceGained} XP`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'updatePlayerExperience',
        error,
        {
          playerId: req.params?.playerId,
          experienceGained: req.body?.experienceGained,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update player currency
   *
   * Updates the player's currency balance. Players can only update their own currency.
   * Currency change can be positive (gain) or negative (spend).
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.body - Request body
   * @param {number} req.body.currencyChange - Amount to add/subtract from currency
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated player data
   *
   * @example
   * // PUT /api/players/123/currency
   * // Body: { currencyChange: -100 }
   * // Response: { success: true, data: { ... }, message: "Currency updated: -100" }
   */
  static async updatePlayerCurrency(req, res) {
    try {
      const { playerId } = req.params;
      const { currencyChange } = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own currency
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerCurrency(
        playerId,
        currencyChange
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: `Currency updated: ${currencyChange > 0 ? '+' : ''}${currencyChange}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'updatePlayerCurrency',
        error,
        {
          playerId: req.params?.playerId,
          currencyChange: req.body?.currencyChange,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update player statistics
   *
   * Updates various player statistics. Players can only update their own stats.
   * Accepts any statistics object to be merged with existing stats.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.body - Request body containing stats to update
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated player data
   *
   * @example
   * // PUT /api/players/123/stats
   * // Body: { gamesPlayed: 10, highScore: 1500 }
   * // Response: { success: true, data: { ... }, message: "Player statistics updated successfully" }
   */
  static async updatePlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const statsUpdate = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own stats
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updatePlayerStats(
        playerId,
        statsUpdate
      );

      res.json({
        success: true,
        data: updatedPlayer,
        message: 'Player statistics updated successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'updatePlayerStats',
        error,
        {
          playerId: req.params?.playerId,
          statsUpdate: req.body,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update last login
   *
   * Updates the player's last login timestamp. Players can only update their own login time.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated player data
   *
   * @example
   * // PUT /api/players/123/last-login
   * // Response: { success: true, data: { ... }, message: "Last login updated successfully" }
   */
  static async updateLastLogin(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own last login
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPlayer = await PlayerService.updateLastLogin(playerId);

      res.json({
        success: true,
        data: updatedPlayer,
        message: 'Last login updated successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'updateLastLogin',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get player preferences
   *
   * Retrieves the player's preferences/settings. Players can only access their own preferences.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with player preferences
   *
   * @example
   * // GET /api/players/123/preferences
   * // Response: { success: true, data: { theme: "dark", soundEnabled: true, ... } }
   */
  static async getPlayerPreferences(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own preferences
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const preferences = await PlayerService.getPlayerPreferences(playerId);

      if (!preferences) {
        return res.status(404).json({ error: 'Player preferences not found' });
      }

      res.json({ success: true, data: preferences });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'getPlayerPreferences',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update player preferences
   *
   * Updates the player's preferences/settings. Players can only update their own preferences.
   * Accepts any preferences object to be stored.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.body - Request body containing preferences to update
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated preferences
   *
   * @example
   * // PUT /api/players/123/preferences
   * // Body: { theme: "light", soundEnabled: false }
   * // Response: { success: true, data: { ... }, message: "Player preferences updated successfully" }
   */
  static async updatePlayerPreferences(req, res) {
    try {
      const { playerId } = req.params;
      const preferences = req.body;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only update their own preferences
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedPreferences = await PlayerService.updatePlayerPreferences(
        playerId,
        preferences
      );

      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Player preferences updated successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'updatePlayerPreferences',
        error,
        {
          playerId: req.params?.playerId,
          preferences: req.body,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get player dashboard data
   *
   * Retrieves comprehensive dashboard information including profile, preferences, and stats.
   * Players can only access their own dashboard. Combines data from multiple services.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with dashboard data
   *
   * @example
   * // GET /api/players/123/dashboard
   * // Response: { success: true, data: { profile: {...}, preferences: {...}, lastUpdated: "2023-..." } }
   */
  static async getPlayerDashboard(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own dashboard
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const [profile, preferences] = await Promise.all([
        PlayerService.getPlayerProfile(playerId),
        PlayerService.getPlayerPreferences(playerId),
      ]);

      if (!profile) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const dashboardData = {
        profile,
        preferences: preferences || {},
        lastUpdated: new Date().toISOString(),
      };

      res.json({ success: true, data: dashboardData });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'PlayerController',
        'getPlayerDashboard',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
