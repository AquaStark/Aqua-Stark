import { MinigameService } from '../services/minigameService.js';
import { loggingMiddleware } from '../middleware/logging.js';

/**
 * Minigame Controller
 *
 * Handles HTTP requests related to minigame operations including session management,
 * scoring, leaderboards, achievements, and game statistics.
 *
 * Supported game types:
 * - flappy_fish: Navigate fish through obstacles
 * - angry_fish: Launch fish to hit targets
 * - fish_racing: Race fish against others
 * - bubble_pop: Pop bubbles to earn points
 * - fish_memory: Match fish pairs in memory game
 *
 * All methods follow a consistent response format:
 * - Success: { success: true, data: result, message?: string }
 * - Error: { error: string }
 *
 * @class MinigameController
 */
export class MinigameController {
  /**
   * Create a new game session
   *
   * Creates a new minigame session for the authenticated player.
   * Validates the game type against supported games.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.gameType - Type of game to start
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.walletAddress - Player's wallet address
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with created session data
   *
   * @example
   * // POST /api/minigames/sessions
   * // Body: { gameType: "flappy_fish" }
   * // Response: { success: true, data: { sessionId: "123", ... }, message: "Game session created for flappy_fish" }
   */
  static async createGameSession(req, res) {
    try {
      const { gameType } = req.body;
      const { walletAddress } = req.user;

      if (!gameType) {
        return res.status(400).json({ error: 'Game type is required' });
      }

      const validGameTypes = [
        'floppy_fish',
        'flappy_fish',
        'bubble_jumper',
        'fish_dodge',
        'angry_fish',
        'fish_racing',
        'bubble_pop',
        'fish_memory',
      ];
      if (!validGameTypes.includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
      }

      const session = await MinigameService.createGameSession(
        walletAddress,
        gameType
      );

      res.json({
        success: true,
        data: session,
        message: `Game session created for ${gameType}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'createGameSession',
        error,
        {
          gameType: req.body?.gameType,
          walletAddress: req.user?.walletAddress,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * End game session with final score
   *
   * Ends an active game session and records the final score.
   * Calculates XP earned based on game type and score.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.sessionId - Game session ID from URL
   * @param {Object} req.body - Request body
   * @param {number} req.body.finalScore - Final score achieved
   * @param {string} req.body.gameType - Game type for XP calculation
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.walletAddress - Player's wallet address
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with ended session data
   *
   * @example
   * // PUT /api/minigames/sessions/123/end
   * // Body: { finalScore: 1500, gameType: "flappy_fish" }
   * // Response: { success: true, data: { ... }, message: "Game ended! Score: 1500, XP earned: 75" }
   */
  static async endGameSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { finalScore, gameType } = req.body;

      if (!sessionId || finalScore === undefined || !gameType) {
        return res.status(400).json({
          error: 'Session ID, final score, and game type are required',
        });
      }

      const session = await MinigameService.endGameSession(
        sessionId,
        finalScore,
        gameType
      );

      res.json({
        success: true,
        data: session,
        message: 'Game session ended successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'endGameSession',
        error,
        {
          sessionId: req.params?.sessionId,
          finalScore: req.body?.finalScore,
          gameType: req.body?.gameType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get player statistics
   *
   * Retrieves comprehensive statistics for the authenticated player across all games.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.walletAddress - Player's wallet address
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with player statistics
   *
   * @example
   * // GET /api/minigames/stats
   * // Response: { success: true, data: { totalGames: 25, totalScore: 15000, ... } }
   */
  static async getPlayerStats(req, res) {
    try {
      // Use wallet address from authenticated user or from params
      const walletAddress =
        req.user?.walletAddress || req.params?.playerId || req.query?.wallet;

      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const stats = await MinigameService.getPlayerStats(walletAddress);

      res.json({ success: true, data: stats });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getPlayerStats',
        error,
        {
          walletAddress: req.user?.walletAddress || req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get leaderboard for specific game type
   *
   * Retrieves the leaderboard for a specific game type with optional limit.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.gameType - Game type for leaderboard
   * @param {Object} req.query - Query parameters
   * @param {number} [req.query.limit=10] - Maximum number of results to return
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with game leaderboard
   *
   * @example
   * // GET /api/minigames/leaderboard/flappy_fish?limit=20
   * // Response: { success: true, data: [{ rank: 1, player: "user1", score: 5000 }, ...] }
   */
  static async getGameLeaderboard(req, res) {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      const leaderboard = await MinigameService.getGameLeaderboard(
        gameType,
        limit
      );

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameLeaderboard',
        error,
        {
          gameType: req.params?.gameType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get global leaderboard
   *
   * Retrieves the global leaderboard across all game types with optional limit.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters
   * @param {number} [req.query.limit=20] - Maximum number of results to return
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with global leaderboard
   *
   * @example
   * // GET /api/minigames/leaderboard/global?limit=50
   * // Response: { success: true, data: [{ rank: 1, player: "user1", totalScore: 25000 }, ...] }
   */
  static async getGlobalLeaderboard(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;

      const leaderboard = await MinigameService.getGlobalLeaderboard(limit);

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGlobalLeaderboard',
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Award bonus XP for achievements
   *
   * Awards bonus experience points for achieving specific milestones or accomplishments.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.achievement - Achievement name or description
   * @param {number} req.body.bonusXP - Amount of bonus XP to award
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.walletAddress - Player's wallet address
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with bonus XP session data
   *
   * @example
   * // POST /api/minigames/bonus-xp
   * // Body: { achievement: "First Perfect Game", bonusXP: 100 }
   * // Response: { success: true, data: { ... }, message: "Bonus XP awarded for achievement: First Perfect Game" }
   */
  static async awardBonusXP(req, res) {
    try {
      const { playerId } = req.params;
      const { bonusXP } = req.body;

      if (!bonusXP || bonusXP <= 0) {
        return res.status(400).json({
          error: 'Valid bonus XP amount is required',
        });
      }

      const result = await MinigameService.awardBonusXP(playerId, bonusXP);

      res.json({
        success: true,
        data: result,
        message: `Bonus XP awarded: +${bonusXP}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'awardBonusXP',
        error,
        {
          playerId: req.params?.playerId,
          bonusXP: req.body?.bonusXP,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get game session by ID
   *
   * Retrieves details of a specific game session.
   * Currently returns placeholder data as implementation is pending.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.sessionId - Game session ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.walletAddress - Player's wallet address
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with session details
   *
   * @example
   * // GET /api/minigames/sessions/123
   * // Response: { success: true, data: { sessionId: "123", status: "active" }, message: "Session details retrieved" }
   */
  static async getGameSession(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await MinigameService.getGameSession(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Game session not found' });
      }

      res.json({ success: true, data: session });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameSession',
        error,
        {
          sessionId: req.params?.sessionId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get available game types
   *
   * Returns a list of all available minigame types with their metadata.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with array of game types
   *
   * @example
   * // GET /api/minigames/types
   * // Response: { success: true, data: [
   * //   { id: "flappy_fish", name: "Flappy Fish", description: "...", baseXP: 10, difficulty: "medium" },
   * //   ...
   * // ]}
   */
  static async getGameTypes(req, res) {
    try {
      const gameTypes = await MinigameService.getGameTypes();

      res.json({
        success: true,
        data: gameTypes,
        count: gameTypes.length,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'MinigameController',
        'getGameTypes',
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
