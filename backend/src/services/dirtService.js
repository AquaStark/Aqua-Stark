import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

/**
 * DirtService - Handles aquarium cleanliness and dirt system operations
 * Implements realistic dirt accumulation based on time offline
 */
export class DirtService {
  // Default dirt system configuration (PRODUCTION)
  static DEFAULT_CONFIG = {
    grace_period_hours: 4, // 4 hours grace period
    dirt_multiplier: 30,
    max_dirt_level: 95,
    log_base: 10,
    cleaning_threshold: 10,
  };

  /**
   * Get aquarium dirt status
   * @param {string} aquariumId - Aquarium ID
   * @param {string} playerId - Player ID for ownership validation
   * @returns {Object} Dirt status information
   */
  static async getAquariumDirtStatus(aquariumId, playerId) {
    try {
      // Try cache first
      const cacheKey = CACHE_KEYS.AQUARIUM_DIRT(aquariumId);
      const cachedStatus = await redisClient.get(cacheKey);
      if (cachedStatus) {
        return JSON.parse(cachedStatus);
      }

      // Get aquarium state from database
      const { data, error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .select(
          `
          aquarium_id,
          player_id,
          last_cleaning_time,
          dirt_level,
          partial_dirt_level,
          cleaning_streak,
          total_cleanings,
          dirt_config
        `
        )
        .eq('aquarium_id', aquariumId)
        .eq('player_id', playerId)
        .single();

      if (error) throw error;
      if (!data) {
        throw new Error('Aquarium not found or access denied');
      }

      // Calculate current dirt level based on time
      const currentDirtLevel = await this.calculateCurrentDirtLevel(
        data.last_cleaning_time,
        data.dirt_config
      );

      // Update dirt level if it has changed
      if (Math.abs(currentDirtLevel - data.dirt_level) > 0.1) {
        await this.updateAquariumDirtLevel(aquariumId, currentDirtLevel);
        data.dirt_level = currentDirtLevel;
        data.partial_dirt_level = currentDirtLevel;
      }

      const dirtStatus = {
        aquarium_id: data.aquarium_id,
        current_dirt_level: currentDirtLevel,
        partial_dirt_level: data.partial_dirt_level,
        last_cleaning_time: data.last_cleaning_time,
        cleaning_streak: data.cleaning_streak,
        total_cleanings: data.total_cleanings,
        hours_since_cleaning: this.calculateHoursSinceCleaning(
          data.last_cleaning_time
        ),
        dirt_config: data.dirt_config,
        is_dirty: currentDirtLevel > 10,
        needs_cleaning: currentDirtLevel > 30,
        cleanliness_status: this.getCleanlinessStatus(currentDirtLevel),
      };

      // Cache the result for 5 minutes
      await redisClient.setEx(
        cacheKey,
        300, // 5 minutes
        JSON.stringify(dirtStatus)
      );

      return dirtStatus;
    } catch (error) {
      console.error('Error getting aquarium dirt status:', error);
      throw error;
    }
  }

  /**
   * Calculate current dirt level based on time since last cleaning
   * @param {string} lastCleaningTime - ISO timestamp of last cleaning
   * @param {Object} config - Dirt system configuration
   * @returns {number} Current dirt level (0-100)
   */
  static async calculateCurrentDirtLevel(lastCleaningTime, config = null) {
    try {
      const dirtConfig = config || this.DEFAULT_CONFIG;

      // Use the database function for calculation
      const { data, error } = await supabaseAdmin.rpc('calculate_dirt_level', {
        last_cleaning_time: lastCleaningTime,
        config: dirtConfig,
      });

      if (error) throw error;
      return parseFloat(data) || 0;
    } catch (error) {
      console.error('Error calculating dirt level:', error);
      // Fallback calculation
      return this.fallbackDirtCalculation(lastCleaningTime, config);
    }
  }

  /**
   * Fallback dirt calculation (client-side)
   * @param {string} lastCleaningTime - ISO timestamp of last cleaning
   * @param {Object} config - Dirt system configuration
   * @returns {number} Calculated dirt level
   */
  static fallbackDirtCalculation(lastCleaningTime, config = null) {
    const dirtConfig = { ...this.DEFAULT_CONFIG, ...config };
    const now = new Date();
    const lastCleaning = new Date(lastCleaningTime);
    // PRODUCTION: Using hours
    const hoursSinceCleaning = (now - lastCleaning) / (1000 * 60 * 60);

    // Grace period (in hours)
    if (hoursSinceCleaning <= dirtConfig.grace_period_hours) {
      return 0;
    }

    // Logarithmic calculation
    const adjustedHours =
      hoursSinceCleaning - dirtConfig.grace_period_hours;
    const logValue = Math.log10(adjustedHours / 2 + 1);
    const calculatedDirt = dirtConfig.dirt_multiplier * logValue;

    return Math.min(dirtConfig.max_dirt_level, Math.max(0, calculatedDirt));
  }

  /**
   * Calculate hours since last cleaning (PRODUCTION)
   * @param {string} lastCleaningTime - ISO timestamp
   * @returns {number} Hours since cleaning
   */
  static calculateHoursSinceCleaning(lastCleaningTime) {
    const now = new Date();
    const lastCleaning = new Date(lastCleaningTime);
    // PRODUCTION: Return hours
    return (now - lastCleaning) / (1000 * 60 * 60);
  }

  /**
   * Get cleanliness status description
   * @param {number} dirtLevel - Current dirt level (0-100)
   * @returns {Object} Status information
   */
  static getCleanlinessStatus(dirtLevel) {
    if (dirtLevel >= 90)
      return { level: 'critical', label: 'Very Dirty', color: 'red' };
    if (dirtLevel >= 70)
      return { level: 'high', label: 'Dirty', color: 'orange' };
    if (dirtLevel >= 50)
      return { level: 'moderate', label: 'Needs Attention', color: 'yellow' };
    if (dirtLevel >= 30)
      return { level: 'light', label: 'Slightly Dirty', color: 'light-yellow' };
    if (dirtLevel >= 10)
      return { level: 'minimal', label: 'Almost Clean', color: 'light-green' };
    return { level: 'clean', label: 'Clean', color: 'green' };
  }

  /**
   * Clean aquarium (partial or complete)
   * @param {string} aquariumId - Aquarium ID
   * @param {string} playerId - Player ID
   * @param {string} cleaningType - 'partial' or 'complete'
   * @returns {Object} Cleaning result
   */
  static async cleanAquarium(aquariumId, playerId, cleaningType = 'partial') {
    try {
      // Validate ownership
      const { data: aquarium, error: fetchError } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .select('aquarium_id, player_id')
        .eq('aquarium_id', aquariumId)
        .eq('player_id', playerId)
        .single();

      if (fetchError || !aquarium) {
        throw new Error('Aquarium not found or access denied');
      }

      // Use database function for cleaning
      const { data, error } = await supabaseAdmin.rpc('clean_aquarium', {
        aquarium_id_param: aquariumId,
        cleaning_type: cleaningType,
      });

      if (error) throw error;

      // Clear cache
      await redisClient.del(CACHE_KEYS.AQUARIUM_DIRT(aquariumId));

      // Add additional metadata
      const result = {
        ...data,
        aquarium_id: aquariumId,
        player_id: playerId,
        cleaning_type: cleaningType,
        timestamp: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      console.error('Error cleaning aquarium:', error);
      throw error;
    }
  }

  /**
   * Clean individual dirt spot
   * @param {string} aquariumId - Aquarium ID
   * @param {number} spotId - Dirt spot ID
   * @param {string} playerId - Player ID
   * @returns {Object} Cleaning result
   */
  static async cleanDirtSpot(aquariumId, spotId, playerId) {
    try {
      // Simply call cleanAquarium with 'partial' type
      // The spot ID is mainly for frontend tracking
      const result = await this.cleanAquarium(aquariumId, playerId, 'partial');
      
      return {
        ...result,
        spot_id: spotId,
        message: 'Dirt spot cleaned successfully',
      };
    } catch (error) {
      console.error('Error cleaning dirt spot:', error);
      throw error;
    }
  }

  /**
   * Update aquarium dirt level
   * @param {string} aquariumId - Aquarium ID
   * @param {number} newDirtLevel - New dirt level
   */
  static async updateAquariumDirtLevel(aquariumId, newDirtLevel) {
    try {
      const { error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .update({
          dirt_level: newDirtLevel,
          partial_dirt_level: newDirtLevel,
          last_updated: new Date().toISOString(),
        })
        .eq('aquarium_id', aquariumId);

      if (error) throw error;

      // Clear cache
      await redisClient.del(CACHE_KEYS.AQUARIUM_DIRT(aquariumId));
    } catch (error) {
      console.error('Error updating aquarium dirt level:', error);
      throw error;
    }
  }

  /**
   * Get player's aquarium dirt statuses
   * @param {string} playerId - Player ID
   * @returns {Array} Array of aquarium dirt statuses
   */
  static async getPlayerAquariumDirtStatuses(playerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .select(
          `
          aquarium_id,
          last_cleaning_time,
          dirt_level,
          partial_dirt_level,
          cleaning_streak,
          total_cleanings,
          dirt_config
        `
        )
        .eq('player_id', playerId);

      if (error) throw error;

      // Calculate current dirt levels for all aquariums
      const dirtStatuses = await Promise.all(
        data.map(async aquarium => {
          const currentDirtLevel = await this.calculateCurrentDirtLevel(
            aquarium.last_cleaning_time,
            aquarium.dirt_config
          );

          return {
            aquarium_id: aquarium.aquarium_id,
            current_dirt_level: currentDirtLevel,
            partial_dirt_level: aquarium.partial_dirt_level,
            last_cleaning_time: aquarium.last_cleaning_time,
            cleaning_streak: aquarium.cleaning_streak,
            total_cleanings: aquarium.total_cleanings,
            hours_since_cleaning: this.calculateHoursSinceCleaning(
              aquarium.last_cleaning_time
            ),
            cleanliness_status: this.getCleanlinessStatus(currentDirtLevel),
          };
        })
      );

      return dirtStatuses;
    } catch (error) {
      console.error('Error getting player aquarium dirt statuses:', error);
      throw error;
    }
  }

  /**
   * Initialize dirt system for new aquarium
   * @param {string} aquariumId - Aquarium ID
   * @param {string} playerId - Player ID
   * @param {Object} config - Optional custom config
   */
  static async initializeAquariumDirtSystem(
    aquariumId,
    playerId,
    config = null
  ) {
    try {
      const dirtConfig = { ...this.DEFAULT_CONFIG, ...config };
      const now = new Date().toISOString();

      const { error } = await supabase
        .from(TABLES.AQUARIUM_STATES)
        .update({
          last_cleaning_time: now,
          dirt_level: 0,
          partial_dirt_level: 0,
          cleaning_streak: 0,
          total_cleanings: 0,
          dirt_config: dirtConfig,
          last_updated: now,
        })
        .eq('aquarium_id', aquariumId)
        .eq('player_id', playerId);

      if (error) throw error;

      // Clear cache
      await redisClient.del(CACHE_KEYS.AQUARIUM_DIRT(aquariumId));

      return {
        success: true,
        aquarium_id: aquariumId,
        initialized_at: now,
        dirt_config: dirtConfig,
      };
    } catch (error) {
      console.error('Error initializing aquarium dirt system:', error);
      throw error;
    }
  }
}
