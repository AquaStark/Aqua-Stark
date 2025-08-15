import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

// Aquarium service for managing aquarium states and operations
export class AquariumService {
  
  // Get aquarium state from cache or database
  static async getAquariumState(aquariumId) {
    try {
      // Try to get from cache first
      const cachedState = await redisClient.get(CACHE_KEYS.AQUARIUM_STATE(aquariumId));
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

  // Update aquarium water temperature
  static async updateWaterTemperature(aquariumId, temperature) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          water_temperature: temperature,
          last_updated: new Date().toISOString()
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

  // Update aquarium lighting level
  static async updateLightingLevel(aquariumId, lightingLevel) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.AQUARIUM_STATES)
        .upsert({
          aquarium_id: aquariumId,
          lighting_level: lightingLevel,
          last_updated: new Date().toISOString()
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

  // Clean aquarium and reduce pollution
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
          last_updated: new Date().toISOString()
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

  // Get all aquariums for a player
  static async getPlayerAquariums(walletAddress) {
    try {
      const { data, error } = await supabase
        .from(TABLES.AQUARIUM_NFTS)
        .select(`
          *,
          aquarium_states (*)
        `)
        .eq('owner_address', walletAddress);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting player aquariums:', error);
      throw error;
    }
  }

  // Add fish to aquarium
  static async addFishToAquarium(aquariumId, fishId) {
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
          last_updated: new Date().toISOString()
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

  // Remove fish from aquarium
  static async removeFishFromAquarium(aquariumId, fishId) {
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
          last_updated: new Date().toISOString()
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

  // Get aquarium health score based on various factors
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
