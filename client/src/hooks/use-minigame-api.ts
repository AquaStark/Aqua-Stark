import { useCallback, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { API_CONFIG, buildApiUrl } from '@/config/api';
import { useApi } from './use-api';

// Game type mapping from frontend to backend
const GAME_TYPE_MAP: Record<string, string> = {
  'floppy-fish': 'floppy_fish',
  'bubble-jumper': 'bubble_jumper',
  'fish-dodge': 'fish_dodge',
};

export interface GameSession {
  session_id: string;
  player_wallet: string;
  game_type: string;
  score: number;
  xp_earned: number;
  created_at: string;
  ended_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  player_wallet: string;
  player_id?: string;
  best_score?: number;
  total_score?: number;
}

export interface PlayerStats {
  totalGames: number;
  totalXP: number;
  averageScore: number;
  gamesByType: Record<string, number>;
  bestScores: Record<string, number>;
}

export interface GameType {
  id: string;
  name: string;
  description: string;
  baseXP: number;
  difficulty: string;
}

/**
 * Hook for interacting with minigame API
 * Handles game sessions, score submission, and leaderboards
 */
export function useMinigameApi() {
  const { account } = useAccount();
  const { get, post, put, loading, error } = useApi();
  const [currentSession, setCurrentSession] = useState<GameSession | null>(
    null
  );

  /**
   * Map frontend game type to backend game type
   */
  const mapGameType = useCallback((gameType: string): string => {
    return GAME_TYPE_MAP[gameType] || gameType;
  }, []);

  /**
   * Create a new game session
   */
  const createGameSession = useCallback(
    async (gameType: string): Promise<GameSession> => {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }

      const backendGameType = mapGameType(gameType);
      const url = API_CONFIG.ENDPOINTS.MINIGAMES.SESSIONS;

      const response = await post<{ success: boolean; data: GameSession }>(
        url,
        {
          gameType: backendGameType,
        },
        {
          headers: {
            'x-wallet-address': account.address,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to create game session');
      }

      const session = response.data.data;
      setCurrentSession(session);
      return session;
    },
    [account, post, mapGameType]
  );

  /**
   * End game session and submit final score
   */
  const endGameSession = useCallback(
    async (
      sessionId: string,
      finalScore: number,
      gameType: string
    ): Promise<GameSession> => {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }

      const backendGameType = mapGameType(gameType);
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.MINIGAMES.END_SESSION, {
        sessionId,
      });

      const response = await put<{ success: boolean; data: GameSession }>(
        url,
        {
          finalScore,
          gameType: backendGameType,
        },
        {
          headers: {
            'x-wallet-address': account.address,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to end game session');
      }

      const session = response.data.data;
      setCurrentSession(null);
      return session;
    },
    [account, put, mapGameType]
  );

  /**
   * Submit score without creating a session (simpler flow)
   */
  const submitScore = useCallback(
    async (gameType: string, score: number): Promise<GameSession> => {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }

      // Create session, then immediately end it
      const session = await createGameSession(gameType);
      return await endGameSession(session.session_id, score, gameType);
    },
    [account, createGameSession, endGameSession]
  );

  /**
   * Get leaderboard for a specific game type
   */
  const getGameLeaderboard = useCallback(
    async (
      gameType: string,
      limit: number = 10
    ): Promise<LeaderboardEntry[]> => {
      const backendGameType = mapGameType(gameType);
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.MINIGAMES.GAME_LEADERBOARD, {
        gameType: backendGameType,
      });

      const response = await get<{
        success: boolean;
        data: LeaderboardEntry[];
      }>(`${url}?limit=${limit}`);

      if (!response.data.success) {
        throw new Error('Failed to get leaderboard');
      }

      return response.data.data;
    },
    [get, mapGameType]
  );

  /**
   * Get global leaderboard (sum of all game scores)
   */
  const getGlobalLeaderboard = useCallback(
    async (limit: number = 20): Promise<LeaderboardEntry[]> => {
      const url = API_CONFIG.ENDPOINTS.MINIGAMES.GLOBAL_LEADERBOARD;

      const response = await get<{
        success: boolean;
        data: LeaderboardEntry[];
      }>(`${url}?limit=${limit}`);

      if (!response.data.success) {
        throw new Error('Failed to get global leaderboard');
      }

      return response.data.data;
    },
    [get]
  );

  /**
   * Get player statistics
   */
  const getPlayerStats = useCallback(async (): Promise<PlayerStats> => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    const url = API_CONFIG.ENDPOINTS.MINIGAMES.PLAYER_STATS;

    const response = await get<{ success: boolean; data: PlayerStats }>(
      `${url}?wallet=${account.address}`
    );

    if (!response.data.success) {
      throw new Error('Failed to get player stats');
    }

    return response.data.data;
  }, [account, get]);

  /**
   * Get available game types
   */
  const getGameTypes = useCallback(async (): Promise<GameType[]> => {
    const url = API_CONFIG.ENDPOINTS.MINIGAMES.GAME_TYPES;

    const response = await get<{ success: boolean; data: GameType[] }>(url);

    if (!response.data.success) {
      throw new Error('Failed to get game types');
    }

    return response.data.data;
  }, [get]);

  return {
    // State
    currentSession,
    loading,
    error,

    // Actions
    createGameSession,
    endGameSession,
    submitScore,
    getGameLeaderboard,
    getGlobalLeaderboard,
    getPlayerStats,
    getGameTypes,

    // Utilities
    mapGameType,
  };
}
