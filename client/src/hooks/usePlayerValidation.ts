import { usePlayer } from '@/hooks/dojo/usePlayer';
import { ApiClient, API_CONFIG, buildApiUrl } from '@/config/api';
import { useCallback, useState } from 'react';

interface PlayerValidationResult {
  exists: boolean;
  isOnChain: boolean;
  isInBackend: boolean;
  playerData?: any;
  backendData?: any;
}

export const usePlayerValidation = () => {
  const { getPlayer } = usePlayer();
  const [isValidating, setIsValidating] = useState(false);

  const validatePlayer = useCallback(
    async (walletAddress: string): Promise<PlayerValidationResult> => {
      setIsValidating(true);

      try {
        // Check on-chain first (using existing usePlayer hook)
        let onChainPlayer = null;

        try {
          onChainPlayer = await getPlayer(walletAddress);
        } catch (error) {
          console.log('Player not found on-chain:', error);
        }

        // Check backend (using our API)
        let backendPlayer = null;

        try {
          const url = buildApiUrl(API_CONFIG.ENDPOINTS.PLAYERS.GET_BY_WALLET, {
            walletAddress,
          });
          const response = await ApiClient.get(url);
          backendPlayer = (response as any).data;
        } catch (error) {
          console.log('Player not found in backend:', error);
        }

        // Determine if player exists
        const isOnChain = onChainPlayer && onChainPlayer.id > 0;
        const isInBackend = backendPlayer && backendPlayer.player_id;
        const exists = isOnChain || isInBackend;

        return {
          exists,
          isOnChain,
          isInBackend,
          playerData: onChainPlayer,
          backendData: backendPlayer,
        };
      } catch (error) {
        console.error('Error validating player:', error);
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
        const data = {
          playerId,
          walletAddress,
          username,
        };

        const response = await ApiClient.post(url, data);
        return (response as any).data;
      } catch (error) {
        console.error('Error creating backend player:', error);
        throw error;
      }
    },
    []
  );

  const syncPlayerToBackend = useCallback(
    async (onChainPlayer: any, walletAddress: string) => {
      try {
        // If player exists on-chain but not in backend, create backend entry
        const playerId = onChainPlayer.id?.toString() || walletAddress;
        const username = onChainPlayer.username || `Player_${playerId}`;

        return await createBackendPlayer(playerId, walletAddress, username);
      } catch (error) {
        console.error('Error syncing player to backend:', error);
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
