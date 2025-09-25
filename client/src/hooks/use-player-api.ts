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

/**
 * Player data interface representing a game player
 */
export interface Player {
  /** Unique player identifier */
  id: string;
  /** Player's chosen username */
  username: string;
  /** Player's blockchain wallet address */
  walletAddress: string;
  /** Player's total experience points */
  experience: number;
  /** Player's current level */
  level: number;
  /** Player's currency amount */
  coins: number;
  /** ISO string of last login timestamp */
  lastLogin: string;
  /** ISO string of account creation timestamp */
  createdAt: string;
}

/**
 * Player statistics interface for game progress tracking
 */
export interface PlayerStats {
  /** Total number of fish owned by player */
  totalFish: number;
  /** Total number of decorations owned */
  totalDecorations: number;
  /** Current aquarium level */
  aquariumLevel: number;
  /** Array of achievement IDs earned by player */
  achievements: string[];
}

/**
 * Generic API response wrapper for player-related endpoints
 * @template T - Type of the data payload
 */
export interface PlayerApiResponse<T> {
  /** Response payload data */
  data: T;
  /** Whether the API call was successful */
  success: boolean;
  /** Optional message for additional context */
  message?: string;
}

/**
 * Hook for player-related API operations using the unified useApi hook.
 *
 * This hook provides a centralized interface for all player-related API calls,
 * including fetching player data, updating statistics, managing currency,
 * and handling experience points. It integrates with the notification system
 * to provide user feedback and uses caching for improved performance.
 *
 * Features:
 * - Automatic error handling with user notifications
 * - Response caching for improved performance
 * - Success notifications for update operations
 * - Type-safe API responses
 * - Unified loading and error states
 *
 * @returns Object containing player API methods and state
 *
 * @example
 * Basic player data operations:
 * ```tsx
 * const {
 *   getPlayer,
 *   updatePlayerExperience,
 *   updatePlayerCurrency,
 *   loading,
 *   error
 * } = usePlayerApi();
 *
 * // Fetch player data
 * const handleFetchPlayer = async (playerId: string) => {
 *   try {
 *     const player = await getPlayer(playerId);
 *     console.log('Player data:', player);
 *   } catch (error) {
 *     // Error is already shown to user via notifications
 *     console.error('Failed to fetch player:', error);
 *   }
 * };
 *
 * // Update player experience
 * const handleLevelUp = async (playerId: string) => {
 *   const updatedPlayer = await updatePlayerExperience(playerId, 100);
 * };
 * ```
 *
 * @example
 * Player creation and wallet operations:
 * ```tsx
 * const {
 *   createPlayer,
 *   getPlayerByWallet,
 *   updateLastLogin
 * } = usePlayerApi();
 *
 * // Create new player account
 * const handleCreatePlayer = async (username: string, walletAddress: string) => {
 *   try {
 *     const newPlayer = await createPlayer({ username, walletAddress });
 *     console.log('New player created:', newPlayer);
 *   } catch (error) {
 *     console.error('Player creation failed:', error);
 *   }
 * };
 *
 * // Find player by wallet
 * const handleWalletLogin = async (walletAddress: string) => {
 *   const player = await getPlayerByWallet(walletAddress);
 *   await updateLastLogin(player.id);
 * };
 * ```
 *
 * @example
 * Statistics and achievements management:
 * ```tsx
 * const {
 *   getPlayerStats,
 *   updatePlayerStats,
 *   updatePlayerCurrency
 * } = usePlayerApi();
 *
 * // Update player achievements
 * const handleNewAchievement = async (playerId: string, achievementId: string) => {
 *   const currentStats = await getPlayerStats(playerId);
 *   const updatedStats = await updatePlayerStats(playerId, {
 *     achievements: [...currentStats.achievements, achievementId]
 *   });
 * };
 *
 * // Handle fish purchase
 * const handleFishPurchase = async (playerId: string, cost: number) => {
 *   const currentStats = await getPlayerStats(playerId);
 *   await Promise.all([
 *     updatePlayerCurrency(playerId, -cost), // Deduct cost
 *     updatePlayerStats(playerId, {
 *       totalFish: currentStats.totalFish + 1
 *     })
 *   ]);
 * };
 * ```
 *
 * @example
 * Loading states and error handling:
 * ```tsx
 * const { getPlayer, loading, error, clearError } = usePlayerApi();
 *
 * const PlayerProfile = ({ playerId }: { playerId: string }) => {
 *   const [player, setPlayer] = useState<Player | null>(null);
 *
 *   useEffect(() => {
 *     const fetchPlayer = async () => {
 *       try {
 *         const playerData = await getPlayer(playerId);
 *         setPlayer(playerData);
 *       } catch (error) {
 *         // Error handling is automatic
 *       }
 *     };
 *
 *     fetchPlayer();
 *   }, [playerId]);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} onRetry={clearError} />;
 *   if (!player) return <div>No player data found</div>;
 *
 *   return <PlayerCard player={player} />;
 * };
 * ```
 */
export function usePlayerApi() {
  const { get, post, put, loading, error, clearError } = useApi({
    baseURL: '/api/players', // Player-specific base URL
    cacheTTL: 2 * 60 * 1000, // 2 minutes cache for player data
  });

  const { success, error: showError } = useNotifications();

  /**
   * Fetch player data by unique player ID.
   * Results are cached for improved performance on repeated calls.
   *
   * @param playerId - Unique identifier of the player to fetch
   * @returns Promise resolving to player data
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * const player = await getPlayer('player-123');
   * console.log(`Player: ${player.username}, Level: ${player.level}`);
   * ```
   */
  const getPlayer = useCallback(
    async (playerId: string): Promise<Player> => {
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
    },
    [get, showError]
  );

  /**
   * Fetch player data by blockchain wallet address.
   * Useful for wallet-based authentication and login systems.
   *
   * @param walletAddress - Blockchain wallet address to lookup
   * @returns Promise resolving to player data
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * const player = await getPlayerByWallet('0x742d35cc6cd34c1234abcd...');
   * console.log(`Welcome back, ${player.username}!`);
   * ```
   */
  const getPlayerByWallet = useCallback(
    async (walletAddress: string): Promise<Player> => {
      try {
        const response = await get<PlayerApiResponse<Player>>(
          `/wallet/${walletAddress}`
        );

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch player');
        }

        return response.data.data;
      } catch (err) {
        showError('Failed to fetch player by wallet address');
        throw err;
      }
    },
    [get, showError]
  );

  /**
   * Create a new player account.
   * Shows success notification upon successful creation.
   *
   * @param playerData - New player information
   * @param playerData.username - Desired username for the new player
   * @param playerData.walletAddress - Blockchain wallet address to associate
   * @returns Promise resolving to created player data
   * @throws Error if username taken, invalid wallet, or API call fails
   *
   * @example
   * ```tsx
   * const newPlayer = await createPlayer({
   *   username: 'FishMaster2024',
   *   walletAddress: '0x742d35cc6cd34c1234abcd...'
   * });
   * console.log(`Created player: ${newPlayer.id}`);
   * ```
   */
  const createPlayer = useCallback(
    async (playerData: {
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
    },
    [post, success, showError]
  );

  /**
   * Update player's experience points.
   * Can be used for both adding and subtracting experience.
   * Shows success notification upon successful update.
   *
   * @param playerId - ID of the player to update
   * @param experience - New experience value (not delta)
   * @returns Promise resolving to updated player data
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * // Award experience for completing a quest
   * const currentPlayer = await getPlayer('player-123');
   * const updatedPlayer = await updatePlayerExperience(
   *   'player-123',
   *   currentPlayer.experience + 50
   * );
   * ```
   */
  const updatePlayerExperience = useCallback(
    async (playerId: string, experience: number): Promise<Player> => {
      try {
        const response = await put<PlayerApiResponse<Player>>(
          `/${playerId}/experience`,
          { experience }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Failed to update experience'
          );
        }

        success('Experience updated successfully!');
        return response.data.data;
      } catch (err) {
        showError('Failed to update player experience');
        throw err;
      }
    },
    [put, success, showError]
  );

  /**
   * Update player's currency/coins.
   * Can be used for both spending and earning currency.
   * Shows success notification upon successful update.
   *
   * @param playerId - ID of the player to update
   * @param coins - New coin amount (not delta)
   * @returns Promise resolving to updated player data
   * @throws Error if player not found, insufficient funds, or API call fails
   *
   * @example
   * ```tsx
   * // Deduct coins for a purchase
   * const currentPlayer = await getPlayer('player-123');
   * const updatedPlayer = await updatePlayerCurrency(
   *   'player-123',
   *   currentPlayer.coins - 100
   * );
   * ```
   */
  const updatePlayerCurrency = useCallback(
    async (playerId: string, coins: number): Promise<Player> => {
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
    },
    [put, success, showError]
  );

  /**
   * Fetch player statistics including game progress and achievements.
   * Results are cached for improved performance.
   *
   * @param playerId - ID of the player whose stats to fetch
   * @returns Promise resolving to player statistics
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * const stats = await getPlayerStats('player-123');
   * console.log(`Player has ${stats.totalFish} fish and ${stats.achievements.length} achievements`);
   * ```
   */
  const getPlayerStats = useCallback(
    async (playerId: string): Promise<PlayerStats> => {
      try {
        const response = await get<PlayerApiResponse<PlayerStats>>(
          `/${playerId}/stats`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Failed to fetch player stats'
          );
        }

        return response.data.data;
      } catch (err) {
        showError('Failed to fetch player statistics');
        throw err;
      }
    },
    [get, showError]
  );

  /**
   * Update player statistics with partial data.
   * Only provided fields will be updated, others remain unchanged.
   * Shows success notification upon successful update.
   *
   * @param playerId - ID of the player to update
   * @param stats - Partial stats object with fields to update
   * @returns Promise resolving to updated player statistics
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * // Update just the aquarium level
   * const updatedStats = await updatePlayerStats('player-123', {
   *   aquariumLevel: 5
   * });
   *
   * // Add a new achievement
   * const currentStats = await getPlayerStats('player-123');
   * const updatedStats = await updatePlayerStats('player-123', {
   *   achievements: [...currentStats.achievements, 'first_fish_caught']
   * });
   * ```
   */
  const updatePlayerStats = useCallback(
    async (
      playerId: string,
      stats: Partial<PlayerStats>
    ): Promise<PlayerStats> => {
      try {
        const response = await put<PlayerApiResponse<PlayerStats>>(
          `/${playerId}/stats`,
          stats
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Failed to update player stats'
          );
        }

        success('Player statistics updated successfully!');
        return response.data.data;
      } catch (err) {
        showError('Failed to update player statistics');
        throw err;
      }
    },
    [put, success, showError]
  );

  /**
   * Update the player's last login timestamp to current time.
   * Useful for tracking player activity and login streaks.
   * Does not show notification to avoid spam on every login.
   *
   * @param playerId - ID of the player to update
   * @returns Promise resolving to updated player data
   * @throws Error if player not found or API call fails
   *
   * @example
   * ```tsx
   * // Update login time when player connects wallet
   * await updateLastLogin('player-123');
   * ```
   */
  const updateLastLogin = useCallback(
    async (playerId: string): Promise<Player> => {
      try {
        const response = await put<PlayerApiResponse<Player>>(
          `/${playerId}/login`,
          { lastLogin: new Date().toISOString() }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || 'Failed to update last login'
          );
        }

        return response.data.data;
      } catch (err) {
        showError('Failed to update last login time');
        throw err;
      }
    },
    [put, showError]
  );

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
