import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

// Fish service for managing fish states and operations
export class FishService {
  // Get fish state from cache or database
  static async getFishState(fishId) {
    try {
      // Try to get from cache first
      const cachedState = await redisClient.get(
        CACHE_KEYS.FISH_HAPPINESS(fishId)
      );
      if (cachedState) {
        return JSON.parse(cachedState);
      }

      // If not in cache, get from database
      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('fish_id', fishId)
        .single();

      if (error) throw error;

      // Cache the result
      if (data) {
        await redisClient.setEx(
          CACHE_KEYS.FISH_HAPPINESS(fishId),
          CACHE_TTL.FISH_STATE,
          JSON.stringify(data)
        );
      }

      return data;
    } catch (error) {
      console.error('Error getting fish state:', error);
      throw error;
    }
  }

  // Update fish happiness level
  static async updateFishHappiness(fishId, happinessLevel) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .upsert({
          fish_id: fishId,
          happiness_level: happinessLevel,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating fish happiness:', error);
      throw error;
    }
  }

  // Feed fish and update hunger level
  static async feedFish(fishId, foodType = 'basic') {
    try {
      const currentState = await this.getFishState(fishId);
      const currentHunger = currentState?.hunger_level || 100;

      // Calculate new hunger level based on food type
      const hungerIncrease = foodType === 'premium' ? 30 : 20;
      const newHunger = Math.min(100, currentHunger + hungerIncrease);

      // Update hunger and happiness
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

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error feeding fish:', error);
      throw error;
    }
  }

  // Get all fish for a player
  static async getPlayerFish(playerId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.FISH_STATES)
        .select('*')
        .eq('player_id', playerId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting player fish:', error);
      throw error;
    }
  }

  // Create new fish state (called when fish is created on-chain)
  static async createFishState(fishId, playerId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.FISH_STATES)
        .insert({
          fish_id: fishId,
          player_id: playerId,
          happiness_level: 100,
          hunger_level: 100,
          health: 100,
          mood: 'happy',
          last_interaction_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Cache the new fish state
      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error creating fish state:', error);
      throw error;
    }
  }

  // Update fish mood based on various factors
  static async updateFishMood(fishId) {
    try {
      const currentState = await this.getFishState(fishId);
      if (!currentState) return null;

      let newMood = 'happy';

      // Determine mood based on current state
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

      if (error) throw error;

      // Update cache
      await redisClient.setEx(
        CACHE_KEYS.FISH_HAPPINESS(fishId),
        CACHE_TTL.FISH_STATE,
        JSON.stringify(data)
      );

      return data;
    } catch (error) {
      console.error('Error updating fish mood:', error);
      throw error;
    }
  }
}
