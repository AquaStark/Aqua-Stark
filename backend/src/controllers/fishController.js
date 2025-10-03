import { FishService } from '../services/fishService.js';
import { loggingMiddleware } from '../middleware/logging.js';

/**
 * Fish Controller
 *
 * Handles HTTP requests related to fish operations including state management,
 * happiness updates, feeding, statistics, and breeding operations.
 *
 * All methods follow a consistent response format:
 * - Success: { success: true, data: result, message?: string }
 * - Error: { error: string }
 *
 * @class FishController
 */
export class FishController {
  /**
   * Get fish state
   *
   * Retrieves the current state of a specific fish.
   * The resource is pre-validated by ownership middleware.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.resource - Pre-validated fish resource from middleware
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with fish state data
   *
   * @example
   * // GET /api/fish/123/state
   * // Response: { success: true, data: { fishId: "123", happiness: 85, ... } }
   */
  static async getFishState(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const fishState = req.resource;

      res.json({ success: true, data: fishState });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'getFishState',
        error,
        {
          fishId: req.params?.fishId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update fish happiness
   *
   * Updates the happiness level of a specific fish.
   * Happiness must be between 0 and 100.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.fishId - Fish ID from URL
   * @param {Object} req.body - Request body
   * @param {number} req.body.happinessLevel - New happiness level (0-100)
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated fish data
   *
   * @example
   * // PUT /api/fish/123/happiness
   * // Body: { happinessLevel: 90 }
   * // Response: { success: true, data: { ... }, message: "Fish happiness updated to 90" }
   */
  static async updateFishHappiness(req, res) {
    try {
      const { fishId } = req.params;
      const { happinessLevel } = req.body;

      const updatedFish = await FishService.updateFishHappiness(
        fishId,
        happinessLevel
      );

      res.json({
        success: true,
        data: updatedFish,
        message: `Fish happiness updated to ${happinessLevel}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'updateFishHappiness',
        error,
        {
          fishId: req.params?.fishId,
          happinessLevel: req.body?.happinessLevel,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Feed fish
   *
   * Feeds a fish with specified food type, affecting happiness and growth.
   * Defaults to 'regular' food type if not specified.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.fishId - Fish ID from URL
   * @param {Object} req.body - Request body
   * @param {string} [req.body.foodType='regular'] - Type of food to feed
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with feeding result
   *
   * @example
   * // POST /api/fish/123/feed
   * // Body: { foodType: "premium" }
   * // Response: { success: true, data: { ... }, message: "Fish fed with premium food" }
   */
  static async feedFish(req, res) {
    try {
      const { fishId } = req.params;
      const { foodType = 'regular' } = req.body;

      const feedingResult = await FishService.feedFish(fishId, foodType);

      res.json({
        success: true,
        data: feedingResult,
        message: `Fish fed with ${foodType} food`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'feedFish',
        error,
        {
          fishId: req.params?.fishId,
          foodType: req.body?.foodType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get fish statistics
   *
   * Retrieves detailed statistics for a specific fish including growth, feeding history, etc.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.fishId - Fish ID from URL
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with fish statistics
   *
   * @example
   * // GET /api/fish/123/stats
   * // Response: { success: true, data: { totalFeedings: 15, growthRate: 1.2, ... } }
   */
  static async getFishStats(req, res) {
    try {
      const { fishId } = req.params;

      const stats = await FishService.getFishStats(fishId);

      if (!stats) {
        return res.status(404).json({ error: 'Fish not found' });
      }

      res.json({ success: true, data: stats });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'getFishStats',
        error,
        {
          fishId: req.params?.fishId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Breed fish
   *
   * Placeholder endpoint for fish breeding functionality.
   * Currently returns a "not implemented" response.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.parent1Id - ID of first parent fish
   * @param {string} req.body.parent2Id - ID of second parent fish
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response indicating not implemented
   *
   * @example
   * // POST /api/fish/breed
   * // Body: { parent1Id: "123", parent2Id: "456" }
   * // Response: { error: "Not implemented", message: "Fish breeding will be implemented in a future update" }
   */
  static async breedFish(req, res) {
    try {
      const { parent1Id: _parent1Id, parent2Id: _parent2Id } = req.body;

      // This would be implemented when breeding is added
      res.status(501).json({
        error: 'Not implemented',
        message: 'Fish breeding will be implemented in a future update',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'breedFish',
        error,
        {
          parent1Id: req.body?.parent1Id,
          parent2Id: req.body?.parent2Id,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get all fish for a player
   *
   * Retrieves all fish belonging to a specific player.
   * Players can only access their own fish.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with array of player's fish
   *
   * @example
   * // GET /api/players/123/fish
   * // Response: { success: true, data: [{ fishId: "456", species: "goldfish", ... }, ...] }
   */
  static async getPlayerFish(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own fish
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const fish = await FishService.getPlayerFish(playerId);

      res.json({ success: true, data: fish });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'getPlayerFish',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Feed multiple fish
   *
   * Feeds multiple fish in a single request with the specified food type.
   * Defaults to 'basic' food if none is provided.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string[]} req.body.fishIds - Array of fish IDs to feed
   * @param {string} [req.body.foodType='basic'] - Type of food to feed the fish
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response summarizing successes and failures
   *
   * @example
   * // POST /api/fish/feed-bulk
   * // Body: { fishIds: ["123", "456"], foodType: "premium" }
   * // Response: { success: true, data: { successful: ["123"], failed: ["456"] }, message: "Fed 1 fish successfully, 1 failed" }
   */
  static async feedMultipleFish(req, res) {
    try {
      const { fishIds, foodType = 'basic' } = req.body;

      const result = await FishService.feedMultipleFish(fishIds, foodType);

      res.json({
        success: true,
        data: result,
        message: `Fed ${result.successful.length} fish successfully, ${result.failed.length} failed`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'feedMultipleFish',
        error,
        {
          fishIds: req.body?.fishIds,
          foodType: req.body?.foodType,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Filter fish
   *
   * Retrieves fish matching the provided query parameters such as species, mood,
   * growth stage, or ownership. All filters are optional and combined with AND logic.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters used for filtering
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with filtered fish and count
   *
   * @example
   * // GET /api/fish?species=goldfish&mood=happy
   * // Response: { success: true, data: [...], count: 3 }
   */
  static async filterFish(req, res) {
    try {
      const filters = req.query;

      const filteredFish = await FishService.filterFish(filters);

      res.json({
        success: true,
        data: filteredFish,
        count: filteredFish.length,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'filterFish',
        error,
        {
          filters: req.query,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get fish needing attention
   *
   * Returns a list of a player's fish that require attention (e.g., low happiness,
   * hungry, or other maintenance conditions). Access is restricted to the
   * authenticated player.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with fish needing attention and count
   *
   * @example
   * // GET /api/players/123/fish/attention
   * // Response: { success: true, data: [...], count: 2 }
   */
  static async getFishNeedingAttention(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const fishNeedingAttention =
        await FishService.getFishNeedingAttention(playerId);

      res.json({
        success: true,
        data: fishNeedingAttention,
        count: fishNeedingAttention.length,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'getFishNeedingAttention',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update fish mood
   *
   * Updates the mood of a specific fish based on its current state
   * (e.g., hunger level, recent interactions). Returns 404 if fish is not found.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.fishId - Fish ID from URL
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with the updated fish
   *
   * @example
   * // PATCH /api/fish/123/mood
   * // Response: { success: true, data: { ... }, message: "Fish mood updated to happy" }
   */
  static async updateFishMood(req, res) {
    try {
      const { fishId } = req.params;

      const updatedFish = await FishService.updateFishMood(fishId);

      if (!updatedFish) {
        return res.status(404).json({ error: 'Fish not found' });
      }

      res.json({
        success: true,
        data: updatedFish,
        message: `Fish mood updated to ${updatedFish.mood}`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'updateFishMood',
        error,
        {
          fishId: req.params?.fishId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get global fish statistics
   *
   * Retrieves aggregated statistics across all fish in the system.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with global fish statistics
   *
   * @example
   * // GET /api/fish/stats
   * // Response: { success: true, data: { totalFish: 1200, avgHappiness: 76, ... } }
   */
  static async getGlobalFishStats(req, res) {
    try {
      const stats = await FishService.getFishStats(null);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'FishController',
        'getGlobalFishStats',
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
