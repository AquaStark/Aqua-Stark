import { useState } from 'react';
import { ENV_CONFIG } from '@/config/environment';

const API_URL = ENV_CONFIG.API_URL;

/**
 * Hook for synchronizing fish data between blockchain and backend
 */
export const useFishSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Sync fish to backend after blockchain creation
   * @param fishId - The fish ID (same as on_chain_id)
   * @param playerId - The player ID (wallet address)
   * @param onChainId - The on-chain fish ID from blockchain
   * @param species - The species name (e.g., 'NeonTetra', 'Corydoras')
   */
  const syncFish = async (
    fishId: string,
    playerId: string,
    onChainId: string,
    species: string
  ) => {
    try {
      setIsSyncing(true);
      console.log('💾 Syncing fish to backend:', {
        fishId,
        playerId,
        onChainId,
        species,
      });

      const response = await fetch(`${API_URL}/v1/fish/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fishId, playerId, onChainId, species }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sync fish: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Fish synced to backend:', result);
      return result;
    } catch (error) {
      console.error('❌ Error syncing fish:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Get all fish for a player from backend
   * @param playerId - The player ID (wallet address)
   */
  const getPlayerFish = async (playerId: string) => {
    try {
      console.log('🐟 Fetching player fish from backend:', playerId);

      const response = await fetch(`${API_URL}/v1/fish/player/${playerId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch player fish: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Player fish from backend:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching player fish:', error);
      throw error;
    }
  };

  return { syncFish, getPlayerFish, isSyncing };
};
