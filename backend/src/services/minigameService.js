import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

// Minigame service for managing game sessions and XP rewards
export class MinigameService {
  
  // Create a new minigame session
  static async createGameSession(playerWallet, gameType) {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .insert({
          session_id: sessionId,
          player_wallet: playerWallet,
          game_type: gameType,
          score: 0,
          xp_earned: 0,
          synced_to_chain: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  // Update game session with final score and XP
  static async endGameSession(sessionId, finalScore, xpEarned) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .update({
          score: finalScore,
          xp_earned: xpEarned,
          ended_at: new Date().toISOString(),
          synced_to_chain: false
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  }

  // Calculate XP based on game type and score
  static calculateXP(gameType, score) {
    const baseXP = {
      'flappy_fish': 10,
      'angry_fish': 15,
      'fish_racing': 20,
      'bubble_pop': 8,
      'fish_memory': 12
    };

    const base = baseXP[gameType] || 10;
    const multiplier = Math.floor(score / 100) + 1;
    return base * multiplier;
  }

  // Get player's game statistics
  static async getPlayerStats(playerWallet) {
    try {
      const { data, error } = await supabase
        .from(TABLES.MINIGAME_SESSIONS)
        .select('*')
        .eq('player_wallet', playerWallet);

      if (error) throw error;

      // Calculate statistics
      const stats = {
        totalGames: data.length,
        totalXP: data.reduce((sum, session) => sum + (session.xp_earned || 0), 0),
        averageScore: data.length > 0 ? data.reduce((sum, session) => sum + (session.score || 0), 0) / data.length : 0,
        gamesByType: {},
        bestScores: {}
      };

      // Group by game type
      data.forEach(session => {
        const gameType = session.game_type;
        if (!stats.gamesByType[gameType]) {
          stats.gamesByType[gameType] = 0;
          stats.bestScores[gameType] = 0;
        }
        stats.gamesByType[gameType]++;
        if (session.score > stats.bestScores[gameType]) {
          stats.bestScores[gameType] = session.score;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting player stats:', error);
      throw error;
    }
  }

  // Get leaderboard for a specific game type
  static async getLeaderboard(gameType, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.MINIGAME_SESSIONS)
        .select('session_id, player_wallet, score, xp_earned, created_at')
        .eq('game_type', gameType)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Get global leaderboard across all games
  static async getGlobalLeaderboard(limit = 20) {
    try {
      // Get total XP per player
      const { data, error } = await supabase
        .from(TABLES.MINIGAME_SESSIONS)
        .select('player_wallet, xp_earned')
        .not('xp_earned', 'is', null);

      if (error) throw error;

      // Group by player and sum XP
      const playerXP = {};
      data.forEach(session => {
        if (!playerXP[session.player_wallet]) {
          playerXP[session.player_wallet] = 0;
        }
        playerXP[session.player_wallet] += session.xp_earned;
      });

      // Convert to array and sort
      const leaderboard = Object.entries(playerXP)
        .map(([wallet, xp]) => ({ player_wallet: wallet, total_xp: xp }))
        .sort((a, b) => b.total_xp - a.total_xp)
        .slice(0, limit);

      return leaderboard;
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
      throw error;
    }
  }

  // Mark session as synced to blockchain
  static async markSessionSynced(sessionId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .update({
          synced_to_chain: true,
          synced_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking session synced:', error);
      throw error;
    }
  }

  // Get unsynced sessions for blockchain sync
  static async getUnsyncedSessions() {
    try {
      const { data, error } = await supabase
        .from(TABLES.MINIGAME_SESSIONS)
        .select('*')
        .eq('synced_to_chain', false)
        .not('ended_at', 'is', null);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting unsynced sessions:', error);
      throw error;
    }
  }

  // Award bonus XP for achievements
  static async awardBonusXP(playerWallet, achievement, bonusXP) {
    try {
      const sessionId = `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .insert({
          session_id: sessionId,
          player_wallet: playerWallet,
          game_type: 'achievement',
          score: 0,
          xp_earned: bonusXP,
          achievement_type: achievement,
          synced_to_chain: false,
          created_at: new Date().toISOString(),
          ended_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error awarding bonus XP:', error);
      throw error;
    }
  }
}
