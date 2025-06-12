import { useState, useEffect, useCallback, useRef } from 'react';
import { DirtSpot, DirtType, DirtSystemConfig, DirtSystemState } from '@/types/dirt';

const DEFAULT_CONFIG: DirtSystemConfig = {
  spawnInterval: 30000, // 30 seconds
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

export function useDirtSystemFixed(config: Partial<DirtSystemConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<DirtSystemState>({
    spots: [],
    isSpawnerActive: true,
    totalSpotsCreated: 0,
    totalSpotsRemoved: 0,
    cleanlinessScore: 100,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextIdRef = useRef(1);

  // Generate random position within aquarium bounds - STABLE, no dependencies that change
  const generateRandomPosition = useCallback((): { x: number; y: number } => {
    const { aquariumBounds } = finalConfig;
    const padding = 30;
    
    return {
      x: Math.random() * (aquariumBounds.width - padding * 2) + aquariumBounds.x + padding,
      y: Math.random() * (aquariumBounds.height - padding * 2) + aquariumBounds.y + padding,
    };
  }, [finalConfig.aquariumBounds.x, finalConfig.aquariumBounds.y, finalConfig.aquariumBounds.width, finalConfig.aquariumBounds.height]);

  // Check if position conflicts with existing spots - STABLE
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

  // Force spawn function for debugging
  const forceSpawnSpot = useCallback(() => {
    console.log('🧪 Force spawn triggered');
    
    setState((prev: DirtSystemState) => {
      const { maxSpots, spawnChance } = finalConfig;
      
      if (prev.spots.length >= maxSpots) {
        console.log('❌ Cannot spawn: max spots reached');
        return prev;
      }

      // Try to find a valid position (max 10 attempts)
      for (let attempts = 0; attempts < 10; attempts++) {
        const position = generateRandomPosition();
        console.log(`🎲 Attempt ${attempts + 1}: trying position`, position);
        
        if (isValidPosition(position, prev.spots)) {
          const newSpot: DirtSpot = {
            id: nextIdRef.current++,
            position,
            type: DirtType.BASIC,
            size: Math.random() * 20 + 15,
            opacity: Math.random() * 0.3 + 0.6,
            createdAt: Date.now(),
          };
          
          console.log('✅ Successfully created dirt spot:', newSpot);
          
          return {
            ...prev,
            spots: [...prev.spots, newSpot],
            totalSpotsCreated: prev.totalSpotsCreated + 1,
            cleanlinessScore: Math.max(0, prev.cleanlinessScore - (100 / maxSpots)),
          };
        } else {
          console.log(`❌ Position invalid due to distance constraints`);
        }
      }
      
      console.log('❌ Could not find valid position after 10 attempts');
      return prev;
    });
    
    return true;
  }, [finalConfig.maxSpots, generateRandomPosition, isValidPosition]);

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
  }, []);

  // Setup spawn interval - SIMPLIFIED without problematic dependencies
  useEffect(() => {
    console.log('🔄 Dirt system useEffect triggered:', { 
      isSpawnerActive: state.isSpawnerActive, 
      spawnInterval: finalConfig.spawnInterval 
    });
    
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state.isSpawnerActive) {
      console.log('✅ Setting up dirt spawn interval');
      
      intervalRef.current = setInterval(() => {
        console.log('⏰ Dirt spawn interval triggered');
        
        // Create dirt spot directly in the interval callback
        setState((prev: DirtSystemState) => {
          const { maxSpots, spawnChance } = finalConfig;
          
          console.log('🎯 Attempting to create dirt spot:', { 
            currentSpotCount: prev.spots.length, 
            maxSpots, 
            spawnChance 
          });
          
          if (prev.spots.length >= maxSpots) {
            console.log('❌ Cannot spawn: max spots reached');
            return prev;
          }
          
          if (Math.random() > spawnChance) {
            console.log('❌ Cannot spawn: spawn chance failed');
            return prev;
          }

          // Try to find a valid position
          for (let attempts = 0; attempts < 10; attempts++) {
            const position = generateRandomPosition();
            console.log(`🎲 Attempt ${attempts + 1}: trying position`, position);
            
            if (isValidPosition(position, prev.spots)) {
              const newSpot: DirtSpot = {
                id: nextIdRef.current++,
                position,
                type: DirtType.BASIC,
                size: Math.random() * 20 + 15,
                opacity: Math.random() * 0.3 + 0.6,
                createdAt: Date.now(),
              };
              
              console.log('✅ Successfully created dirt spot in interval:', newSpot);
              
              return {
                ...prev,
                spots: [...prev.spots, newSpot],
                totalSpotsCreated: prev.totalSpotsCreated + 1,
                cleanlinessScore: Math.max(0, prev.cleanlinessScore - (100 / maxSpots)),
              };
            }
          }
          
          console.log('❌ Could not find valid position after 10 attempts');
          return prev;
        });
      }, finalConfig.spawnInterval);
    } else {
      console.log('❌ Dirt spawner is inactive');
    }

    return () => {
      if (intervalRef.current) {
        console.log('🧹 Cleaning up dirt spawn interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isSpawnerActive]); // ONLY depend on isSpawnerActive

  // Update aquarium bounds
  const updateAquariumBounds = useCallback((bounds: DirtSystemConfig['aquariumBounds']) => {
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
