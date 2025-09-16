import { useCallback } from 'react';
import { useApi } from './use-api';
import { useNotifications } from './use-notifications';

/**
 * @file use-player-api.ts
 * @description
 * Example implementation showing how to use the unified useApi hook
 * to replace duplicated API logic in player-related operations.
 *
 * This demonstrates the integration of the new useApi hook with
 * existing functionality and shows how to centralize API calls.
 *
 * @category Hooks
 */

// Types for player API responses
export interface Player {
  id: string;
  username: string;
  walletAddress: string;
  experience: number;
  level: number;
  coins: number;
  lastLogin: string;
  createdAt: string;
}

export interface PlayerStats {
  totalFish: number;
  totalDecorations: number;
  aquariumLevel: number;
  achievements: string[];
}

export interface PlayerApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Hook for player-related API operations using the unified useApi hook
 *
 * @example
 * ```tsx
 * const {
 *   getPlayer,
 *   updatePlayerStats,
 *   getPlayerStats,
 *   loading,
 *   error
 * } = usePlayerApi();
 *
 * // Fetch player data
 * const player = await getPlayer('player-id');
 *
 * // Update player stats
 * await updatePlayerStats('player-id', { experience: 100 });
 * ```
 */
export function usePlayerApi() {
  const { get, post, put, loading, error, clearError } = useApi({
    baseURL: '/api/players', // Player-specific base URL
    cacheTTL: 2 * 60 * 1000, // 2 minutes cache for player data
  });

  const { success, error: showError } = useNotifications();

  /**
   * Get player by ID
   */
  const getPlayer = useCallback(async (playerId: string): Promise<Player> => {
    try {
      const response = await get<PlayerApiResponse<Player>>(`/${playerId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch player');
      }

      return response.data.data;
    } catch (err) {
      showError('Failed to fetch player data');
      throw err;
    }
  }, [get, showError]);

  /**
   * Get player by wallet address
   */
  const getPlayerByWallet = useCallback(async (walletAddress: string): Promise<Player> => {
    try {
      const response = await get<PlayerApiResponse<Player>>(`/wallet/${walletAddress}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch player');
      }

      return response.data.data;
    } catch (err) {
      showError('Failed to fetch player by wallet address');
      throw err;
    }
  }, [get, showError]);

  /**
   * Create a new player
   */
  const createPlayer = useCallback(async (playerData: {
    username: string;
    walletAddress: string;
  }): Promise<Player> => {
    try {
      const response = await post<PlayerApiResponse<Player>>('/', playerData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create player');
      }

      success('Player created successfully!');
      return response.data.data;
    } catch (err) {
      showError('Failed to create player');
      throw err;
    }
  }, [post, success, showError]);

  /**
   * Update player experience
   */
  const updatePlayerExperience = useCallback(async (
    playerId: string,
    experience: number
  ): Promise<Player> => {
    try {
      const response = await put<PlayerApiResponse<Player>>(
        `/${playerId}/experience`,
        { experience }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update experience');
      }

      success('Experience updated successfully!');
      return response.data.data;
    } catch (err) {
      showError('Failed to update player experience');
      throw err;
    }
  }, [put, success, showError]);

  /**
   * Update player currency
   */
  const updatePlayerCurrency = useCallback(async (
    playerId: string,
    coins: number
  ): Promise<Player> => {
    try {
      const response = await put<PlayerApiResponse<Player>>(
        `/${playerId}/currency`,
        { coins }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update currency');
      }

      success('Currency updated successfully!');
      return response.data.data;
    } catch (err) {
      showError('Failed to update player currency');
      throw err;
    }
  }, [put, success, showError]);

  /**
   * Get player statistics
   */
  const getPlayerStats = useCallback(async (playerId: string): Promise<PlayerStats> => {
    try {
      const response = await get<PlayerApiResponse<PlayerStats>>(`/${playerId}/stats`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch player stats');
      }

      return response.data.data;
    } catch (err) {
      showError('Failed to fetch player statistics');
      throw err;
    }
  }, [get, showError]);

  /**
   * Update player statistics
   */
  const updatePlayerStats = useCallback(async (
    playerId: string,
    stats: Partial<PlayerStats>
  ): Promise<PlayerStats> => {
    try {
      const response = await put<PlayerApiResponse<PlayerStats>>(
        `/${playerId}/stats`,
        stats
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update player stats');
      }

      success('Player statistics updated successfully!');
      return response.data.data;
    } catch (err) {
      showError('Failed to update player statistics');
      throw err;
    }
  }, [put, success, showError]);

  /**
   * Update last login time
   */
  const updateLastLogin = useCallback(async (playerId: string): Promise<Player> => {
    try {
      const response = await put<PlayerApiResponse<Player>>(
        `/${playerId}/login`,
        { lastLogin: new Date().toISOString() }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update last login');
      }

      return response.data.data;
    } catch (err) {
      showError('Failed to update last login time');
      throw err;
    }
  }, [put, showError]);

  return {
    // API methods
    getPlayer,
    getPlayerByWallet,
    createPlayer,
    updatePlayerExperience,
    updatePlayerCurrency,
    getPlayerStats,
    updatePlayerStats,
    updateLastLogin,

    // State from useApi
    loading,
    error,
    clearError,
  };
}

export default usePlayerApi;
