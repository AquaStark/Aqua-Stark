import { useState, useEffect, useCallback } from 'react';
import { DirtSpot, DirtType } from '@/types/dirt';

// API base URL - adjust based on your backend configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

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

interface UseDirtSystemRealisticOptions {
  aquariumId: string;
  playerId: string;
  authToken?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

/**
 * Hook for realistic dirt system based on backend time calculations
 */
export function useDirtSystemRealistic({
  aquariumId,
  playerId,
  authToken,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
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

  // Fetch dirt status from backend
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
        // Only generate new spots if we don't have any spots yet
        let newSpots = prev.spots;
        if (prev.spots.length === 0) {
          // FORZAR NIVEL DE SUCIEDAD PARA TESTING (el backend tiene período de gracia de 4 horas)
          const forcedDirtLevel = Math.max(dirtData.current_dirt_level, 50); // Mínimo 50% para ver manchas
          newSpots = generateDirtSpotsFromLevel(forcedDirtLevel);
        }

        return {
          ...prev,
          spots: newSpots,
          dirtLevel: Math.max(dirtData.current_dirt_level, 50), // Mostrar nivel forzado
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

  // Toggle sponge mode
  const toggleSpongeMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSpongeMode: !prev.isSpongeMode,
    }));
  }, []);

  // Clean individual dirt spot (interactive cleaning)
  const cleanDirtSpot = useCallback(
    async (spotId: number) => {
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
        setState(prev => ({
          ...prev,
          dirtLevel: cleaningData.new_dirt_level,
          spots: generateDirtSpotsFromLevel(cleaningData.new_dirt_level),
          isDirty: cleaningData.new_dirt_level > 10,
          needsCleaning: cleaningData.new_dirt_level > 30,
          cleanlinessStatus: getCleanlinessStatus(cleaningData.new_dirt_level),
          cleaningStreak: cleaningData.cleaning_streak || prev.cleaningStreak,
          totalCleanings: prev.totalCleanings + 1,
          isLoading: false,
          error: null,
        }));

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

  // Remove individual dirt spot (for visual feedback)
  const removeDirtSpot = useCallback((spotId: number) => {
    setState(prev => ({
      ...prev,
      spots: prev.spots.filter(spot => spot.id !== spotId),
    }));
  }, []);

  // Initialize dirt system for new aquarium
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

  // Auto-refresh effect
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
 * Generate dirt spots based on dirt level
 */
function generateDirtSpotsFromLevel(dirtLevel: number): DirtSpot[] {
  if (dirtLevel <= 0) return [];

  const spots: DirtSpot[] = [];
  const maxSpots = Math.min(8, Math.ceil(dirtLevel / 10)); // Max 8 spots, fewer but bigger
  const spotCount = Math.floor(maxSpots * (dirtLevel / 100));

  for (let i = 0; i < spotCount; i++) {
    const spot: DirtSpot = {
      id: Date.now() + i,
      position: {
        x: Math.random() * 1800 + 100, // Random position within aquarium bounds
        y: Math.random() * 800 + 100,
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
 * Get random dirt type based on dirt level
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
 * Get random spot size based on dirt level
 */
function getRandomSpotSize(): number {
  // MUCHOS TAMAÑOS GRANDES Y VARIADOS
  const sizes = [120, 150, 180, 200, 220, 250, 280, 300];
  const randomIndex = Math.floor(Math.random() * sizes.length);
  return sizes[randomIndex];
}

/**
 * Get cleanliness status based on dirt level
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
