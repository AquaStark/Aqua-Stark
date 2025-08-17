import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

// Decoration service for managing decoration states and operations
export class DecorationService {
  
  // Get decoration state from cache or database
  static async getDecorationState(decorationId) {
    try {
      // Try to get from cache first
      const cachedState = await redisClient.get(CACHE_KEYS.DECORATION_STATE(decorationId));
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

  // Create new decoration state (called when decoration is created on-chain)
  static async createDecorationState(decorationId, playerId, aquariumId = null) {
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
          created_at: new Date().toISOString()
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

  // Get all decorations for a player
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

  // Get decorations in a specific aquarium
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

  // Place decoration in aquarium
  static async placeDecoration(decorationId, aquariumId, positionX, positionY, rotationDegrees = 0) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          aquarium_id: aquariumId,
          position_x: positionX,
          position_y: positionY,
          rotation_degrees: rotationDegrees,
          is_visible: true,
          last_updated: new Date().toISOString()
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

  // Remove decoration from aquarium
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
          last_updated: new Date().toISOString()
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

  // Update decoration position
  static async updateDecorationPosition(decorationId, positionX, positionY, rotationDegrees) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          position_x: positionX,
          position_y: positionY,
          rotation_degrees: rotationDegrees,
          last_updated: new Date().toISOString()
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

  // Toggle decoration visibility
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
          last_updated: new Date().toISOString()
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

  // Move decoration between aquariums
  static async moveDecoration(decorationId, fromAquariumId, toAquariumId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.DECORATION_STATES)
        .update({
          aquarium_id: toAquariumId,
          position_x: null, // Reset position for new aquarium
          position_y: null,
          rotation_degrees: 0,
          last_updated: new Date().toISOString()
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

  // Get decoration statistics for a player
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
        unplaced_decorations: data.filter(d => d.aquarium_id === null).length
      };

      return stats;
    } catch (error) {
      console.error('Error getting decoration stats:', error);
      throw error;
    }
  }
}
