import { DecorationService } from '../services/decorationService.js';
import { loggingMiddleware } from '../middleware/logging.js';

/**
 * Decoration Controller
 *
 * Handles HTTP requests related to aquarium decoration operations including
 * state management, placement, positioning, visibility, and bulk operations.
 *
 * All methods follow a consistent response format:
 * - Success: { success: true, data: result, message?: string }
 * - Error: { error: string }
 *
 * @class DecorationController
 */
export class DecorationController {
  /**
   * Get decoration state
   *
   * Retrieves the current state of a specific decoration.
   * The resource is pre-validated by ownership middleware.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.resource - Pre-validated decoration resource from middleware
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with decoration state data
   *
   * @example
   * // GET /api/decorations/123/state
   * // Response: { success: true, data: { decorationId: "123", positionX: 100, ... } }
   */
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

  /**
   * Create new decoration state
   *
   * Creates a new decoration state for a player, optionally associating it with an aquarium.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.decorationId - Unique decoration identifier
   * @param {string} [req.body.aquariumId] - Optional aquarium ID to associate with
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with created decoration data
   *
   * @example
   * // POST /api/decorations
   * // Body: { decorationId: "123", aquariumId: "456" }
   * // Response: { success: true, data: { ... }, message: "Decoration state created successfully" }
   */
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

  /**
   * Get all decorations for a player
   *
   * Retrieves all decorations belonging to a specific player.
   * Players can only access their own decorations.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with array of player's decorations
   *
   * @example
   * // GET /api/players/123/decorations
   * // Response: { success: true, data: [{ decorationId: "456", type: "plant", ... }, ...] }
   */
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

  /**
   * Get decorations in a specific aquarium
   *
   * Retrieves all decorations currently placed in a specific aquarium.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.aquariumId - Aquarium ID from URL
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with array of aquarium decorations
   *
   * @example
   * // GET /api/aquariums/456/decorations
   * // Response: { success: true, data: [{ decorationId: "123", positionX: 100, ... }, ...] }
   */
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

  /**
   * Place decoration in aquarium
   *
   * Places a decoration at a specific position in an aquarium with optional rotation.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.decorationId - Decoration ID from URL
   * @param {Object} req.body - Request body
   * @param {string} req.body.aquariumId - Aquarium ID to place decoration in
   * @param {number} req.body.positionX - X coordinate position
   * @param {number} req.body.positionY - Y coordinate position
   * @param {number} [req.body.rotationDegrees=0] - Rotation angle in degrees
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with placed decoration data
   *
   * @example
   * // PUT /api/decorations/123/place
   * // Body: { aquariumId: "456", positionX: 100, positionY: 200, rotationDegrees: 45 }
   * // Response: { success: true, data: { ... }, message: "Decoration placed successfully" }
   */
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

  /**
   * Remove decoration from aquarium
   *
   * Removes a decoration from its current aquarium placement.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.decorationId - Decoration ID from URL
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with removed decoration data
   *
   * @example
   * // DELETE /api/decorations/123
   * // Response: { success: true, data: { ... }, message: "Decoration removed successfully" }
   */
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

  /**
   * Update decoration position
   *
   * Updates the position and rotation of a decoration within its aquarium.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.decorationId - Decoration ID from URL
   * @param {Object} req.body - Request body
   * @param {number} req.body.positionX - New X coordinate position
   * @param {number} req.body.positionY - New Y coordinate position
   * @param {number} [req.body.rotationDegrees=0] - New rotation angle in degrees
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated decoration data
   *
   * @example
   * // PUT /api/decorations/123/position
   * // Body: { positionX: 150, positionY: 250, rotationDegrees: 90 }
   * // Response: { success: true, data: { ... }, message: "Decoration position updated successfully" }
   */
  static async updateDecorationPosition(req, res) {
    try {
      const { decorationId } = req.params;
      const { position } = req.body;

      // Validate that position and its x and y coordinates exist
      if (
        !position ||
        typeof position.x !== 'number' ||
        typeof position.y !== 'number'
      ) {
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

  /**
   * Toggle decoration visibility
   *
   * Toggles the visibility state of a decoration (show/hide).
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.decorationId - Decoration ID from URL
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated decoration data
   *
   * @example
   * // PUT /api/decorations/123/visibility
   * // Response: { success: true, data: { ... }, message: "Decoration visibility enabled" }
   */
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

  /**
   * Move decoration between aquariums
   *
   * Moves a decoration from one aquarium to another.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.decorationId - Decoration ID from URL
   * @param {Object} req.body - Request body
   * @param {string} req.body.fromAquariumId - Source aquarium ID
   * @param {string} req.body.toAquariumId - Destination aquarium ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with moved decoration data
   *
   * @example
   * // PUT /api/decorations/123/move
   * // Body: { fromAquariumId: "456", toAquariumId: "789" }
   * // Response: { success: true, data: { ... }, message: "Decoration moved successfully" }
   */
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

  /**
   * Get decoration statistics for a player
   *
   * Retrieves aggregated statistics about a player's decorations.
   * Players can only access their own decoration statistics.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.playerId - Player ID from URL
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with decoration statistics
   *
   * @example
   * // GET /api/players/123/decorations/stats
   * // Response: { success: true, data: { totalDecorations: 15, byType: {...}, ... } }
   */
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

  /**
   * Bulk update decoration positions
   *
   * Updates positions for multiple decorations in a single request.
   * Useful for drag-and-drop operations. Validates ownership of all decorations.
   *
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {Array} req.body.decorations - Array of decoration updates
   * @param {string} req.body.decorations[].decorationId - Decoration ID
   * @param {number} req.body.decorations[].positionX - New X position
   * @param {number} req.body.decorations[].positionY - New Y position
   * @param {number} [req.body.decorations[].rotationDegrees=0] - New rotation
   * @param {Object} req.user - Authenticated user data
   * @param {string} req.user.playerId - Authenticated player's ID
   * @param {Object} res - Express response object
   * @returns {Promise<void>} JSON response with updated decorations array
   *
   * @example
   * // PUT /api/decorations/bulk-update
   * // Body: { decorations: [
   * //   { decorationId: "123", positionX: 100, positionY: 200 },
   * //   { decorationId: "456", positionX: 150, positionY: 250, rotationDegrees: 45 }
   * // ]}
   * // Response: { success: true, data: [...], message: "2 decorations updated successfully" }
   */
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
