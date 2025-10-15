/**
 * @file use-dirt-system-realistic.ts
 * @description
 * Custom hook for a realistic dirt simulation system in an aquarium.
 * It manages the state of dirt spots and cleanliness metrics by synchronizing
 * with a backend API, which handles the time-based accumulation of dirt.
 *
 * This hook is designed to provide persistent, server-side game state for the
 * aquarium's cleanliness, ensuring a consistent experience across sessions.
 *
 * @category Hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { DirtSpot, DirtType } from '@/constants';

// API base URL - adjust based on your backend configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * @typedef {Object} DirtSystemState
 * @property {DirtSpot[]} spots - An array of active dirt spots in the aquarium.
 * @property {number} dirtLevel - The current dirt level as a percentage (0-100).
 * @property {boolean} isDirty - True if the dirt level is above a certain threshold.
 * @property {boolean} needsCleaning - True if the aquarium is dirty enough to require cleaning.
 * @property {{ level: string, label: string, color: string }} cleanlinessStatus - A descriptive status object based on the current dirt level.
 * @property {string | null} lastCleaningTime - Timestamp of the last successful cleaning.
 * @property {number} cleaningStreak - The number of consecutive times the player has cleaned the aquarium.
 * @property {number} totalCleanings - The total number of cleanings performed.
 * @property {number} hoursSinceCleaning - The number of hours passed since the last cleaning.
 * @property {boolean} isLoading - True if the system is currently fetching data from the backend.
 * @property {string | null} error - A string containing the error message if a request fails.
 * @property {boolean} isSpongeMode - True if the visual "sponge" cleaning mode is active.
 */
interface DirtSystemState {
  spots: DirtSpot[];
  dirtLevel: number;
  isDirty: boolean;
  needsCleaning: boolean;
  cleanlinessStatus: {
    level: string;
    label: string;
    color: string;
  };
  lastCleaningTime: string | null;
  cleaningStreak: number;
  totalCleanings: number;
  hoursSinceCleaning: number;
  isLoading: boolean;
  error: string | null;
  isSpongeMode: boolean;
}

/**
 * @typedef {Object} UseDirtSystemRealisticOptions
 * @property {string} aquariumId - The unique identifier of the aquarium.
 * @property {string} playerId - The unique identifier of the player.
 * @property {string} [authToken] - Optional authentication token for API requests.
 * @property {boolean} [autoRefresh=true] - If true, the hook will periodically fetch updates from the backend.
 * @property {number} [refreshInterval=1800000] - The interval in milliseconds for auto-refresh. Defaults to 30 minutes.
 */
interface UseDirtSystemRealisticOptions {
  aquariumId: string;
  playerId: string;
  authToken?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds (default: 30 minutes)
}

/**
 * @function useDirtSystemRealistic
 * @description
 * Hook for a realistic dirt system based on backend time calculations.
 * It manages the state of dirt spots, cleanliness level, and cleaning statistics
 * by communicating with a backend API. This hook handles fetching the current
 * state, cleaning individual dirt spots, and initializing the system for new aquariums.
 *
 * @param {UseDirtSystemRealisticOptions} options - Configuration options for the hook.
 * @returns {{
 * spots: DirtSpot[],
 * dirtLevel: number,
 * isDirty: boolean,
 * needsCleaning: boolean,
 * cleanlinessStatus: { level: string, label: string, color: string },
 * lastCleaningTime: string | null,
 * cleaningStreak: number,
 * totalCleanings: number,
 * hoursSinceCleaning: number,
 * isLoading: boolean,
 * error: string | null,
 * isSpongeMode: boolean,
 * fetchDirtStatus: () => Promise<void>,
 * toggleSpongeMode: () => void,
 * cleanDirtSpot: (spotId: number) => Promise<any>,
 * removeDirtSpot: (spotId: number) => void,
 * initializeDirtSystem: (config?: any) => Promise<any>,
 * refresh: () => Promise<void>,
 * }} An object containing the current state and various action functions.
 */
export function useDirtSystemRealistic({
  aquariumId,
  playerId,
  authToken,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds for testing (30000 ms)
}: UseDirtSystemRealisticOptions) {
  const [state, setState] = useState<DirtSystemState>({
    spots: [],
    dirtLevel: 0,
    isDirty: false,
    needsCleaning: false,
    cleanlinessStatus: { level: 'clean', label: 'Clean', color: 'green' },
    lastCleaningTime: null,
    cleaningStreak: 0,
    totalCleanings: 0,
    hoursSinceCleaning: 0,
    isLoading: true,
    error: null,
    isSpongeMode: false,
  });

  /**
   * @function fetchDirtStatus
   * @description
   * Asynchronously fetches the current dirt status from the backend API.
   * Updates the hook's state with the latest cleanliness data and generates
   * dirt spots for rendering based on the new dirt level.
   */
  const fetchDirtStatus = useCallback(async () => {
    if (!aquariumId || !playerId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/dirt/aquarium/${aquariumId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dirt status');
      }

      const dirtData = result.data;

      setState(prev => {
        // Regenerate spots based on current dirt level
        // If dirt level decreased significantly, regenerate spots
        const shouldRegenerateSpots = 
          prev.spots.length === 0 || 
          Math.abs(dirtData.current_dirt_level - prev.dirtLevel) > 10;

        let newSpots = prev.spots;
        if (shouldRegenerateSpots) {
          newSpots = generateDirtSpotsFromLevel(dirtData.current_dirt_level);
        }

        return {
          ...prev,
          spots: newSpots,
          dirtLevel: dirtData.current_dirt_level,
          isDirty: dirtData.is_dirty,
          needsCleaning: dirtData.needs_cleaning,
          cleanlinessStatus: dirtData.cleanliness_status,
          lastCleaningTime: dirtData.last_cleaning_time,
          cleaningStreak: dirtData.cleaning_streak,
          totalCleanings: dirtData.total_cleanings,
          hoursSinceCleaning: dirtData.hours_since_cleaning,
          isLoading: false,
          error: null,
        };
      });
    } catch (error) {
      console.error('Error fetching dirt status:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [aquariumId, playerId, authToken]);

  /**
   * @function toggleSpongeMode
   * @description
   * Toggles the `isSpongeMode` state, which can be used to control the
   * interactive cleaning visual.
   */
  const toggleSpongeMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSpongeMode: !prev.isSpongeMode,
    }));
  }, []);

  /**
   * @function cleanDirtSpot
   * @description
   * Sends a request to the backend to clean a specific dirt spot. On a successful
   * response, it updates the local state with the new dirt level and regenerates
   * the visible dirt spots accordingly.
   *
   * @param {number} spotId - The unique ID of the dirt spot to be cleaned.
   * @returns {Promise<any>} A promise that resolves with the updated data from the backend.
   */
      const cleanDirtSpot = useCallback(
        async (spotId: number) => {
          if (!aquariumId || !playerId) {
            return;
          }

          try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }

            const response = await fetch(
              `${API_BASE_URL}/dirt/aquarium/${aquariumId}/clean-spot`,
              {
                method: 'POST',
                headers,
                body: JSON.stringify({ spot_id: spotId }),
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
              throw new Error(result.error || 'Failed to clean spot');
            }

            const cleaningData = result.data;

            // Update state with cleaning results
            setState(prev => {
              const newSpots = prev.spots.filter(spot => spot.id !== spotId);
              
              return {
                ...prev,
                dirtLevel: cleaningData.new_dirt_level,
                spots: newSpots, // Remover solo la mancha específica
                isDirty: cleaningData.new_dirt_level > 10,
                needsCleaning: cleaningData.new_dirt_level > 30,
                cleanlinessStatus: getCleanlinessStatus(cleaningData.new_dirt_level),
                cleaningStreak: cleaningData.cleaning_streak || prev.cleaningStreak,
                totalCleanings: prev.totalCleanings + 1,
                isLoading: false,
                error: null,
              };
            });

            return cleaningData;
      } catch (error) {
        console.error('Error cleaning spot:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
        throw error;
      }
    },
    [aquariumId, playerId, authToken]
  );

  /**
   * @function removeDirtSpot
   * @description
   * Removes a specific dirt spot from the local state. This is primarily for
   * providing immediate visual feedback during interactive cleaning before the
   * backend confirms the state change.
   *
   * @param {number} spotId - The unique ID of the dirt spot to remove.
   */
  const removeDirtSpot = useCallback((spotId: number) => {
    setState(prev => ({
      ...prev,
      spots: prev.spots.filter(spot => spot.id !== spotId),
    }));
  }, []);

  /**
   * @function initializeDirtSystem
   * @description
   * Initializes the dirt system for a new aquarium on the backend. This should
   * be called when a new aquarium is created.
   *
   * @param {any} [config] - Optional configuration object to send to the backend.
   * @returns {Promise<any>} A promise that resolves with the initialization data.
   */
  const initializeDirtSystem = useCallback(
    async (config?: any) => {
      if (!aquariumId || !playerId) return;

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }

        const response = await fetch(
          `${API_BASE_URL}/dirt/aquarium/${aquariumId}/initialize`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ config }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to initialize dirt system');
        }

        // Refresh dirt status after initialization
        await fetchDirtStatus();

        return result.data;
      } catch (error) {
        console.error('Error initializing dirt system:', error);
        throw error;
      }
    },
    [aquariumId, playerId, authToken, fetchDirtStatus]
  );

  /**
   * @function useEffect
   * @description
   * Manages the automatic refresh of the dirt status. It performs an initial
   * fetch and then sets up a recurring interval to call `fetchDirtStatus`.
   * The interval is cleared when the component unmounts.
   */
  useEffect(() => {
    if (!autoRefresh || !aquariumId || !playerId) return;

    // Initial fetch
    fetchDirtStatus();

    // Set up interval for auto-refresh
    const interval = setInterval(fetchDirtStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchDirtStatus, autoRefresh, refreshInterval, aquariumId, playerId]);

  return {
    // State
    ...state,

    // Actions
    fetchDirtStatus,
    toggleSpongeMode,
    cleanDirtSpot,
    removeDirtSpot,
    initializeDirtSystem,

    // Utilities
    refresh: fetchDirtStatus,
  };
}

/**
 * @function generateDirtSpotsFromLevel
 * @description
 * Generates an array of `DirtSpot` objects based on a given dirt level. The
 * number, size, and type of spots are determined by this level.
 *
 * @param {number} dirtLevel - The dirt level percentage (0-100).
 * @returns {DirtSpot[]} An array of generated dirt spots.
 */
function generateDirtSpotsFromLevel(dirtLevel: number): DirtSpot[] {
  if (dirtLevel <= 0) return [];

  const spots: DirtSpot[] = [];
  const maxSpots = Math.min(8, Math.ceil(dirtLevel / 10)); // Max 8 spots, fewer but bigger
  const spotCount = Math.floor(maxSpots * (dirtLevel / 100));

      // Márgenes para evitar header y footer
      const SAFE_MARGINS = {
        top: 100,    // Evitar header (altura aproximada)
        bottom: 120, // Evitar footer (altura aproximada)
        left: 50,   // Márgen izquierdo
        right: 50,   // Márgen derecho
      };

  // Área segura para las manchas - Solo en el área central
  const safeArea = {
    width: window.innerWidth - SAFE_MARGINS.left - SAFE_MARGINS.right,
    height: window.innerHeight - SAFE_MARGINS.top - SAFE_MARGINS.bottom,
    startX: SAFE_MARGINS.left,
    startY: SAFE_MARGINS.top,
  };

  
  for (let i = 0; i < spotCount; i++) {
    const spot: DirtSpot = {
      id: Date.now() + i,
      position: {
        x: Math.random() * safeArea.width + safeArea.startX, // Posición segura
        y: Math.random() * safeArea.height + safeArea.startY, // Posición segura
      },
      type: getRandomDirtType(dirtLevel),
      size: getRandomSpotSize(),
      opacity: Math.min(1, dirtLevel / 100 + 0.3),
      createdAt: Date.now() - Math.random() * 3600000, // Random age up to 1 hour
      intensity: Math.min(1, dirtLevel / 100),
    };

    spots.push(spot);
  }

  return spots;
}

/**
 * @function getRandomDirtType
 * @description
 * Selects a random dirt type with weighted probabilities based on the
 * current dirt level. Higher levels are more likely to generate "heavier" dirt types.
 *
 * @param {number} dirtLevel - The current dirt level percentage (0-100).
 * @returns {DirtType} A randomly selected dirt type.
 */
function getRandomDirtType(dirtLevel: number): DirtType {
  const types = Object.values(DirtType);

  if (dirtLevel < 30) {
    // Light dirt - mostly basic and algae
    return Math.random() < 0.7 ? DirtType.BASIC : DirtType.ALGAE;
  } else if (dirtLevel < 60) {
    // Moderate dirt - mix of types
    const weights = [0.4, 0.3, 0.2, 0.1]; // basic, algae, waste, debris
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return types[i];
      }
    }
    return DirtType.BASIC;
  } else {
    // Heavy dirt - more difficult types
    const weights = [0.2, 0.2, 0.3, 0.2, 0.1]; // basic, algae, waste, debris, grime
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return types[i];
      }
    }
    return DirtType.WASTE;
  }
}

/**
 * @function getRandomSpotSize
 * @description
 * Returns a random size for a dirt spot from a predefined array of sizes.
 *
 * @returns {number} The size of the spot in pixels.
 */
function getRandomSpotSize(): number {
  // TAMAÑOS MUY GRANDES PARA MÁXIMA VISIBILIDAD
  const sizes = [200, 250, 300, 350, 400, 450];
  const randomIndex = Math.floor(Math.random() * sizes.length);
  return sizes[randomIndex];
}

/**
 * @function getCleanlinessStatus
 * @description
 * Determines the cleanliness status (e.g., 'Clean', 'Dirty', 'Critical') and
 * a corresponding label and color based on the current dirt level.
 *
 * @param {number} dirtLevel - The current dirt level percentage (0-100).
 * @returns {{ level: string, label: string, color: string }} An object with status details.
 */
function getCleanlinessStatus(dirtLevel: number) {
  if (dirtLevel >= 90)
    return { level: 'critical', label: 'Very Dirty', color: 'red' };
  if (dirtLevel >= 70)
    return { level: 'high', label: 'Dirty', color: 'orange' };
  if (dirtLevel >= 50)
    return { level: 'moderate', label: 'Needs Attention', color: 'yellow' };
  if (dirtLevel >= 30)
    return { level: 'light', label: 'Slightly Dirty', color: 'light-yellow' };
  if (dirtLevel >= 10)
    return { level: 'minimal', label: 'Almost Clean', color: 'light-green' };
  return { level: 'clean', label: 'Clean', color: 'green' };
}
