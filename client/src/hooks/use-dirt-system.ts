/**
 * @file use-dirt-system.ts
 * @description Custom hook for a dirt simulation system. It manages the spawning,
 * removal, and state of dirt spots in an aquarium-like environment.
 * @category Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DirtSpot,
  DirtType,
  DirtSystemConfig,
  DirtSystemState,
} from '@/constants';

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

/**
 * @function useDirtSystem
 * @description
 * Custom hook that manages the state and logic for a dirt simulation system.
 * It handles the spawning of new dirt spots, cleaning of existing ones, and
 * keeps track of key metrics like cleanliness score.
 *
 * @param {Partial<DirtSystemConfig>} config - Optional configuration to override the default settings.
 * @returns {{
 * spots: DirtSpot[],
 * isSpawnerActive: boolean,
 * totalSpotsCreated: number,
 * totalSpotsRemoved: number,
 * cleanlinessScore: number,
 * removeDirtSpot: (spotId: number) => void,
 * forceSpawnSpot: () => boolean,
 * toggleSpawner: () => void,
 * clearAllSpots: () => void,
 * updateAquariumBounds: (bounds: object) => void,
 * config: DirtSystemConfig
 * }} An object containing the current state and action functions.
 */
export function useDirtSystem(config: Partial<DirtSystemConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<DirtSystemState>({
    spots: [],
    isSpawnerActive: true,
    totalSpotsCreated: 0,
    totalSpotsRemoved: 0,
    cleanlinessScore: 100,
    averageSpotAge: 0,
    totalCleaningClicks: 0,
    efficiency: 0,
    dirtTypeStats: {
      [DirtType.BASIC]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.ALGAE]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.WASTE]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.DEBRIS]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.ORGANIC]: { created: 0, removed: 0, averageTimeToClean: 0 },
      [DirtType.GRIME]: { created: 0, removed: 0, averageTimeToClean: 0 },
    },
    lastSpawnTime: Date.now(),
    sessionStartTime: Date.now(),
  });

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(1);

  /**
   * @function isValidPosition
   * @description
   * Checks if a new position is valid by ensuring it's not too close to any
   * existing dirt spots based on the `minSpotDistance` configuration.
   *
   * @param {{ x: number; y: number }} newPos - The candidate position for the new spot.
   * @param {DirtSpot[]} spots - The array of existing dirt spots.
   * @returns {boolean} `true` if the position is valid, `false` otherwise.
   */
  const isValidPosition = useCallback(
    (newPos: { x: number; y: number }, spots: DirtSpot[]): boolean => {
      const { minSpotDistance } = finalConfig;
      return spots.every(spot => {
        const distance = Math.sqrt(
          Math.pow(newPos.x - spot.position.x, 2) +
            Math.pow(newPos.y - spot.position.y, 2)
        );
        return distance >= minSpotDistance;
      });
    },
    [finalConfig.minSpotDistance]
  );

  /**
   * @function generateRandomPosition
   * @description
   * Generates a random position within the aquarium's defined bounds,
   * with a small padding to prevent spots from appearing at the edges.
   *
   * @returns {{ x: number; y: number }} An object with the randomly generated x and y coordinates.
   */
  const generateRandomPosition = useCallback((): { x: number; y: number } => {
    const { aquariumBounds } = finalConfig;
    const padding = 30; // Keep spots away from edges

    return {
      x:
        Math.random() * (aquariumBounds.width - padding * 2) +
        aquariumBounds.x +
        padding,
      y:
        Math.random() * (aquariumBounds.height - padding * 2) +
        aquariumBounds.y +
        padding,
    };
  }, [finalConfig.aquariumBounds]);

  /**
   * @function createDirtSpot
   * @description
   * Attempts to create a new dirt spot if the conditions are met (e.g., maximum
   * number of spots not reached, passing the `spawnChance` check). It handles
   * finding a valid position for the new spot.
   *
   * @param {DirtSpot[]} currentSpots - The current array of dirt spots.
   * @returns {DirtSpot | null} The new dirt spot object, or `null` if a spot could not be created.
   */
  const createDirtSpot = useCallback(
    (currentSpots: DirtSpot[]): DirtSpot | null => {
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
    },
    [finalConfig, generateRandomPosition, isValidPosition]
  );

  /**
   * @function forceSpawnSpot
   * @description
   * Manually triggers the creation of a single dirt spot, bypassing the
   * regular spawn interval. Useful for debugging or testing purposes.
   *
   * @returns {boolean} `true` if a new spot was spawned, `false` otherwise.
   */
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
          cleanlinessScore: Math.max(
            0,
            prev.cleanlinessScore - 100 / finalConfig.maxSpots
          ),
        };
      }
      return prev;
    });
    return spawned;
  }, [createDirtSpot, finalConfig.maxSpots]);

  /**
   * @function removeDirtSpot
   * @description
   * Removes a specific dirt spot by its ID and updates the cleanliness score
   * based on the `maxSpots` configuration.
   *
   * @param {number} spotId - The ID of the dirt spot to remove.
   */
  const removeDirtSpot = useCallback(
    (spotId: number) => {
      setState((prev: DirtSystemState) => {
        const spotExists = prev.spots.some(
          (spot: DirtSpot) => spot.id === spotId
        );
        if (!spotExists) return prev;

        return {
          ...prev,
          spots: prev.spots.filter((spot: DirtSpot) => spot.id !== spotId),
          totalSpotsRemoved: prev.totalSpotsRemoved + 1,
          cleanlinessScore: Math.min(
            100,
            prev.cleanlinessScore + 100 / finalConfig.maxSpots
          ),
        };
      });
    },
    [finalConfig.maxSpots]
  );

  /**
   * @function toggleSpawner
   * @description
   * Toggles the active state of the dirt spot spawner.
   */
  const toggleSpawner = useCallback(() => {
    setState((prev: DirtSystemState) => ({
      ...prev,
      isSpawnerActive: !prev.isSpawnerActive,
    }));
  }, []);

  /**
   * @function clearAllSpots
   * @description
   * Removes all dirt spots from the system and resets the cleanliness score to 100.
   */
  const clearAllSpots = useCallback(() => {
    setState((prev: DirtSystemState) => ({
      ...prev,
      spots: [],
      totalSpotsRemoved: prev.totalSpotsRemoved + prev.spots.length,
      cleanlinessScore: 100,
    }));
  }, []);

  /**
   * @function useEffect
   * @description
   * Manages the spawning interval. It sets up `setInterval` to create
   * new dirt spots at the configured rate when the spawner is active, and
   * clears the interval when the spawner is not.
   */
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
              cleanlinessScore: Math.max(
                0,
                prev.cleanlinessScore - 100 / finalConfig.maxSpots
              ),
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
  }, [
    state.isSpawnerActive,
    finalConfig.spawnInterval,
    createDirtSpot,
    finalConfig.maxSpots,
  ]);

  /**
   * @function updateAquariumBounds
   * @description
   * Updates the boundaries of the aquarium. This function uses `Object.assign`
   * to directly modify the `finalConfig` object's `aquariumBounds` property.
   *
   * @param {DirtSystemConfig['aquariumBounds']} bounds - The new bounds to apply.
   */
  const updateAquariumBounds = useCallback(
    (bounds: DirtSystemConfig['aquariumBounds']) => {
      // Update the config without triggering a re-render cycle
      Object.assign(finalConfig.aquariumBounds, bounds);
    },
    [finalConfig.aquariumBounds]
  );

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
