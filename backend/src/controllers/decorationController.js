import { DecorationService } from '../services/decorationService.js';
import { loggingMiddleware } from '../middleware/logging.js';

// Decoration controller for handling HTTP requests related to decoration operations
export class DecorationController {
  // Get decoration state
  static async getDecorationState(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const decorationState = req.resource;

      res.json({ success: true, data: decorationState });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'getDecorationState',
        error,
        {
          decorationId: req.params?.decorationId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new decoration state
  static async createDecorationState(req, res) {
    try {
      const { decorationId, aquariumId } = req.body;
      const { playerId } = req.user;

      const newDecoration = await DecorationService.createDecorationState(
        decorationId,
        playerId,
        aquariumId
      );

      res.status(201).json({
        success: true,
        data: newDecoration,
        message: 'Decoration state created successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'createDecorationState',
        error,
        {
          decorationId: req.body?.decorationId,
          aquariumId: req.body?.aquariumId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all decorations for a player
  static async getPlayerDecorations(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own decorations
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const decorations =
        await DecorationService.getPlayerDecorations(playerId);

      res.json({ success: true, data: decorations });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'getPlayerDecorations',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get decorations for a specific aquarium
  static async getAquariumDecorations(req, res) {
    try {
      const { aquariumId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own aquarium decorations
      // You must implement logic to verify that the aquarium belongs to the authenticated player
      // This is a placeholder; replace with actual ownership check as needed
      // Example: if (!await AquariumService.isOwnedByPlayer(aquariumId, authenticatedPlayerId)) { ... }
      // For now, just allow access (remove this comment and add real check later)
      const decorations =
        await DecorationService.getAquariumDecorations(aquariumId);

      res.json({ success: true, data: decorations });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'getAquariumDecorations',
        error,
        {
          aquariumId: req.params?.aquariumId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Place decoration in aquarium
  static async placeDecoration(req, res) {
    try {
      const { decorationId } = req.params;
      const { position } = req.body;

      // Validate that position and its x, y coordinates are provided
      if (!position || !position.x || !position.y) {
        return res.status(400).json({
          error: 'Position with x and y coordinates is required',
        });
      }

      // Place the decoration using the provided decorationId and position
      const updatedDecoration = await DecorationService.placeDecoration(
        decorationId,
        position
      );
        decorationId,
        position
      );

      res.json({
        success: true,
        data: updatedDecoration,
        message: 'Decoration placed successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'placeDecoration',
        error,
        {
          decorationId: req.params?.decorationId,
          position: req.body?.position,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remove decoration from aquarium
  static async removeDecoration(req, res) {
    try {
      const { decorationId } = req.params;

      const result = await DecorationService.removeDecoration(decorationId);

      res.json({
        success: true,
        data: result,
        message: 'Decoration removed successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'removeDecoration',
        error,
        {
          decorationId: req.params?.decorationId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update decoration position
  static async updateDecorationPosition(req, res) {
    try {
      const { decorationId } = req.params;
      const { position } = req.body;

      // Validate that position and its x and y coordinates exist
      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return res.status(400).json({
          error: 'Position with x and y coordinates is required',
        });
      }
      const updatedDecoration =
        await DecorationService.updateDecorationPosition(
          decorationId,
          position
        );

      res.json({
        success: true,
        data: updatedDecoration,
        message: 'Decoration position updated successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'updateDecorationPosition',
        error,
        {
          decorationId: req.params?.decorationId,
          position: req.body?.position,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Toggle decoration visibility
  static async toggleDecorationVisibility(req, res) {
    try {
      const { decorationId } = req.params;

      const updatedDecoration =
        await DecorationService.toggleDecorationVisibility(decorationId);

      res.json({
        success: true,
        data: updatedDecoration,
        message: `Decoration visibility toggled to ${
          updatedDecoration.visible ? 'visible' : 'hidden'
        }`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'toggleDecorationVisibility',
        error,
        {
          decorationId: req.params?.decorationId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Move decoration to new position
  static async moveDecoration(req, res) {
    try {
      const { decorationId } = req.params;
      const { newPosition } = req.body;

      // Validate that newPosition and its coordinates exist
      if (!newPosition || !newPosition.x || !newPosition.y) {
        return res.status(400).json({
          error: 'New position with x and y coordinates is required',
        });
      }

      // Move the decoration to the new position
      const updatedDecoration = await DecorationService.moveDecoration(
        decorationId,
        newPosition
      );
        decorationId,
        newPosition
      );

      res.json({
        success: true,
        data: updatedDecoration,
        message: 'Decoration moved successfully',
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'moveDecoration',
        error,
        {
          decorationId: req.params?.decorationId,
          newPosition: req.body?.newPosition,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get player decoration statistics
  static async getPlayerDecorationStats(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own stats
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const stats = await DecorationService.getPlayerDecorationStats(playerId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'getPlayerDecorationStats',
        error,
        {
          playerId: req.params?.playerId,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Bulk update decoration positions
  static async bulkUpdatePositions(req, res) {
    try {
      const { updates } = req.body;

      // Validar que updates sea un array no vacío
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          error: 'Updates array is required and must not be empty',
        });
      }

      // Validar cada update
      for (const update of updates) {
        if (!update.decorationId || !update.position) {
          return res.status(400).json({
            error: 'Each update must have decorationId and position',
          });
        }
      }

      // Validar que todas las decoraciones pertenezcan al jugador autenticado
      const { playerId } = req.user;
      for (const update of updates) {
        const decorationState = await DecorationService.getDecorationState(
          update.decorationId
        );
        if (!decorationState || decorationState.player_id !== playerId) {
          return res.status(403).json({
            error: 'Access denied',
            message: `Decoration ${update.decorationId} does not belong to you`,
          });
        }
      }
          });
        }
      }

      const results = await DecorationService.bulkUpdatePositions(updates);

      res.json({
        success: true,
        data: results,
        message: `Updated ${results.length} decorations successfully`,
      });
    } catch (error) {
      loggingMiddleware.logControllerError(
        'DecorationController',
        'bulkUpdatePositions',
        error,
        {
          updates: req.body?.updates,
        }
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
