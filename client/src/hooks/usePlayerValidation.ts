import { usePlayer } from './dojo/usePlayer';
import { ApiClient, API_CONFIG, buildApiUrl } from '@/constants';
import { useCallback, useState } from 'react';
import { BackendPlayerData, OnChainPlayerData } from '@/types';
import type { ApiResponse, RequestData } from '@/types/api-types';

/**
 * Represents the result of a player validation check.
 */
interface PlayerValidationResult {
  /** Whether the player exists in either on-chain or backend systems */
  exists: boolean;
  /** Whether the player exists on-chain */
  isOnChain: boolean;
  /** Whether the player exists in the backend database */
  isInBackend: boolean;
  /** On-chain player data if found */
  playerData?: OnChainPlayerData;
  /** Backend player data if found */
  backendData?: BackendPlayerData;
}

/**
 * Custom hook for validating and synchronizing player data across on-chain and backend systems.
 *
 * This hook provides functionality to:
 * - Check if a player exists on-chain (via Starknet contracts)
 * - Check if a player exists in the backend database
 * - Create a new backend player record
 * - Synchronize on-chain player data to the backend
 *
 * It's primarily used during player onboarding or authentication flows to ensure
 * data consistency between blockchain and server-side storage.
 *
 * @returns {{
 *   validatePlayer: (walletAddress: string) => Promise<PlayerValidationResult>;
 *   createBackendPlayer: (playerId: string, walletAddress: string, username?: string) => Promise<BackendPlayerData>;
 *   syncPlayerToBackend: (onChainPlayer: OnChainPlayerData, walletAddress: string) => Promise<BackendPlayerData>;
 *   isValidating: boolean;
 * }} An object containing validation functions and state.
 *
 * @example
 * ```tsx
 * const { validatePlayer, syncPlayerToBackend, isValidating } = usePlayerValidation();
 *
 * const handlePlayerLogin = async (address: string) => {
 *   const validation = await validatePlayer(address);
 *
 *   if (validation.isOnChain && !validation.isInBackend) {
 *     await syncPlayerToBackend(validation.playerData!, address);
 *   }
 * };
 * ```
 */
export const usePlayerValidation = () => {
  const { getPlayer } = usePlayer();
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validates a player by checking both on-chain and backend systems.
   *
   * @param {string} walletAddress - The wallet address to validate.
   * @returns {Promise<PlayerValidationResult>} The validation result containing existence flags and player data.
   */
  const validatePlayer = useCallback(
    async (walletAddress: string): Promise<PlayerValidationResult> => {
      console.log('🔍 validatePlayer called with:', walletAddress);
      setIsValidating(true);

      try {
        // Check on-chain first (using existing usePlayer hook)
        let onChainPlayer: OnChainPlayerData | undefined;

        try {
          console.log('📡 Calling getPlayer...');
          onChainPlayer = await getPlayer(walletAddress);
          console.log('📦 getPlayer returned:', onChainPlayer);
        } catch (error) {
          // Player not found on-chain, continue with backend check
          console.log('❌ Player not found on-chain:', error);
          // Could add specific error handling for different error types
        }

        // Check backend (using our API)
        let backendPlayer: BackendPlayerData | undefined;

        try {
          console.log('📡 Checking backend...');
          const url = buildApiUrl(API_CONFIG.ENDPOINTS.PLAYERS.GET_BY_WALLET, {
            walletAddress,
          });
          const response =
            await ApiClient.get<ApiResponse<BackendPlayerData>>(url);
          backendPlayer = response.data;
          console.log('📦 Backend returned:', backendPlayer);
        } catch (error) {
          // Player not found in backend, continue with validation
          console.log('❌ Player not found in backend:', error);
          // Could add specific error handling for different error types
        }

        // Determine if player exists
        const isOnChain = Boolean(onChainPlayer?.id);
        const isInBackend = Boolean(backendPlayer?.id);
        const exists = isOnChain || isInBackend;

        console.log('🎯 Validation computed:', {
          onChainPlayerId: onChainPlayer?.id,
          backendPlayerId: backendPlayer?.id,
          isOnChain,
          isInBackend,
          exists
        });

        return {
          exists,
          isOnChain,
          isInBackend,
          playerData: onChainPlayer,
          backendData: backendPlayer,
        };
      } catch (error) {
        console.error('❌ Player validation failed:', error);
        // Could add user notification for validation failures
        return {
          exists: false,
          isOnChain: false,
          isInBackend: false,
        };
      } finally {
        setIsValidating(false);
      }
    },
    [getPlayer]
  );

  /**
   * Creates a new player record in the backend database.
   *
   * @param {string} playerId - The unique player identifier (typically from on-chain).
   * @param {string} walletAddress - The player's wallet address.
   * @param {string} [username] - Optional username for the player.
   * @returns {Promise<BackendPlayerData>} The created backend player data.
   * @throws {Error} If the creation request fails.
   */
  const createBackendPlayer = useCallback(
    async (playerId: string, walletAddress: string, username?: string) => {
      try {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PLAYERS.CREATE);
        const data: RequestData = {
          playerId,
          walletAddress,
          username,
        };

        const response = await ApiClient.post<ApiResponse<BackendPlayerData>>(
          url,
          data
        );
        return response.data;
      } catch (error) {
        console.error('Backend player creation failed:', error);
        // Could add user notification for creation failures
        throw error;
      }
    },
    []
  );

  /**
   * Synchronizes an on-chain player to the backend database.
   *
   * If the player exists on-chain but not in the backend, this function
   * creates a corresponding backend record using the on-chain data.
   *
   * @param {OnChainPlayerData} onChainPlayer - The on-chain player data to sync.
   * @param {string} walletAddress - The player's wallet address.
   * @returns {Promise<BackendPlayerData>} The created backend player data.
   * @throws {Error} If the synchronization fails.
   */
  const syncPlayerToBackend = useCallback(
    async (onChainPlayer: OnChainPlayerData, walletAddress: string) => {
      try {
        // If player exists on-chain but not in backend, create backend entry
        // Convert BigInt to string if necessary
        const playerId = onChainPlayer.id 
          ? (typeof onChainPlayer.id === 'bigint' ? onChainPlayer.id.toString() : onChainPlayer.id.toString())
          : walletAddress;
        const username = onChainPlayer.username || `Player_${playerId}`;

        return await createBackendPlayer(playerId, walletAddress, username);
      } catch (error) {
        console.error('Player backend sync failed:', error);
        // Could add user notification for sync failures
        throw error;
      }
    },
    [createBackendPlayer]
  );

  return {
    validatePlayer,
    createBackendPlayer,
    syncPlayerToBackend,
    isValidating,
  };
};
