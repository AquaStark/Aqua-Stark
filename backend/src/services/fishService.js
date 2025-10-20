import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';
import { logger } from '../../utils/logger.js';
import {
  fishIdSchema,
  playerIdSchema,
  happinessSchema,
} from '../../utils/validators.js';
import { ServiceError } from '../../utils/errors.js';

/**
 * Enhanced Fish Service for managing fish states and operations
 *
 * @class FishService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */
export class FishService {
  /**
   * Get fish state from cache or database
   * @param {string} fishId - The fish ID
   * @returns {Promise<Object>} Fish state data
   */
  static async getFishState(fishId) {
    try {
      fishIdSchema.parse(fishId);

      const cachedState = await redisClient.get(
        CACHE_KEYS.FISH_HAPPINESS(fishId)
      );
      if (cachedState) {
        logger.debug({ fishId }, 'Cache hit for fish state');
        return JSON.parse(cachedState);
      }

      logger.debug({ fishId }, 'Cache miss, querying database');

      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('fish_id', fishId)
        .single();

      if (error) {
        logger.error({ fishId, error }, 'Database error fetching fish state');
        throw new ServiceError('FISH_NOT_FOUND', 'Fish state not found', 404);
      }

      if (data) {
        logger.info({ fishId }, 'Fish state retrieved from DB and cached');
        await redisClient.setEx(
          CACHE_KEYS.FISH_HAPPINESS(fishId),
          CACHE_TTL.FISH_STATE,
          JSON.stringify(data)
        );
      }

      return data;
    } catch (error) {
      logger.error({ fishId, error }, 'Error getting fish state');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('DATABASE_ERROR', 'Failed to get fish state', 500);
    }
  }

  /**
   * Update fish happiness level
   * @param {string} fishId - The fish ID
   * @param {number} happinessLevel - Happiness level (0-100)
   * @returns {Promise<Object>} Updated fish data
   */
  static async updateFishHappiness(fishId, happinessLevel) {
    try {
      fishIdSchema.parse(fishId);
      happinessSchema.parse(happinessLevel);

      if (happinessLevel < 0 || happinessLevel > 100) {
        throw new ServiceError(
          'INVALID_HAPPINESS',
          'Happiness level must be between 0 and 100',
          400
        );
      }

      logger.info({ fishId, happinessLevel }, 'Updating fish happiness');

      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .upsert({
          fish_id: fishId,
          happiness_level: happinessLevel,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error({ fishId, error }, 'Error updating fish happiness in DB');
        throw new ServiceError(
          'UPDATE_FAILED',
          'Failed to update fish happiness',
          500
        );
      }

      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      logger.debug({ fishId }, 'Fish happiness updated in cache');
      return data;
    } catch (error) {
      logger.error({ fishId, error }, 'Error updating fish happiness');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('UPDATE_ERROR', 'Failed to update happiness', 500);
    }
  }

  /**
   * Feed fish and update hunger level
   * @param {string} fishId - The fish ID
   * @param {string} foodType - Type of food (basic, premium)
   * @returns {Promise<Object>} Updated fish data
   */
  static async feedFish(fishId, foodType = 'basic') {
    try {
      fishIdSchema.parse(fishId);

      const validFoodTypes = ['basic', 'premium'];
      if (!validFoodTypes.includes(foodType)) {
        throw new ServiceError('INVALID_FOOD_TYPE', 'Invalid food type', 400);
      }

      logger.info({ fishId, foodType }, 'Feeding fish');

      const currentState = await this.getFishState(fishId);
      const currentHunger = currentState?.hunger_level || 100;

      const hungerIncrease = foodType === 'premium' ? 30 : 20;
      const newHunger = Math.min(100, currentHunger + hungerIncrease);

      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .upsert({
          fish_id: fishId,
          hunger_level: newHunger,
          happiness_level: Math.min(
            100,
            (currentState?.happiness_level || 50) + 10
          ),
          last_fed_timestamp: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error({ fishId, error }, 'Error feeding fish in DB');
        throw new ServiceError('FEED_FAILED', 'Failed to feed fish', 500);
      }

      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      logger.debug({ fishId }, 'Fish feeding state updated in cache');
      return data;
    } catch (error) {
      logger.error({ fishId, error }, 'Error feeding fish');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('FEED_ERROR', 'Failed to feed fish', 500);
    }
  }

  /**
   * Get all fish for a player
   * @param {string} playerId - The player ID
   * @returns {Promise<Array>} Array of fish data
   */
  static async getPlayerFish(playerId) {
    try {
      playerIdSchema.parse(playerId);
      logger.info({ playerId }, 'Fetching all fish for player');

      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('player_id', playerId);

      if (error) {
        logger.error({ playerId, error }, 'Error fetching player fish');
        throw new ServiceError(
          'FETCH_FAILED',
          'Failed to fetch player fish',
          500
        );
      }

      return data;
    } catch (error) {
      logger.error({ playerId, error }, 'Error getting player fish');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('FETCH_ERROR', 'Failed to get player fish', 500);
    }
  }

  /**
   * Create new fish state
   * @param {string} fishId - The fish ID
   * @param {string} playerId - The player ID
   * @param {string} species - Fish species (AngelFish, GoldFish, etc.)
   * @param {string} imageUrl - Fish image URL
   * @param {string} onChainId - On-chain fish ID
   * @returns {Promise<Object>} Created fish data
   */
  static async createFishState(
    fishId,
    playerId,
    species = null,
    imageUrl = null,
    onChainId = null
  ) {
    try {
      fishIdSchema.parse(fishId);
      playerIdSchema.parse(playerId);
      logger.info(
        { fishId, playerId, species, imageUrl, onChainId },
        'Creating new fish state'
      );

      const insertData = {
        fish_id: fishId,
        player_id: playerId,
        happiness_level: 100,
        hunger_level: 100,
        health: 100,
        mood: 'happy',
        last_interaction_timestamp: new Date().toISOString(),
      };

      // Add optional fields if provided
      if (species) insertData.species = species;
      if (imageUrl) insertData.image_url = imageUrl;
      if (onChainId) insertData.on_chain_id = onChainId;

      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logger.error({ fishId, playerId, error }, 'Error creating fish state');
        throw new ServiceError(
          'CREATE_FAILED',
          'Failed to create fish state',
          500
        );
      }

      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      logger.debug({ fishId }, 'New fish state cached');
      return data;
    } catch (error) {
      logger.error({ fishId, playerId, error }, 'Error creating fish state');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('CREATE_ERROR', 'Failed to create fish', 500);
    }
  }

  /**
   * Sync fish from on-chain to backend
   * @param {string} fishId - The fish ID
   * @param {string} playerId - The player ID
   * @param {Object} fishData - Fish data from blockchain
   * @returns {Promise<Object>} Created/Updated fish data
   */
  static async syncFishFromChain(fishId, playerId, fishData) {
    try {
      fishIdSchema.parse(fishId);
      playerIdSchema.parse(playerId);

      const { species, image_url, on_chain_id } = fishData;
      logger.info({ fishId, playerId, species }, 'Syncing fish from chain');

      // Check if fish already exists
      const { data: existing } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('fish_id', fishId)
        .single();

      if (existing) {
        // Update existing fish
        const { data, error } = await supabaseAdmin
          .from(TABLES.FISH_STATES)
          .update({
            species,
            image_url,
            on_chain_id,
            last_updated: new Date().toISOString(),
          })
          .eq('fish_id', fishId)
          .select()
          .single();

        if (error) throw error;
        logger.info({ fishId }, 'Fish updated from chain');
        return data;
      } else {
        // Create new fish
        return await this.createFishState(
          fishId,
          playerId,
          species,
          image_url,
          on_chain_id
        );
      }
    } catch (error) {
      logger.error({ fishId, playerId, error }, 'Error syncing fish');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('SYNC_ERROR', 'Failed to sync fish', 500);
    }
  }

  /**
   * Update fish mood based on various factors
   * @param {string} fishId - The fish ID
   * @returns {Promise<Object>} Updated fish data
   */
  static async updateFishMood(fishId) {
    try {
      fishIdSchema.parse(fishId);
      logger.info({ fishId }, 'Updating fish mood');

      const currentState = await this.getFishState(fishId);
      if (!currentState) {
        logger.warn({ fishId }, 'Fish state not found, skipping mood update');
        return null;
      }

      let newMood = 'happy';

      if (currentState.hunger_level < 30) {
        newMood = 'hungry';
      } else if (currentState.happiness_level < 30) {
        newMood = 'sad';
      } else if (currentState.health < 50) {
        newMood = 'sick';
      } else if (currentState.activity_streak > 5) {
        newMood = 'excited';
      }

      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .update({
          mood: newMood,
          last_updated: new Date().toISOString(),
        })
        .eq('fish_id', fishId)
        .select()
        .single();

      if (error) {
        logger.error({ fishId, error }, 'Error updating fish mood in DB');
        throw new ServiceError(
          'MOOD_UPDATE_FAILED',
          'Failed to update fish mood',
          500
        );
      }

      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      logger.debug({ fishId, newMood }, 'Fish mood updated and cached');
      return data;
    } catch (error) {
      logger.error({ fishId, error }, 'Error updating fish mood');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('MOOD_ERROR', 'Failed to update mood', 500);
    }
  }

  /**
   * Feed multiple fish at once
   * @param {Array<string>} fishIds - Array of fish IDs
   * @param {string} foodType - Type of food
   * @returns {Promise<Array>} Results of feeding operations
   */
  static async feedMultipleFish(fishIds, foodType = 'basic') {
    try {
      if (!Array.isArray(fishIds) || fishIds.length === 0) {
        throw new ServiceError(
          'INVALID_INPUT',
          'Fish IDs must be a non-empty array',
          400
        );
      }

      logger.info({ fishIds, foodType }, 'Feeding multiple fish');

      const results = await Promise.allSettled(
        fishIds.map(fishId => this.feedFish(fishId, foodType))
      );

      const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
      const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);

      logger.info(
        {
          total: fishIds.length,
          successful: successful.length,
          failed: failed.length,
        },
        'Batch feeding completed'
      );

      return { successful, failed };
    } catch (error) {
      logger.error({ fishIds, error }, 'Error in batch feeding');
      throw new ServiceError(
        'BATCH_FEED_ERROR',
        'Failed to feed multiple fish',
        500
      );
    }
  }

  /**
   * Get fish statistics
   * @param {string} playerId - Optional player ID for player-specific stats
   * @returns {Promise<Object>} Fish statistics
   */
  static async getFishStats(playerId = null) {
    try {
      logger.info({ playerId }, 'Getting fish statistics');

      let query = supabase.from(TABLES.FISH_STATES).select('*');

      if (playerId) {
        playerIdSchema.parse(playerId);
        query = query.eq('player_id', playerId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error({ playerId, error }, 'Error fetching fish stats');
        throw new ServiceError(
          'STATS_FETCH_FAILED',
          'Failed to fetch statistics',
          500
        );
      }

      const stats = {
        total: data.length,
        averageHappiness:
          data.reduce((sum, fish) => sum + fish.happiness_level, 0) /
            data.length || 0,
        averageHunger:
          data.reduce((sum, fish) => sum + fish.hunger_level, 0) /
            data.length || 0,
        averageHealth:
          data.reduce((sum, fish) => sum + fish.health, 0) / data.length || 0,
        moodDistribution: data.reduce((acc, fish) => {
          acc[fish.mood] = (acc[fish.mood] || 0) + 1;
          return acc;
        }, {}),
        activefish: data.filter(
          fish =>
            new Date() - new Date(fish.last_interaction_timestamp) <
            24 * 60 * 60 * 1000
        ).length,
      };

      logger.debug({ stats }, 'Fish statistics calculated');
      return stats;
    } catch (error) {
      logger.error({ playerId, error }, 'Error getting fish stats');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('STATS_ERROR', 'Failed to get statistics', 500);
    }
  }

  /**
   * Filter and search fish with advanced criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered fish data
   */
  static async filterFish(filters = {}) {
    try {
      logger.info({ filters }, 'Filtering fish');

      let query = supabase.from(TABLES.FISH_STATES).select('*');

      if (filters.playerId) {
        playerIdSchema.parse(filters.playerId);
        query = query.eq('player_id', filters.playerId);
      }

      if (filters.mood) {
        query = query.eq('mood', filters.mood);
      }

      if (filters.minHappiness !== undefined) {
        query = query.gte('happiness_level', filters.minHappiness);
      }

      if (filters.maxHappiness !== undefined) {
        query = query.lte('happiness_level', filters.maxHappiness);
      }

      if (filters.minHunger !== undefined) {
        query = query.gte('hunger_level', filters.minHunger);
      }

      if (filters.maxHunger !== undefined) {
        query = query.lte('hunger_level', filters.maxHunger);
      }

      if (filters.minHealth !== undefined) {
        query = query.gte('health', filters.minHealth);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error({ filters, error }, 'Error filtering fish');
        throw new ServiceError('FILTER_FAILED', 'Failed to filter fish', 500);
      }

      logger.debug({ count: data.length }, 'Fish filtered successfully');
      return data;
    } catch (error) {
      logger.error({ filters, error }, 'Error in fish filtering');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('FILTER_ERROR', 'Failed to filter fish', 500);
    }
  }

  /**
   * Get fish that need attention (low happiness, hunger, or health)
   * @param {string} playerId - Player ID
   * @returns {Promise<Array>} Fish needing attention
   */
  static async getFishNeedingAttention(playerId) {
    try {
      playerIdSchema.parse(playerId);
      logger.info({ playerId }, 'Getting fish needing attention');

      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('player_id', playerId)
        .or('happiness_level.lt.30,hunger_level.lt.30,health.lt.50');

      if (error) {
        logger.error(
          { playerId, error },
          'Error fetching fish needing attention'
        );
        throw new ServiceError(
          'ATTENTION_FETCH_FAILED',
          'Failed to fetch fish needing attention',
          500
        );
      }

      logger.debug({ count: data.length }, 'Fish needing attention retrieved');
      return data;
    } catch (error) {
      logger.error({ playerId, error }, 'Error getting fish needing attention');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'ATTENTION_ERROR',
        'Failed to get fish needing attention',
        500
      );
    }
  }

  /**
   * Get all species from catalog
   * @returns {Promise<Array>} Species catalog
   */
  static async getSpeciesCatalog() {
    try {
      logger.info('Fetching species catalog');

      const cacheKey = 'species_catalog';
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        logger.debug('Species catalog cache hit');
        return JSON.parse(cached);
      }

      const { data, error } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true });

      if (error) {
        logger.error({ error }, 'Error fetching species catalog');
        throw new ServiceError(
          'CATALOG_FETCH_FAILED',
          'Failed to fetch species catalog',
          500
        );
      }

      // Cache for 1 hour (species don't change often)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(data));

      logger.debug({ count: data.length }, 'Species catalog fetched');
      return data;
    } catch (error) {
      logger.error({ error }, 'Error getting species catalog');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'CATALOG_ERROR',
        'Failed to get species catalog',
        500
      );
    }
  }

  /**
   * Get species info by name
   * @param {string} speciesName - Species name
   * @returns {Promise<Object>} Species data
   */
  static async getSpeciesInfo(speciesName) {
    try {
      logger.info({ speciesName }, 'Fetching species info');

      const { data, error } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('species_name', speciesName)
        .single();

      if (error) {
        logger.error({ speciesName, error }, 'Species not found');
        throw new ServiceError('SPECIES_NOT_FOUND', 'Species not found', 404);
      }

      return data;
    } catch (error) {
      logger.error({ speciesName, error }, 'Error getting species info');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'SPECIES_ERROR',
        'Failed to get species info',
        500
      );
    }
  }

  /**
   * Create fish state in backend (simplified version for onboarding)
   * @param {string} fishId - The fish ID (can be same as on_chain_id)
   * @param {string} playerId - The player ID (wallet address)
   * @param {string} onChainId - The on-chain fish ID from blockchain
   * @param {string} species - The species name (FK to species_catalog)
   * @returns {Promise<Object>} Created fish data
   */
  static async createFishStateSimple(fishId, playerId, onChainId, species) {
    try {
      logger.info(
        { fishId, playerId, onChainId, species },
        'Creating fish state (simple)'
      );

      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .insert({
          fish_id: fishId,
          on_chain_id: onChainId || fishId,
          player_id: playerId,
          species: species,
          happiness_level: 50,
          hunger_level: 100,
          health: 100,
          mood: 'happy',
          last_interaction_timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error({ fishId, error }, 'Error creating fish state');
        throw new ServiceError(
          'FISH_CREATE_FAILED',
          'Failed to create fish state',
          500
        );
      }

      logger.info({ fishId }, 'Fish state created successfully');
      return data;
    } catch (error) {
      logger.error({ fishId, error }, 'Error in createFishStateSimple');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'FISH_CREATE_ERROR',
        'Failed to create fish state',
        500
      );
    }
  }

  /**
   * Get all fish states for a player from backend
   * @param {string} playerId - The player ID (wallet address)
   * @returns {Promise<Array>} Array of fish states
   */
  static async getPlayerFishStates(playerId) {
    try {
      logger.info({ playerId }, 'Fetching player fish states');

      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false});

      if (error) {
        logger.error({ playerId, error }, 'Error fetching player fish');
        throw new ServiceError(
          'FISH_FETCH_FAILED',
          'Failed to fetch player fish',
          500
        );
      }

      logger.debug({ playerId, count: data?.length }, 'Player fish fetched');
      return data || [];
    } catch (error) {
      logger.error({ playerId, error }, 'Error in getPlayerFishStates');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'FISH_FETCH_ERROR',
        'Failed to get player fish',
        500
      );
    }
  }
}
