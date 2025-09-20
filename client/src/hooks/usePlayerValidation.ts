import { usePlayer } from './dojo/usePlayer';
import { ApiClient, API_CONFIG, buildApiUrl } from '@/config/api';
import { useCallback, useState } from 'react';
import { BackendPlayerData, OnChainPlayerData, ApiResponse, RequestData } from '@/types';

interface PlayerValidationResult {
  exists: boolean;
  isOnChain: boolean;
  isInBackend: boolean;
  playerData?: OnChainPlayerData;
  backendData?: BackendPlayerData;
}

export const usePlayerValidation = () => {
  const { getPlayer } = usePlayer();
  const [isValidating, setIsValidating] = useState(false);

  const validatePlayer = useCallback(
    async (walletAddress: string): Promise<PlayerValidationResult> => {
      setIsValidating(true);

      try {
        // Check on-chain first (using existing usePlayer hook)
        let onChainPlayer: OnChainPlayerData | undefined;

        try {
          onChainPlayer = await getPlayer(walletAddress);
        } catch (error) {
          // Player not found on-chain, continue with backend check
          console.debug('Player not found on-chain:', error);
          // Could add specific error handling for different error types
        }

        // Check backend (using our API)
        let backendPlayer: BackendPlayerData | undefined;

        try {
          const url = buildApiUrl(API_CONFIG.ENDPOINTS.PLAYERS.GET_BY_WALLET, {
            walletAddress,
          });
          const response =
            await ApiClient.get<ApiResponse<BackendPlayerData>>(url);
          backendPlayer = response.data;
        } catch (error) {
          // Player not found in backend, continue with validation
          console.debug('Player not found in backend:', error);
          // Could add specific error handling for different error types
        }

        // Determine if player exists
        const isOnChain = Boolean(onChainPlayer?.id);
        const isInBackend = Boolean(backendPlayer?.id);
        const exists = isOnChain || isInBackend;

        return {
          exists,
          isOnChain,
          isInBackend,
          playerData: onChainPlayer,
          backendData: backendPlayer,
        };
      } catch (error) {
        console.error('Player validation failed:', error);
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

  const syncPlayerToBackend = useCallback(
    async (onChainPlayer: OnChainPlayerData, walletAddress: string) => {
      try {
        // If player exists on-chain but not in backend, create backend entry
        const playerId = onChainPlayer.id || walletAddress;
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
