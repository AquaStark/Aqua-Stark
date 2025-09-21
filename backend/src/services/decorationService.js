import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

/**
 * Decoration Service for managing decoration states and operations
 *
 * This service handles all decoration-related operations including placement,
 * positioning, visibility management, and movement between aquariums.
 * Decorations enhance the visual appeal and functionality of aquariums.
 *
 * @class DecorationService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */
export class DecorationService {
  /**
   * Get decoration state from cache or database
   *
   * Retrieves the current state of a decoration including its position,
   * visibility, and associated aquarium.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @returns {Promise<Object|null>} Decoration state object or null if not found
   * @throws {Error} When database query fails or decoration ID is invalid
   *
   * @example
   * ```javascript
   * // Get decoration state
   * const decoration = await DecorationService.getDecorationState('dec_123');
   * console.log(`Decoration is at position (${decoration.position_x}, ${decoration.position_y})`);
   * ```
   */
  static async getDecorationState(decorationId) {
    try {
      // Try to get from cache first
      const cachedState = await redisClient.get(
        CACHE_KEYS.DECORATION_STATE(decorationId)
      );
      if (cachedState) {
        return JSON.parse(cachedState);
      }

      // If not in cache, get from database
      const { data, error } = await supabase
        .from(TABLES.DECORATION_STATES)
        .select('*')
        .eq('decoration_id', decorationId)
        .single();

      if (error) throw error;

      // Cache the result
      if (data) {
        await redisClient.setEx(
          CACHE_KEYS.DECORATION_STATE(decorationId),
          CACHE_TTL.FISH_STATE, // Using same TTL as fish for now
          JSON.stringify(data)
        );
      }

      return data;
    } catch (error) {
      console.error('Error getting decoration state:', error);
      throw error;
    }
  }

  /**
   * Create new decoration state (called when decoration is created on-chain)
   *
   * Initializes a new decoration state in the database when a decoration
   * is minted or created on the blockchain.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @param {string} playerId - The ID of the player who owns the decoration
   * @param {string|null} [aquariumId=null] - Optional aquarium ID if decoration is placed immediately
   * @returns {Promise<Object>} Created decoration state object
   * @throws {Error} When database insert fails or decoration ID already exists
   *
   * @example
   * ```javascript
   * // Create decoration state for newly minted decoration
   * const decoration = await DecorationService.createDecorationState('dec_123', 'player_456');
   * console.log(`Decoration ${decoration.decoration_id} created for player`);
   * ```
   */
  static async createDecorationState(
    decorationId,
    playerId,
    aquariumId = null
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .insert({
          decoration_id: decorationId,
          player_id: playerId,
          aquarium_id: aquariumId,
          position_x: null,
          position_y: null,
          rotation_degrees: 0,
          is_visible: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Cache the new decoration state
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error creating decoration state:', error);
      throw error;
    }
  }

  /**
   * Get all decorations for a player
   *
   * Retrieves all decorations owned by a specific player, regardless of
   * their current placement status.
   *
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Array>} Array of decoration objects
   * @throws {Error} When database query fails or player ID is invalid
   *
   * @example
   * ```javascript
   * // Get all player decorations
   * const decorations = await DecorationService.getPlayerDecorations('player_123');
   * console.log(`Player has ${decorations.length} decorations`);
   * ```
   */
  static async getPlayerDecorations(playerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.DECORATION_STATES)
        .select('*')
        .eq('player_id', playerId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting player decorations:', error);
      throw error;
    }
  }

  /**
   * Get decorations in a specific aquarium
   *
   * Retrieves all visible decorations currently placed in a specific aquarium.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @returns {Promise<Array>} Array of visible decoration objects in the aquarium
   * @throws {Error} When database query fails or aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Get all decorations in aquarium
   * const decorations = await DecorationService.getAquariumDecorations('aqua_123');
   * console.log(`Aquarium has ${decorations.length} visible decorations`);
   * ```
   */
  static async getAquariumDecorations(aquariumId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.DECORATION_STATES)
        .select('*')
        .eq('aquarium_id', aquariumId)
        .eq('is_visible', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting aquarium decorations:', error);
      throw error;
    }
  }

  /**
   * Place decoration in aquarium
   *
   * Places a decoration at a specific position within an aquarium with
   * optional rotation.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @param {string} aquariumId - The unique identifier of the target aquarium
   * @param {number} positionX - X coordinate position (0-100)
   * @param {number} positionY - Y coordinate position (0-100)
   * @param {number} [rotationDegrees=0] - Rotation angle in degrees (0-360)
   * @returns {Promise<Object>} Updated decoration state object
   * @throws {Error} When database update fails or decoration/aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Place decoration in aquarium at specific position
   * const decoration = await DecorationService.placeDecoration('dec_123', 'aqua_456', 50, 30, 45);
   * console.log(`Decoration placed at (${decoration.position_x}, ${decoration.position_y})`);
   * ```
   */
  static async placeDecoration(
    decorationId,
    aquariumId,
    positionX,
    positionY,
    rotationDegrees = 0
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          aquarium_id: aquariumId,
          position_x: positionX,
          position_y: positionY,
          rotation_degrees: rotationDegrees,
          is_visible: true,
          last_updated: new Date().toISOString(),
        })
        .eq('decoration_id', decorationId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error placing decoration:', error);
      throw error;
    }
  }

  /**
   * Remove decoration from aquarium
   *
   * Removes a decoration from its current aquarium, making it unplaced
   * and invisible.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @returns {Promise<Object>} Updated decoration state object
   * @throws {Error} When database update fails or decoration ID is invalid
   *
   * @example
   * ```javascript
   * // Remove decoration from aquarium
   * const decoration = await DecorationService.removeDecoration('dec_123');
   * console.log('Decoration removed and stored in inventory');
   * ```
   */
  static async removeDecoration(decorationId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          aquarium_id: null,
          position_x: null,
          position_y: null,
          rotation_degrees: 0,
          is_visible: false,
          last_updated: new Date().toISOString(),
        })
        .eq('decoration_id', decorationId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error removing decoration:', error);
      throw error;
    }
  }

  /**
   * Update decoration position
   *
   * Updates the position and rotation of a decoration within its current aquarium.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @param {number} positionX - New X coordinate position (0-100)
   * @param {number} positionY - New Y coordinate position (0-100)
   * @param {number} rotationDegrees - New rotation angle in degrees (0-360)
   * @returns {Promise<Object>} Updated decoration state object
   * @throws {Error} When database update fails or decoration ID is invalid
   *
   * @example
   * ```javascript
   * // Move decoration to new position
   * const decoration = await DecorationService.updateDecorationPosition('dec_123', 75, 60, 90);
   * console.log(`Decoration moved to new position`);
   * ```
   */
  static async updateDecorationPosition(
    decorationId,
    positionX,
    positionY,
    rotationDegrees
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          position_x: positionX,
          position_y: positionY,
          rotation_degrees: rotationDegrees,
          last_updated: new Date().toISOString(),
        })
        .eq('decoration_id', decorationId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating decoration position:', error);
      throw error;
    }
  }

  /**
   * Toggle decoration visibility
   *
   * Toggles the visibility state of a decoration between visible and hidden.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @returns {Promise<Object>} Updated decoration state object
   * @throws {Error} When decoration not found or database update fails
   *
   * @example
   * ```javascript
   * // Toggle decoration visibility
   * const decoration = await DecorationService.toggleDecorationVisibility('dec_123');
   * console.log(`Decoration is now ${decoration.is_visible ? 'visible' : 'hidden'}`);
   * ```
   */
  static async toggleDecorationVisibility(decorationId) {
    try {
      const currentState = await this.getDecorationState(decorationId);
      if (!currentState) {
        throw new Error('Decoration not found');
      }

      const newVisibility = !currentState.is_visible;

      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          is_visible: newVisibility,
          last_updated: new Date().toISOString(),
        })
        .eq('decoration_id', decorationId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error toggling decoration visibility:', error);
      throw error;
    }
  }

  /**
   * Move decoration between aquariums
   *
   * Moves a decoration from one aquarium to another, resetting its position
   * in the new aquarium.
   *
   * @static
   * @async
   * @param {string} decorationId - The unique identifier of the decoration
   * @param {string} fromAquariumId - The unique identifier of the source aquarium
   * @param {string} toAquariumId - The unique identifier of the destination aquarium
   * @returns {Promise<Object>} Updated decoration state object
   * @throws {Error} When database update fails or aquarium/decoration ID is invalid
   *
   * @example
   * ```javascript
   * // Move decoration between aquariums
   * const decoration = await DecorationService.moveDecoration('dec_123', 'aqua_456', 'aqua_789');
   * console.log(`Decoration moved to aquarium ${decoration.aquarium_id}`);
   * ```
   */
  static async moveDecoration(decorationId, fromAquariumId, toAquariumId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          aquarium_id: toAquariumId,
          position_x: null, // Reset position for new aquarium
          position_y: null,
          rotation_degrees: 0,
          last_updated: new Date().toISOString(),
        })
        .eq('decoration_id', decorationId)
        .eq('aquarium_id', fromAquariumId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.DECORATION_STATE(decorationId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error moving decoration:', error);
      throw error;
    }
  }

  /**
   * Get decoration statistics for a player
   *
   * Calculates comprehensive decoration statistics including total count,
   * placement status, and visibility metrics.
   *
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Object>} Statistics object with decoration metrics
   * @throws {Error} When database query fails or player ID is invalid
   *
   * @example
   * ```javascript
   * // Get player decoration statistics
   * const stats = await DecorationService.getPlayerDecorationStats('player_123');
   * console.log(`Player has ${stats.total_decorations} decorations`);
   * console.log(`${stats.placed_decorations} are currently placed`);
   * ```
   */
  static async getPlayerDecorationStats(playerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.DECORATION_STATES)
        .select('aquarium_id, is_visible')
        .eq('player_id', playerId);

      if (error) throw error;

      const stats = {
        total_decorations: data.length,
        placed_decorations: data.filter(d => d.aquarium_id !== null).length,
        visible_decorations: data.filter(d => d.is_visible).length,
        unplaced_decorations: data.filter(d => d.aquarium_id === null).length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting decoration stats:', error);
      throw error;
    }
  }
}
