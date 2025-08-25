import { DecorationService } from '../services/decorationService.js';

// Decoration controller for handling HTTP requests related to decoration operations
export class DecorationController {
  // Get decoration state
  static async getDecorationState(req, res) {
    try {
      // Resource is already validated by ownership middleware
      const decorationState = req.resource;

      res.json({ success: true, data: decorationState });
    } catch (error) {
      console.error('Error in getDecorationState:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new decoration state
  static async createDecorationState(req, res) {
    try {
      const { decorationId, aquariumId } = req.body;
      const { playerId } = req.user;

      if (!decorationId) {
        return res.status(400).json({ error: 'Decoration ID is required' });
      }

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
      console.error('Error in createDecorationState:', error);
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
      console.error('Error in getPlayerDecorations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get decorations in a specific aquarium
  static async getAquariumDecorations(req, res) {
    try {
      const { aquariumId } = req.params;

      if (!aquariumId) {
        return res.status(400).json({ error: 'Aquarium ID is required' });
      }

      const decorations =
        await DecorationService.getAquariumDecorations(aquariumId);

      res.json({ success: true, data: decorations });
    } catch (error) {
      console.error('Error in getAquariumDecorations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Place decoration in aquarium
  static async placeDecoration(req, res) {
    try {
      const { decorationId } = req.params;
      const {
        aquariumId,
        positionX,
        positionY,
        rotationDegrees = 0,
      } = req.body;

      if (!aquariumId || positionX === undefined || positionY === undefined) {
        return res
          .status(400)
          .json({ error: 'Aquarium ID and position are required' });
      }

      const placedDecoration = await DecorationService.placeDecoration(
        decorationId,
        aquariumId,
        positionX,
        positionY,
        rotationDegrees
      );

      res.json({
        success: true,
        data: placedDecoration,
        message: 'Decoration placed successfully',
      });
    } catch (error) {
      console.error('Error in placeDecoration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remove decoration from aquarium
  static async removeDecoration(req, res) {
    try {
      const { decorationId } = req.params;

      const removedDecoration =
        await DecorationService.removeDecoration(decorationId);

      res.json({
        success: true,
        data: removedDecoration,
        message: 'Decoration removed successfully',
      });
    } catch (error) {
      console.error('Error in removeDecoration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update decoration position
  static async updateDecorationPosition(req, res) {
    try {
      const { decorationId } = req.params;
      const { positionX, positionY, rotationDegrees = 0 } = req.body;

      if (positionX === undefined || positionY === undefined) {
        return res
          .status(400)
          .json({ error: 'Position coordinates are required' });
      }

      const updatedDecoration =
        await DecorationService.updateDecorationPosition(
          decorationId,
          positionX,
          positionY,
          rotationDegrees
        );

      res.json({
        success: true,
        data: updatedDecoration,
        message: 'Decoration position updated successfully',
      });
    } catch (error) {
      console.error('Error in updateDecorationPosition:', error);
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
        message: `Decoration visibility ${updatedDecoration.is_visible ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error in toggleDecorationVisibility:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Move decoration between aquariums
  static async moveDecoration(req, res) {
    try {
      const { decorationId } = req.params;
      const { fromAquariumId, toAquariumId } = req.body;

      if (!fromAquariumId || !toAquariumId) {
        return res
          .status(400)
          .json({ error: 'From aquarium ID and to aquarium ID are required' });
      }

      const movedDecoration = await DecorationService.moveDecoration(
        decorationId,
        fromAquariumId,
        toAquariumId
      );

      res.json({
        success: true,
        data: movedDecoration,
        message: 'Decoration moved successfully',
      });
    } catch (error) {
      console.error('Error in moveDecoration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get decoration statistics for a player
  static async getPlayerDecorationStats(req, res) {
    try {
      const { playerId } = req.params;
      const { playerId: authenticatedPlayerId } = req.user;

      // Ensure player can only access their own decoration stats
      if (playerId !== authenticatedPlayerId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const stats = await DecorationService.getPlayerDecorationStats(playerId);

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error('Error in getPlayerDecorationStats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Bulk update decoration positions (for drag & drop)
  static async bulkUpdatePositions(req, res) {
    try {
      const { decorations } = req.body;
      const { playerId } = req.user;

      if (!decorations || !Array.isArray(decorations)) {
        return res.status(400).json({ error: 'Decorations array is required' });
      }

      // Validate that all decorations belong to the authenticated player
      for (const decoration of decorations) {
        const decorationState = await DecorationService.getDecorationState(
          decoration.decorationId
        );
        if (!decorationState || decorationState.player_id !== playerId) {
          return res.status(403).json({
            error: 'Access denied',
            message: `Decoration ${decoration.decorationId} does not belong to you`,
          });
        }
      }

      const updatePromises = decorations.map(decoration =>
        DecorationService.updateDecorationPosition(
          decoration.decorationId,
          decoration.positionX,
          decoration.positionY,
          decoration.rotationDegrees || 0
        )
      );

      const updatedDecorations = await Promise.all(updatePromises);

      res.json({
        success: true,
        data: updatedDecorations,
        message: `${updatedDecorations.length} decorations updated successfully`,
      });
    } catch (error) {
      console.error('Error in bulkUpdatePositions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
