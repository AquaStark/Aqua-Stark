import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

// Player service for managing player data and profile operations
export class PlayerService {
  
  // Get player profile from cache or database
  static async getPlayerProfile(playerId) {
    try {
      // Try to get from cache first
      const cachedProfile = await redisClient.get(CACHE_KEYS.PLAYER_SESSION(playerId));
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

  // Get player by wallet address
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

  // Create new player (called when player registers on-chain)
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
          last_login: new Date().toISOString()
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

  // Update player experience and level
  static async updatePlayerExperience(playerId, experienceGained) {
    try {
      const currentProfile = await this.getPlayerProfile(playerId);
      if (!currentProfile) {
        throw new Error('Player not found');
      }

      const newExperienceCurrent = currentProfile.experience_current + experienceGained;
      const newExperienceTotal = currentProfile.experience_total + experienceGained;
      
      // Calculate new level (simple formula: level = floor(experience_total / 1000) + 1)
      const newLevel = Math.floor(newExperienceTotal / 1000) + 1;

      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          experience_current: newExperienceCurrent,
          experience_total: newExperienceTotal,
          level: newLevel,
          last_updated: new Date().toISOString()
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

  // Update player currency
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
          last_updated: new Date().toISOString()
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

  // Update player statistics
  static async updatePlayerStats(playerId, statsUpdate) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          ...statsUpdate,
          last_updated: new Date().toISOString()
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

  // Update last login
  static async updateLastLogin(playerId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYERS)
        .update({
          last_login: new Date().toISOString()
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

  // Get player preferences
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

  // Update player preferences
  static async updatePlayerPreferences(playerId, preferences) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLAYER_PREFERENCES)
        .upsert({
          player_id: playerId,
          ...preferences,
          last_updated: new Date().toISOString()
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
