import { useState, useEffect, useCallback, useRef } from 'react';
import { DirtSpot, DirtType, DirtSystemConfig, DirtSystemState } from '@/types/dirt';

const DEFAULT_CONFIG: DirtSystemConfig = {
  spawnInterval: 5000, // 5 seconds
  maxSpots: 5,
  minSpotDistance: 60, // pixels
  aquariumBounds: {
    x: 0,
    y: 0,
    width: 800,
    height: 400,
  },
  spawnChance: 0.7,
};

export function useDirtSystem(config: Partial<DirtSystemConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<DirtSystemState>({
    spots: [],
    isSpawnerActive: true,
    totalSpotsCreated: 0,
    totalSpotsRemoved: 0,
    cleanlinessScore: 100,
  });

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);

  // Check if position conflicts with existing spots
  const isValidPosition = useCallback((newPos: { x: number; y: number }, spots: DirtSpot[]): boolean => {
    const { minSpotDistance } = finalConfig;
    return spots.every(spot => {
      const distance = Math.sqrt(
        Math.pow(newPos.x - spot.position.x, 2) + 
        Math.pow(newPos.y - spot.position.y, 2)
      );
      return distance >= minSpotDistance;
    });
  }, [finalConfig.minSpotDistance]);

  // Generate random position within aquarium bounds
  const generateRandomPosition = useCallback((): { x: number; y: number } => {
    const { aquariumBounds } = finalConfig;
    const padding = 30; // Keep spots away from edges
    
    return {
      x: Math.random() * (aquariumBounds.width - padding * 2) + aquariumBounds.x + padding,
      y: Math.random() * (aquariumBounds.height - padding * 2) + aquariumBounds.y + padding,
    };
  }, [finalConfig.aquariumBounds]);  // Create a new dirt spot
  const createDirtSpot = useCallback((currentSpots: DirtSpot[]): DirtSpot | null => {
    const { maxSpots, spawnChance } = finalConfig;
    
    if (currentSpots.length >= maxSpots) {
      return null;
    }
    
    if (Math.random() > spawnChance) {
      return null;
    }

    // Try to find a valid position (max 10 attempts)
    for (let attempts = 0; attempts < 10; attempts++) {
      const position = generateRandomPosition();
      
      if (isValidPosition(position, currentSpots)) {
        const newSpot = {
          id: nextIdRef.current++,
          position,
          type: DirtType.BASIC, // For now, only basic dirt
          size: Math.random() * 20 + 15, // 15-35px
          opacity: Math.random() * 0.3 + 0.6, // 0.6-0.9
          createdAt: Date.now(),
        };
        return newSpot;
      }
    }
    
    return null; // Couldn't find valid position
  }, [finalConfig, generateRandomPosition, isValidPosition]);
  
  // Force spawn (for debug)
  const forceSpawnSpot = useCallback(() => {
    let spawned = false;
    setState((prev: DirtSystemState) => {
      const newSpot = createDirtSpot(prev.spots);
      if (newSpot) {
        spawned = true;
        return {
          ...prev,
          spots: [...prev.spots, newSpot],
          totalSpotsCreated: prev.totalSpotsCreated + 1,
          cleanlinessScore: Math.max(0, prev.cleanlinessScore - (100 / finalConfig.maxSpots)),
        };
      }
      return prev;
    });
    return spawned;
  }, [createDirtSpot, finalConfig.maxSpots]);
  // Remove dirt spot
  const removeDirtSpot = useCallback((spotId: number) => {
    setState((prev: DirtSystemState) => {
      const spotExists = prev.spots.some((spot: DirtSpot) => spot.id === spotId);
      if (!spotExists) return prev;

      return {
        ...prev,
        spots: prev.spots.filter((spot: DirtSpot) => spot.id !== spotId),
        totalSpotsRemoved: prev.totalSpotsRemoved + 1,
        cleanlinessScore: Math.min(100, prev.cleanlinessScore + (100 / finalConfig.maxSpots)),
      };
    });
  }, [finalConfig.maxSpots]);
  // Toggle spawner
  const toggleSpawner = useCallback(() => {
    setState((prev: DirtSystemState) => ({
      ...prev,
      isSpawnerActive: !prev.isSpawnerActive,
    }));
  }, []);
  // Clear all spots
  const clearAllSpots = useCallback(() => {
    setState((prev: DirtSystemState) => ({
      ...prev,
      spots: [],
      totalSpotsRemoved: prev.totalSpotsRemoved + prev.spots.length,
      cleanlinessScore: 100,
    }));
  }, []);  // Setup spawn interval
  useEffect(() => {
    if (state.isSpawnerActive) {
      intervalRef.current = setInterval(() => {
        setState((prev: DirtSystemState) => {
          const newSpot = createDirtSpot(prev.spots);
          if (newSpot) {
            return {
              ...prev,
              spots: [...prev.spots, newSpot],
              totalSpotsCreated: prev.totalSpotsCreated + 1,
              cleanlinessScore: Math.max(0, prev.cleanlinessScore - (100 / finalConfig.maxSpots)),
            };
          }
          return prev;
        });
      }, finalConfig.spawnInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isSpawnerActive, finalConfig.spawnInterval, createDirtSpot, finalConfig.maxSpots]);

  // Update aquarium bounds
  const updateAquariumBounds = useCallback((bounds: DirtSystemConfig['aquariumBounds']) => {
    // Update the config without triggering a re-render cycle
    Object.assign(finalConfig.aquariumBounds, bounds);
  }, [finalConfig.aquariumBounds]);

  return {
    // State
    spots: state.spots,
    isSpawnerActive: state.isSpawnerActive,
    totalSpotsCreated: state.totalSpotsCreated,
    totalSpotsRemoved: state.totalSpotsRemoved,
    cleanlinessScore: Math.round(state.cleanlinessScore),
    
    // Actions
    removeDirtSpot,
    forceSpawnSpot,
    toggleSpawner,
    clearAllSpots,
    updateAquariumBounds,
    
    // Config
    config: finalConfig,
  };
}
