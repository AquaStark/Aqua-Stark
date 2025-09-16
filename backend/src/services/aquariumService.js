import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

/**
 * Aquarium Service for managing aquarium states and operations
 *
 * This service handles all aquarium-related operations including state management,
 * environmental controls, fish capacity management, and health monitoring.
 * It uses Redis caching for performance optimization and Supabase for data persistence.
 *
 * @class AquariumService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */
export class AquariumService {
  /**
   * Get aquarium state from cache or database
   *
   * Retrieves the current state of an aquarium, including environmental conditions,
   * fish count, and other aquarium metrics. Uses Redis cache for performance,
   * falling back to database if cache miss occurs.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @returns {Promise<Object|null>} Aquarium state object or null if not found
   * @throws {Error} When database query fails or aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Get aquarium state
   * const aquariumState = await AquariumService.getAquariumState('aqua_123');
   * console.log(aquariumState.water_temperature); // 25.5
   * console.log(aquariumState.fish_count); // 3
   * ```
   */
  static async getAquariumState(aquariumId) {
    try {
      // Try to get from cache first
      const cachedState = await redisClient.get(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId)
      );
      if (cachedState) {
        return JSON.parse(cachedState);
      }

      // If not in cache, get from database
      const { data, error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .select('*')
        .eq('aquarium_id', aquariumId)
        .single();

      if (error) throw error;

      // Cache the result
      if (data) {
        await redisClient.setEx(
          CACHE_KEYS.AQUARIUM_STATE(aquariumId),
          CACHE_TTL.AQUARIUM_STATE,
          JSON.stringify(data)
        );
      }

      return data;
    } catch (error) {
      console.error('Error getting aquarium state:', error);
      throw error;
    }
  }

  /**
   * Update aquarium water temperature
   *
   * Sets the water temperature for an aquarium and updates the cache.
   * Temperature changes affect fish happiness and health.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @param {number} temperature - Temperature in Celsius (recommended: 20-30°C)
   * @returns {Promise<Object>} Updated aquarium state object
   * @throws {Error} When database update fails or aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Set optimal temperature for tropical fish
   * const updatedAquarium = await AquariumService.updateWaterTemperature('aqua_123', 26.5);
   * console.log(`Temperature set to ${updatedAquarium.water_temperature}°C`);
   * ```
   */
  static async updateWaterTemperature(aquariumId, temperature) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          water_temperature: temperature,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId),
        CACHE_TTL.AQUARIUM_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating water temperature:', error);
      throw error;
    }
  }

  /**
   * Update aquarium lighting level
   *
   * Adjusts the lighting intensity for an aquarium. Proper lighting is essential
   * for fish health and plant growth.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @param {number} lightingLevel - Lighting level (0-100, where 100 is maximum brightness)
   * @returns {Promise<Object>} Updated aquarium state object
   * @throws {Error} When database update fails or aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Set moderate lighting for the aquarium
   * const updatedAquarium = await AquariumService.updateLightingLevel('aqua_123', 75);
   * console.log(`Lighting set to ${updatedAquarium.lighting_level}%`);
   * ```
   */
  static async updateLightingLevel(aquariumId, lightingLevel) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          lighting_level: lightingLevel,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId),
        CACHE_TTL.AQUARIUM_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating lighting level:', error);
      throw error;
    }
  }

  /**
   * Clean aquarium and reduce pollution
   *
   * Performs a cleaning operation that reduces pollution level by 50 points.
   * Pollution affects fish health and overall aquarium environment.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @returns {Promise<Object>} Updated aquarium state object with reduced pollution
   * @throws {Error} When database update fails or aquarium ID is invalid
   *
   * @example
   * ```javascript
   * // Clean the aquarium
   * const cleanedAquarium = await AquariumService.cleanAquarium('aqua_123');
   * console.log(`Pollution reduced to ${cleanedAquarium.pollution_level}%`);
   * ```
   */
  static async cleanAquarium(aquariumId) {
    try {
      const currentState = await this.getAquariumState(aquariumId);
      const currentPollution = currentState?.pollution_level || 0;

      // Reduce pollution by cleaning
      const newPollution = Math.max(0, currentPollution - 50);

      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          pollution_level: newPollution,
          last_cleaned: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId),
        CACHE_TTL.AQUARIUM_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error cleaning aquarium:', error);
      throw error;
    }
  }

  /**
   * Get all aquariums for a player
   *
   * Retrieves all aquariums owned by a specific player, including their states.
   * Useful for displaying player's aquarium collection.
   *
   * @static
   * @async
   * @param {string} walletAddress - The player's wallet address
   * @returns {Promise<Array>} Array of aquarium objects with states
   * @throws {Error} When database query fails or wallet address is invalid
   *
   * @example
   * ```javascript
   * // Get all player aquariums
   * const aquariums = await AquariumService.getPlayerAquariums('0x123...');
   * console.log(`Player has ${aquariums.length} aquariums`);
   * aquariums.forEach(aqua => console.log(`Aquarium ${aqua.aquarium_id} has ${aqua.fish_count} fish`));
   * ```
   */
  static async getPlayerAquariums(walletAddress) {
    try {
      const { data, error } = await supabase
        .from(TABLES.AQUARIUM_NFTS)
        .select(
          `
          *,
          aquarium_states (*)
        `
        )
        .eq('owner_address', walletAddress);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting player aquariums:', error);
      throw error;
    }
  }

  /**
   * Add fish to aquarium
   *
   * Increments the fish count in an aquarium. Checks capacity limits before
   * adding to prevent overcrowding.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @param {string} _fishId - The fish ID (currently unused but reserved for future use)
   * @returns {Promise<Object>} Updated aquarium state object
   * @throws {Error} When aquarium is at maximum capacity or database update fails
   *
   * @example
   * ```javascript
   * // Add a fish to aquarium
   * const updatedAquarium = await AquariumService.addFishToAquarium('aqua_123', 'fish_456');
   * console.log(`Aquarium now has ${updatedAquarium.fish_count} fish`);
   * ```
   */
  static async addFishToAquarium(aquariumId, _fishId) {
    try {
      // Check aquarium capacity
      const aquarium = await this.getAquariumState(aquariumId);
      const currentFishCount = aquarium?.fish_count || 0;
      const maxCapacity = aquarium?.max_capacity || 10;

      if (currentFishCount >= maxCapacity) {
        throw new Error('Aquarium is at maximum capacity');
      }

      // Update fish count
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          fish_count: currentFishCount + 1,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId),
        CACHE_TTL.AQUARIUM_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error adding fish to aquarium:', error);
      throw error;
    }
  }

  /**
   * Remove fish from aquarium
   *
   * Decrements the fish count in an aquarium. Prevents negative fish counts.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @param {string} _fishId - The fish ID (currently unused but reserved for future use)
   * @returns {Promise<Object>} Updated aquarium state object
   * @throws {Error} When no fish to remove or database update fails
   *
   * @example
   * ```javascript
   * // Remove a fish from aquarium
   * const updatedAquarium = await AquariumService.removeFishFromAquarium('aqua_123', 'fish_456');
   * console.log(`Aquarium now has ${updatedAquarium.fish_count} fish`);
   * ```
   */
  static async removeFishFromAquarium(aquariumId, _fishId) {
    try {
      const aquarium = await this.getAquariumState(aquariumId);
      const currentFishCount = aquarium?.fish_count || 0;

      if (currentFishCount <= 0) {
        throw new Error('No fish in aquarium to remove');
      }

      // Update fish count
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          fish_count: currentFishCount - 1,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.AQUARIUM_STATE(aquariumId),
        CACHE_TTL.AQUARIUM_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error removing fish from aquarium:', error);
      throw error;
    }
  }

  /**
   * Get aquarium health score based on various factors
   *
   * Calculates a comprehensive health score (0-100) based on environmental
   * conditions including temperature, pollution, lighting, and fish capacity.
   *
   * @static
   * @async
   * @param {string} aquariumId - The unique identifier of the aquarium
   * @returns {Promise<number>} Health score between 0-100 (100 being perfect)
   *
   * @example
   * ```javascript
   * // Check aquarium health
   * const healthScore = await AquariumService.getAquariumHealthScore('aqua_123');
   * if (healthScore < 50) {
   *   console.log('Aquarium needs attention!');
   * }
   * ```
   */
  static async getAquariumHealthScore(aquariumId) {
    try {
      const state = await this.getAquariumState(aquariumId);
      if (!state) return 0;

      let score = 100;

      // Deduct points for poor conditions
      if (state.water_temperature < 20 || state.water_temperature > 30) {
        score -= 20;
      }
      if (state.pollution_level > 50) {
        score -= 30;
      }
      if (state.lighting_level < 30) {
        score -= 15;
      }
      if (state.fish_count > (state.max_capacity || 10)) {
        score -= 25;
      }

      return Math.max(0, score);
    } catch (error) {
      console.error('Error calculating aquarium health score:', error);
      return 0;
    }
  }
}
