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

      const dirtStatus = await DirtService.getAquariumDirtStatus(
        aquariumId,
        playerId
      );

      res.json({
        success: true,
        data: dirtStatus,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'getAquariumDirtStatus',
        error,
        {
          aquariumId: req.params?.aquariumId,
          playerId: req.user?.playerId || req.user?.id,
        }
      );

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
   * Clean aquarium dirt
   * POST /api/v1/dirt/aquarium/:aquariumId/clean
   */
  static async cleanAquarium(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';

      // Validate input
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }
      const cleaningResult = await DirtService.cleanAquarium(
        aquariumId,
        playerId
      );

      res.json({
        success: true,
        data: cleaningResult,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'cleanAquarium',
        error,
        {
          aquariumId: req.params?.aquariumId,
          playerId: req.user?.playerId || req.user?.id,
        }
      );

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
   * Get all aquarium dirt statuses for a player
   * GET /api/v1/dirt/player/:playerId/aquariums
   */
  static async getPlayerAquariumDirtStatuses(req, res) {
    try {
      const { playerId } = req.params;

      if (!playerId) {
        return res.status(400).json({
          success: false,
          error: 'Player ID is required',
        });
      }

      const dirtStatuses =
        await DirtService.getPlayerAquariumDirtStatuses(playerId);

      res.json({
        success: true,
        data: dirtStatuses,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'getPlayerAquariumDirtStatuses',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
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
      const { spotId } = req.body;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';
      // Validate required parameters
      if (!aquariumId || !spotId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID and spot ID are required',
        });
      }

      // Call the service to clean the dirt spot
      const cleaningResult = await DirtService.cleanDirtSpot(
        aquariumId,
        spotId,
        playerId
      );

      res.json({
        success: true,
        data: cleaningResult,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'cleanDirtSpot',
        error,
        {
          spotId: req.params?.spotId,
          playerId: req.user?.playerId || req.user?.id,
        }
      );

      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Initialize dirt system for aquarium
   * POST /api/v1/dirt/aquarium/:aquariumId/initialize
   */
  static async initializeAquariumDirtSystem(req, res) {
    try {
      const { aquariumId } = req.params;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';

      // Validate that aquariumId is present
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }
      const initResult = await DirtService.initializeAquariumDirtSystem(
        aquariumId,
        playerId
      );

      res.json({
        success: true,
        data: initResult,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'initializeAquariumDirtSystem',
        error,
        {
          aquariumId: req.params?.aquariumId,
          playerId: req.user?.playerId || req.user?.id,
        }
      );
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
      const config = req.body;
      const playerId = req.user?.playerId || req.user?.id || 'demo-player';

      // Validar que aquariumId esté presente
      if (!aquariumId) {
        return res.status(400).json({
          success: false,
          error: 'Aquarium ID is required',
        });
      }

      // Validar que config no esté vacío
      if (!config || Object.keys(config).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Configuration data is required',
        });
      }

      // Llamar al servicio para actualizar la configuración de dirt
      const updatedConfig = await DirtService.updateAquariumDirtConfig(
        aquariumId,
        config,
        playerId
      );

      res.json({
        success: true,
        data: {
          aquarium_id: aquariumId,
          updated_config: config,
          updated_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'updateAquariumDirtConfig',
        error,
        {
          aquariumId: req.params?.aquariumId,
          config: req.body,
          playerId: req.user?.playerId || req.user?.id,
        }
      );
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get player dirt statistics
   * GET /api/v1/dirt/player/:playerId/stats
   */
  static async getPlayerDirtStats(req, res) {
    try {
      const { playerId } = req.params;

      if (!playerId) {
        return res.status(400).json({
          success: false,
          error: 'Player ID is required',
        });
      }

      const stats = await DirtService.getPlayerDirtStats(playerId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DirtController',
        'getPlayerDirtStats',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
