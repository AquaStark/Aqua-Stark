import { useState } from 'react';
import { ENV_CONFIG } from '@/config/environment';

const API_URL = ENV_CONFIG.API_URL;

/**
 * Hook for synchronizing aquarium data between blockchain and backend
 */
export const useAquariumSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Sync aquarium to backend after blockchain creation
   * @param aquariumId - The aquarium ID (same as on_chain_id)
   * @param playerId - The player ID (wallet address)
   * @param onChainId - The on-chain aquarium ID from blockchain
   */
  const syncAquarium = async (
    aquariumId: string,
    playerId: string,
    onChainId: string
  ) => {
    try {
      setIsSyncing(true);
      console.log('💾 Syncing aquarium to backend:', {
        aquariumId,
        playerId,
        onChainId,
      });

      const response = await fetch(`${API_URL}/v1/aquariums/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aquariumId, playerId, onChainId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync aquarium: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Aquarium synced to backend:', result);
      return result;
    } catch (error) {
      console.error('❌ Error syncing aquarium:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Get all aquariums for a player from backend
   * @param playerId - The player ID (wallet address)
   */
  const getPlayerAquariums = async (playerId: string) => {
    try {
      console.log('🏠 Fetching player aquariums from backend:', playerId);

      const response = await fetch(
        `${API_URL}/v1/aquariums/player/${playerId}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch player aquariums: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log('✅ Player aquariums from backend:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching player aquariums:', error);
      throw error;
    }
  };

  return { syncAquarium, getPlayerAquariums, isSyncing };
};
