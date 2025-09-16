import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
// import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';

/**
 * Minigame Service for managing game sessions and XP rewards
 *
 * This service handles all minigame-related operations including session management,
 * score tracking, XP calculation, leaderboards, and blockchain synchronization.
 * It supports multiple game types and provides comprehensive statistics.
 *
 * @class MinigameService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-09-16
 */
export class MinigameService {
  /**
   * Create a new minigame session
   *
   * Initializes a new game session for a player with a specific game type.
   * Sessions track scores, XP earned, and synchronization status with blockchain.
   *
   * @static
   * @async
   * @param {string} playerWallet - The player's wallet address
   * @param {string} gameType - Type of minigame ('flappy_fish', 'angry_fish', 'fish_racing', 'bubble_pop', 'fish_memory')
   * @returns {Promise<Object>} Created game session object
   * @throws {Error} When database insert fails or invalid game type provided
   *
   * @example
   * ```javascript
   * // Start a new flappy fish game session
   * const session = await MinigameService.createGameSession('0x123...', 'flappy_fish');
   * console.log(`Game session ${session.session_id} started`);
   * ```
   */
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
          created_at: new Date().toISOString(),
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

  /**
   * Update game session with final score and XP
   *
   * Ends a game session by recording the final score and XP earned.
   * Marks the session as ready for blockchain synchronization.
   *
   * @static
   * @async
   * @param {string} sessionId - The unique identifier of the game session
   * @param {number} finalScore - The final score achieved in the game
   * @param {number} xpEarned - The XP points earned from this session
   * @returns {Promise<Object>} Updated game session object
   * @throws {Error} When database update fails or session ID is invalid
   *
   * @example
   * ```javascript
   * // End game session with score and XP
   * const session = await MinigameService.endGameSession('session_123', 1500, 45);
   * console.log(`Session ended with ${session.score} points and ${session.xp_earned} XP`);
   * ```
   */
  static async endGameSession(sessionId, finalScore, xpEarned) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .update({
          score: finalScore,
          xp_earned: xpEarned,
          ended_at: new Date().toISOString(),
          synced_to_chain: false,
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

  /**
   * Calculate XP based on game type and score
   *
   * Calculates XP points earned based on the game type and player's score.
   * Different games have different base XP values and multipliers.
   *
   * @static
   * @param {string} gameType - Type of minigame
   * @param {number} score - Player's score in the game
   * @returns {number} Calculated XP points
   *
   * @example
   * ```javascript
   * // Calculate XP for a high score
   * const xp = MinigameService.calculateXP('flappy_fish', 2500);
   * console.log(`Earned ${xp} XP points`); // 30 XP (10 base * 3 multiplier)
   * ```
   */
  static calculateXP(gameType, score) {
    const baseXP = {
      flappy_fish: 10,
      angry_fish: 15,
      fish_racing: 20,
      bubble_pop: 8,
      fish_memory: 12,
    };

    const base = baseXP[gameType] || 10;
    const multiplier = Math.floor(score / 100) + 1;
    return base * multiplier;
  }

  /**
   * Get player's game statistics
   *
   * Retrieves comprehensive statistics for a player including total games played,
   * XP earned, average scores, and best scores by game type.
   *
   * @static
   * @async
   * @param {string} playerWallet - The player's wallet address
   * @returns {Promise<Object>} Player statistics object
   * @throws {Error} When database query fails or wallet address is invalid
   *
   * @example
   * ```javascript
   * // Get player statistics
   * const stats = await MinigameService.getPlayerStats('0x123...');
   * console.log(`Total games: ${stats.totalGames}`);
   * console.log(`Total XP: ${stats.totalXP}`);
   * console.log(`Best flappy fish score: ${stats.bestScores.flappy_fish}`);
   * ```
   */
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
        totalXP: data.reduce(
          (sum, session) => sum + (session.xp_earned || 0),
          0
        ),
        averageScore:
          data.length > 0
            ? data.reduce((sum, session) => sum + (session.score || 0), 0) /
              data.length
            : 0,
        gamesByType: {},
        bestScores: {},
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

  /**
   * Get leaderboard for a specific game type
   *
   * Retrieves the top players for a specific game type, sorted by score.
   *
   * @static
   * @async
   * @param {string} gameType - Type of minigame to get leaderboard for
   * @param {number} [limit=10] - Maximum number of players to return
   * @returns {Promise<Array>} Array of leaderboard entries
   * @throws {Error} When database query fails or game type is invalid
   *
   * @example
   * ```javascript
   * // Get top 5 flappy fish players
   * const leaderboard = await MinigameService.getLeaderboard('flappy_fish', 5);
   * leaderboard.forEach((entry, index) => {
   *   console.log(`${index + 1}. ${entry.player_wallet}: ${entry.score}`);
   * });
   * ```
   */
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

  /**
   * Get global leaderboard across all games
   *
   * Retrieves the top players across all minigames, ranked by total XP earned.
   *
   * @static
   * @async
   * @param {number} [limit=20] - Maximum number of players to return
   * @returns {Promise<Array>} Array of global leaderboard entries
   * @throws {Error} When database query fails
   *
   * @example
   * ```javascript
   * // Get top 10 players globally
   * const globalLeaderboard = await MinigameService.getGlobalLeaderboard(10);
   * globalLeaderboard.forEach((player, index) => {
   *   console.log(`${index + 1}. ${player.player_wallet}: ${player.total_xp} XP`);
   * });
   * ```
   */
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

  /**
   * Mark session as synced to blockchain
   *
   * Marks a game session as successfully synchronized with the blockchain,
   * updating the sync timestamp.
   *
   * @static
   * @async
   * @param {string} sessionId - The unique identifier of the game session
   * @returns {Promise<Object>} Updated session object
   * @throws {Error} When database update fails or session ID is invalid
   *
   * @example
   * ```javascript
   * // Mark session as synced
   * const session = await MinigameService.markSessionSynced('session_123');
   * console.log(`Session synced at ${session.synced_at}`);
   * ```
   */
  static async markSessionSynced(sessionId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.MINIGAME_SESSIONS)
        .update({
          synced_to_chain: true,
          synced_at: new Date().toISOString(),
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

  /**
   * Get unsynced sessions for blockchain sync
   *
   * Retrieves all completed game sessions that haven't been synchronized
   * with the blockchain yet.
   *
   * @static
   * @async
   * @returns {Promise<Array>} Array of unsynced session objects
   * @throws {Error} When database query fails
   *
   * @example
   * ```javascript
   * // Get sessions ready for blockchain sync
   * const unsyncedSessions = await MinigameService.getUnsyncedSessions();
   * console.log(`${unsyncedSessions.length} sessions need blockchain sync`);
   * ```
   */
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

  /**
   * Award bonus XP for achievements
   *
   * Creates a special session record for bonus XP earned through achievements
   * or special events.
   *
   * @static
   * @async
   * @param {string} playerWallet - The player's wallet address
   * @param {string} achievement - The achievement type or description
   * @param {number} bonusXP - The bonus XP amount to award
   * @returns {Promise<Object>} Created bonus XP session object
   * @throws {Error} When database insert fails or invalid parameters provided
   *
   * @example
   * ```javascript
   * // Award bonus XP for achievement
   * const bonusSession = await MinigameService.awardBonusXP('0x123...', 'first_win', 100);
   * console.log(`Awarded ${bonusSession.xp_earned} bonus XP for ${bonusSession.achievement_type}`);
   * ```
   */
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
          ended_at: new Date().toISOString(),
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
