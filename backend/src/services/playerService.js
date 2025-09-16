import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

/**
 * Player Service for managing player data and profile operations
 * 
 * This service handles all player-related operations including profile management,
 * experience tracking, currency management, statistics, and preferences.
 * It provides comprehensive player data management with caching for performance.
 * 
 * @class PlayerService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */
export class PlayerService {
  /**
   * Get player profile from cache or database
   * 
   * Retrieves the complete player profile including stats, experience,
   * currency, and other player data. Uses Redis cache for performance.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Object|null>} Player profile object or null if not found
   * @throws {Error} When database query fails or player ID is invalid
   * 
   * @example
   * ```javascript
   * // Get player profile
   * const player = await PlayerService.getPlayerProfile('player_123');
   * console.log(`Player ${player.username} is level ${player.level}`);
   * console.log(`Has ${player.currency} currency and ${player.experience_current} XP`);
   * ```
   */
  static async getPlayerProfile(playerId) {
    try {
      // Try to get from cache first
      const cachedProfile = await redisClient.get(
        CACHE_KEYS.PLAYER_SESSION(playerId)
      );
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }

      // If not in cache, get from database
      const { data, error } = await supabase
        .from(TABLES.PLAYERS)
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (error) throw error;

      // Cache the result
      if (data) {
        await redisClient.setEx(
          CACHE_KEYS.PLAYER_SESSION(playerId),
          CACHE_TTL.PLAYER_SESSION,
          JSON.stringify(data)
        );
      }

      return data;
    } catch (error) {
      console.error('Error getting player profile:', error);
      throw error;
    }
  }

  /**
   * Get player by wallet address
   * 
   * Retrieves a player profile using their wallet address instead of player ID.
   * Useful for authentication and wallet-based lookups.
   * 
   * @static
   * @async
   * @param {string} walletAddress - The player's wallet address
   * @returns {Promise<Object|null>} Player profile object or null if not found
   * @throws {Error} When database query fails or wallet address is invalid
   * 
   * @example
   * ```javascript
   * // Get player by wallet address
   * const player = await PlayerService.getPlayerByWallet('0x123...');
   * if (player) {
   *   console.log(`Found player: ${player.username}`);
   * } else {
   *   console.log('Player not found');
   * }
   * ```
   */
  static async getPlayerByWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLAYERS)
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

      if (error) throw error;
      return data; // Returns null if no player found
    } catch (error) {
      console.error('Error getting player by wallet:', error);
      throw error;
    }
  }

  /**
   * Create new player (called when player registers on-chain)
   * 
   * Creates a new player profile with default values when a player registers
   * on the blockchain. Initializes all statistics and preferences.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @param {string} walletAddress - The player's wallet address
   * @param {string|null} [username=null] - Optional username for the player
   * @returns {Promise<Object>} Created player profile object
   * @throws {Error} When database insert fails or player ID already exists
   * 
   * @example
   * ```javascript
   * // Create new player
   * const newPlayer = await PlayerService.createPlayer('player_123', '0x123...', 'AquaMaster');
   * console.log(`New player created: ${newPlayer.username} (Level ${newPlayer.level})`);
   * ```
   */
  static async createPlayer(playerId, walletAddress, username = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLAYERS)
        .insert({
          player_id: playerId,
          wallet_address: walletAddress,
          username: username,
          level: 1,
          experience_current: 0,
          experience_total: 0,
          currency: 0,
          play_time_minutes: 0,
          fish_collected: 0,
          total_fish: 0,
          special_fish: 0,
          achievements_completed: 0,
          achievements_total: 8,
          fish_fed_count: 0,
          decorations_placed: 0,
          fish_bred_count: 0,
          aquariums_created: 0,
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Cache the new player
      await redisClient.setEx(
        CACHE_KEYS.PLAYER_SESSION(playerId),
        CACHE_TTL.PLAYER_SESSION,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }

  /**
   * Update player experience and level
   * 
   * Adds experience points to a player and automatically calculates level progression.
   * Level is calculated as floor(experience_total / 1000) + 1.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @param {number} experienceGained - The amount of experience to add
   * @returns {Promise<Object>} Updated player profile object
   * @throws {Error} When player not found or database update fails
   * 
   * @example
   * ```javascript
   * // Award experience for completing a task
   * const updatedPlayer = await PlayerService.updatePlayerExperience('player_123', 150);
   * console.log(`Player is now level ${updatedPlayer.level} with ${updatedPlayer.experience_current} XP`);
   * ```
   */
  static async updatePlayerExperience(playerId, experienceGained) {
    try {
      const currentProfile = await this.getPlayerProfile(playerId);
      if (!currentProfile) {
        throw new Error('Player not found');
      }

      const newExperienceCurrent =
        currentProfile.experience_current + experienceGained;
      const newExperienceTotal =
        currentProfile.experience_total + experienceGained;

      // Calculate new level (simple formula: level = floor(experience_total / 1000) + 1)
      const newLevel = Math.floor(newExperienceTotal / 1000) + 1;

      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          experience_current: newExperienceCurrent,
          experience_total: newExperienceTotal,
          level: newLevel,
          last_updated: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.PLAYER_SESSION(playerId),
        CACHE_TTL.PLAYER_SESSION,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating player experience:', error);
      throw error;
    }
  }

  /**
   * Update player currency
   * 
   * Modifies a player's currency balance. Can be positive (earning) or negative (spending).
   * Currency cannot go below 0.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @param {number} currencyChange - The amount to change (positive or negative)
   * @returns {Promise<Object>} Updated player profile object
   * @throws {Error} When player not found or database update fails
   * 
   * @example
   * ```javascript
   * // Award currency for achievement
   * const updatedPlayer = await PlayerService.updatePlayerCurrency('player_123', 500);
   * console.log(`Player now has ${updatedPlayer.currency} currency`);
   * 
   * // Spend currency on item
   * const updatedPlayer2 = await PlayerService.updatePlayerCurrency('player_123', -100);
   * ```
   */
  static async updatePlayerCurrency(playerId, currencyChange) {
    try {
      const currentProfile = await this.getPlayerProfile(playerId);
      if (!currentProfile) {
        throw new Error('Player not found');
      }

      const newCurrency = Math.max(0, currentProfile.currency + currencyChange);

      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          currency: newCurrency,
          last_updated: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.PLAYER_SESSION(playerId),
        CACHE_TTL.PLAYER_SESSION,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating player currency:', error);
      throw error;
    }
  }

  /**
   * Update player statistics
   * 
   * Updates multiple player statistics at once. Useful for bulk updates
   * of various game metrics.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @param {Object} statsUpdate - Object containing statistics to update
   * @returns {Promise<Object>} Updated player profile object
   * @throws {Error} When player not found or database update fails
   * 
   * @example
   * ```javascript
   * // Update multiple stats
   * const statsUpdate = {
   *   fish_fed_count: 5,
   *   decorations_placed: 3,
   *   play_time_minutes: 120
   * };
   * const updatedPlayer = await PlayerService.updatePlayerStats('player_123', statsUpdate);
   * console.log(`Player fed ${updatedPlayer.fish_fed_count} fish`);
   * ```
   */
  static async updatePlayerStats(playerId, statsUpdate) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          ...statsUpdate,
          last_updated: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.PLAYER_SESSION(playerId),
        CACHE_TTL.PLAYER_SESSION,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }

  /**
   * Update last login
   * 
   * Updates the player's last login timestamp to the current time.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Object>} Updated player profile object
   * @throws {Error} When player not found or database update fails
   * 
   * @example
   * ```javascript
   * // Update login time
   * const updatedPlayer = await PlayerService.updateLastLogin('player_123');
   * console.log(`Last login: ${updatedPlayer.last_login}`);
   * ```
   */
  static async updateLastLogin(playerId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.PLAYER_SESSION(playerId),
        CACHE_TTL.PLAYER_SESSION,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Get player preferences
   * 
   * Retrieves the player's game preferences and settings.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @returns {Promise<Object|null>} Player preferences object or null if not found
   * @throws {Error} When database query fails or player ID is invalid
   * 
   * @example
   * ```javascript
   * // Get player preferences
   * const preferences = await PlayerService.getPlayerPreferences('player_123');
   * console.log(`Music enabled: ${preferences.music_enabled}`);
   * console.log(`Sound effects: ${preferences.sound_effects}`);
   * ```
   */
  static async getPlayerPreferences(playerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLAYER_PREFERENCES)
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting player preferences:', error);
      throw error;
    }
  }

  /**
   * Update player preferences
   * 
   * Updates or creates player preferences and settings.
   * 
   * @static
   * @async
   * @param {string} playerId - The unique identifier of the player
   * @param {Object} preferences - Object containing preference updates
   * @returns {Promise<Object>} Updated preferences object
   * @throws {Error} When database update fails or player ID is invalid
   * 
   * @example
   * ```javascript
   * // Update player preferences
   * const newPreferences = {
   *   music_enabled: true,
   *   sound_effects: false,
   *   theme: 'ocean'
   * };
   * const updatedPrefs = await PlayerService.updatePlayerPreferences('player_123', newPreferences);
   * console.log('Preferences updated successfully');
   * ```
   */
  static async updatePlayerPreferences(playerId, preferences) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYER_PREFERENCES)
        .upsert({
          player_id: playerId,
          ...preferences,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating player preferences:', error);
      throw error;
    }
  }
}
