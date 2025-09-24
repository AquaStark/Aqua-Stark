import { DirtService } from '../services/dirtService.js';
import { loggingMiddleware } from '../middleware/logging.js';

/**
 * DirtController - Handles HTTP requests for aquarium dirt/cleanliness system
 */
export class DirtController {
  /**
   * Get aquarium dirt status
   * GET /api/v1/dirt/aquarium/:aquariumId
   */
  static async getAquariumDirtStatus(req, res) {
    try {
      const { aquariumId } = req.params;
      // Use playerId from user if available, otherwise use demo player for development
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      const dirtStatus = await DirtService.getAquariumDirtStatus(
        aquariumId,
        playerId
      );

      res.json({
        success: true,
        data: dirtStatus,
      });
    } catch (error) {
      console.error('Error in getAquariumDirtStatus:', error);

      if (error.message === 'Aquarium not found or access denied') {
        return res.status(404).json({
          success: false,
          error: 'Aquarium not found or access denied',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Clean aquarium (partial or complete)
   * POST /api/v1/dirt/aquarium/:aquariumId/clean
   */
  static async cleanAquarium(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';
      const { cleaning_type = 'partial' } = req.body;

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      if (!['partial', 'complete'].includes(cleaning_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid cleaning type. Must be "partial" or "complete"',
        });
      }

      const cleaningResult = await DirtService.cleanAquarium(
        aquariumId,
        playerId,
        cleaning_type
      );

      if (!cleaningResult.success) {
        return res.status(400).json({
          success: false,
          error: cleaningResult.error,
        });
      }

      res.json({
        success: true,
        data: cleaningResult,
      });
    } catch (error) {
      console.error('Error in cleanAquarium:', error);

      if (error.message === 'Aquarium not found or access denied') {
        return res.status(404).json({
          success: false,
          error: 'Aquarium not found or access denied',
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get all player's aquarium dirt statuses
   * GET /api/v1/dirt/player/:playerId/aquariums
   */
  static async getPlayerAquariumDirtStatuses(req, res) {
    try {
      const { playerId } = req.params;
      const authenticatedPlayerId =
        req.user?.playerId || req.user?.id || 'demo-player';

      // Ensure player can only access their own data (skip in development)
      if (
        process.env.NODE_ENV === 'production' &&
        playerId !== authenticatedPlayerId
      ) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      const dirtStatuses =
        await DirtService.getPlayerAquariumDirtStatuses(playerId);

      res.json({
        success: true,
        data: dirtStatuses,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('DirtController', 'getPlayerAquariumDirtStatuses', error, {
        playerId: req.params?.playerId
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Clean individual dirt spot
   * POST /api/v1/dirt/aquarium/:aquariumId/clean-spot
   */
  static async cleanDirtSpot(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';
      const { spot_id } = req.body;

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      if (!spot_id) {
        return res.status(400).json({
          success: false,
          error: 'Spot ID is required',
        });
      }

      // For now, just clean a small amount of dirt
      const cleaningResult = await DirtService.cleanAquarium(
        aquariumId,
        playerId,
        'partial'
      );

      res.json({
        success: true,
        data: cleaningResult,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('DirtController', 'cleanDirtSpot', error, {
        spotId: req.params?.spotId,
        playerId: req.user?.playerId || req.user?.id
      });

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Initialize dirt system for new aquarium
   * POST /api/v1/dirt/aquarium/:aquariumId/initialize
   */
  static async initializeAquariumDirtSystem(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';
      const { config } = req.body;

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      const initResult = await DirtService.initializeAquariumDirtSystem(
        aquariumId,
        playerId,
        config
      );

      res.json({
        success: true,
        data: initResult,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('DirtController', 'initializeAquariumDirtSystem', error, {
        aquariumId: req.params?.aquariumId,
        playerId: req.user?.playerId || req.user?.id
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Update aquarium dirt configuration
   * PUT /api/v1/dirt/aquarium/:aquariumId/config
   */
  static async updateAquariumDirtConfig(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';
      const { config } = req.body;

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      if (!config || typeof config !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Valid configuration object is required',
        });
      }

      // Validate config fields
      const validFields = [
        'grace_period_hours',
        'dirt_multiplier',
        'max_dirt_level',
        'log_base',
        'cleaning_threshold',
      ];

      const invalidFields = Object.keys(config).filter(
        key => !validFields.includes(key)
      );

      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Invalid configuration fields: ${invalidFields.join(', ')}`,
        });
      }

      // Update configuration in database
      const { supabase, TABLES } = await import('../config/supabase.js');
      const { error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .update({
          dirt_config: config,
          last_updated: new Date().toISOString(),
        })
        .eq('aquarium_id', aquariumId)
        .eq('player_id', playerId);

      if (error) throw error;

      res.json({
        success: true,
        data: {
          aquarium_id: aquariumId,
          updated_config: config,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      loggingMiddleware.logControllerError('DirtController', 'updateAquariumDirtConfig', error, {
        aquariumId: req.params?.aquariumId,
        config: req.body,
        playerId: req.user?.playerId || req.user?.id
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get dirt system statistics for player
   * GET /api/v1/dirt/player/:playerId/stats
   */
  static async getPlayerDirtStats(req, res) {
    try {
      const { playerId } = req.params;
      const authenticatedPlayerId =
        req.user?.playerId || req.user?.id || 'demo-player';

      // Ensure player can only access their own data (skip in development)
      if (
        process.env.NODE_ENV === 'production' &&
        playerId !== authenticatedPlayerId
      ) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
        });
      }

      const dirtStatuses =
        await DirtService.getPlayerAquariumDirtStatuses(playerId);

      // Calculate statistics
      const stats = {
        total_aquariums: dirtStatuses.length,
        dirty_aquariums: dirtStatuses.filter(a => a.current_dirt_level > 10)
          .length,
        needs_cleaning: dirtStatuses.filter(a => a.current_dirt_level > 30)
          .length,
        average_dirt_level:
          dirtStatuses.length > 0
            ? dirtStatuses.reduce((sum, a) => sum + a.current_dirt_level, 0) /
              dirtStatuses.length
            : 0,
        total_cleanings: dirtStatuses.reduce(
          (sum, a) => sum + a.total_cleanings,
          0
        ),
        longest_cleaning_streak:
          dirtStatuses.length > 0
            ? Math.max(...dirtStatuses.map(a => a.cleaning_streak))
            : 0,
        dirt_distribution: {
          clean: dirtStatuses.filter(a => a.current_dirt_level <= 10).length,
          light: dirtStatuses.filter(
            a => a.current_dirt_level > 10 && a.current_dirt_level <= 30
          ).length,
          moderate: dirtStatuses.filter(
            a => a.current_dirt_level > 30 && a.current_dirt_level <= 50
          ).length,
          high: dirtStatuses.filter(
            a => a.current_dirt_level > 50 && a.current_dirt_level <= 70
          ).length,
          critical: dirtStatuses.filter(a => a.current_dirt_level > 70).length,
        },
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      loggingMiddleware.logControllerError('DirtController', 'getPlayerDirtStats', error, {
        playerId: req.params?.playerId
      });
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
