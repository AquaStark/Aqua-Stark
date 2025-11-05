'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { FoodItem, FoodSystemState, Fish } from '@/types';

interface UseFoodSystemOptions {
  aquariumBounds: { width: number; height: number };
  maxFoodsPerSecond?: number;
  foodLifetime?: number;
  attractionRadius?: number;
}

/**
 * Custom hook to manage the food system inside the aquarium.
 * Handles spawning, consuming, and updating food items, as well as applying rules
 * like lifetime expiration and fish satiety awareness.
 *
 * @example
 * ```tsx
 * const {
 *   foods,
 *   spawnFood,
 *   consumeFood,
 *   tryConsumeFood,
 *   updateFoodAnimations,
 *   canSpawnFood
 * } = useFoodSystem({ aquariumBounds: { width: 800, height: 600 } });
 *
 * // Spawning food at click coordinates
 * spawnFood(200, 150);
 * ```
 *
 * @param {UseFoodSystemOptions} options - Configuration options for the food system.
 * @returns {{
 *   foods: FoodItem[];
 *   spawnFood: (clickX: number, clickY: number) => boolean;
 *   consumeFood: (foodId: number) => void;
 *   tryConsumeFood: (
 *     foodId: number,
 *     fish: Fish,
 *     setFishState: (id: string, newState: Partial<Fish>) => void,
 *     increaseHunger: (id: string) => void
 *   ) => boolean;
 *   updateFoodAnimations: () => void;
 *   canSpawnFood: boolean;
 *   isFoodAvailable: (foodId: number) => boolean;
 *   getFoodById: (foodId: number) => FoodItem | undefined;
 *   markFoodAsConsumed: (foodId: number) => void;
 * }} The current food system state and operations.
 */
export function useFoodSystem(options: UseFoodSystemOptions) {
  const {
    aquariumBounds,
    maxFoodsPerSecond = 3,
    foodLifetime = 15,
    attractionRadius = 50,
  } = options;

  const [foodState, setFoodState] = useState<FoodSystemState>({
    foods: [],
    lastSpawnTime: 0,
    spawnCooldown: 1000 / maxFoodsPerSecond,
    maxFoodsPerSecond,
  });

  const nextFoodIdRef = useRef(1);

  /**
   * Cleans up expired food items every 2 seconds based on their lifetime.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFoodState(prev => ({
        ...prev,
        foods: prev.foods.filter(food => {
          const age = (now - food.createdAt) / 1000;
          return age <= foodLifetime;
        }),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [foodLifetime]);

  /**
   * Spawns a new food item at the specified click coordinates.
   *
   * @param {number} clickX - The X coordinate of the click.
   * @param {number} clickY - The Y coordinate of the click.
   * @returns {boolean} True if food was spawned successfully, false if on cooldown.
   */
  const spawnFood = useCallback(
    (clickX: number, clickY: number) => {
      const now = Date.now();

      if (now - foodState.lastSpawnTime < foodState.spawnCooldown) {
        return false;
      }

      const foodPosition = {
        x: Math.max(5, Math.min(95, (clickX / aquariumBounds.width) * 100)),
        y: Math.max(5, Math.min(95, (clickY / aquariumBounds.height) * 100)),
      };

      const newFood: FoodItem = {
        id: nextFoodIdRef.current++,
        position: foodPosition,
        createdAt: now,
        consumed: false,
        attractionRadius,
        scale: 0,
      };

      setFoodState(prev => ({
        ...prev,
        foods: [...prev.foods, newFood],
        lastSpawnTime: now,
      }));

      return true;
    },
    [
      foodState.lastSpawnTime,
      foodState.spawnCooldown,
      aquariumBounds,
      attractionRadius,
    ]
  );

  /**
   * Immediately removes a food item by its ID.
   *
   * @param {number} foodId - The ID of the food to consume.
   */
  const consumeFood = useCallback((foodId: number) => {
    setFoodState(prev => {
      const foodExists = prev.foods.find(f => f.id === foodId && !f.consumed);
      if (!foodExists) {
        console.warn(`⚠️ Food ${foodId} already consumed or doesn't exist`);
        return prev;
      }
      return {
        ...prev,
        foods: prev.foods.filter(food => food.id !== foodId),
      };
    });
  }, []);

  /**
   * Attempts to consume a food item with satiety logic.
   * Rejects consumption if the fish is full, otherwise consumes the food.
   *
   * @param {number} foodId - The ID of the food to attempt to consume.
   * @param {Fish} fish - The fish attempting to eat.
   * @param {(id: string, newState: Partial<Fish>) => void} setFishState - Callback to update the fish state.
   * @param {(id: string) => void} increaseHunger - Callback to increase the fish's hunger stat.
   * @returns {boolean} True if the food was consumed, false otherwise.
   */
  const tryConsumeFood = useCallback(
    (
      foodId: number,
      fish: Fish,
      setFishState: (id: string, newState: Partial<Fish>) => void,
      increaseHunger: (id: string) => void
    ): boolean => {
      const now = Date.now();
      if (fish.hunger >= 100) {
        if (!fish.lastRejection || now - fish.lastRejection > 10000) {
          setFishState(String(fish.id), {
            state: 'rejecting',
            lastRejection: now,
          });
        }
        // Don't consume food if fish is full, but food will still be removed
        // by handleFoodConsumed in feeding-aquarium
        return false;
      }
      // Fish can eat - consume the food
      consumeFood(foodId);
      increaseHunger(String(fish.id));
      setFishState(String(fish.id), { state: 'eating' });
      return true;
    },
    [consumeFood]
  );

  /**
   * Checks whether a food item exists and is available for consumption.
   *
   * @param {number} foodId - The ID of the food to check.
   * @returns {boolean} True if the food is available, false otherwise.
   */
  const isFoodAvailable = useCallback(
    (foodId: number): boolean => {
      return foodState.foods.some(food => food.id === foodId && !food.consumed);
    },
    [foodState.foods]
  );

  /**
   * Retrieves a food item by its ID.
   *
   * @param {number} foodId - The ID of the food to retrieve.
   * @returns {FoodItem | undefined} The food item if found, undefined otherwise.
   */
  const getFoodById = useCallback(
    (foodId: number): FoodItem | undefined => {
      return foodState.foods.find(food => food.id === foodId && !food.consumed);
    },
    [foodState.foods]
  );

  /**
   * Marks a food item as consumed without removing it (debugging use).
   *
   * @param {number} foodId - The ID of the food to mark as consumed.
   */
  const markFoodAsConsumed = useCallback((foodId: number) => {
    setFoodState(prev => ({
      ...prev,
      foods: prev.foods.map(food =>
        food.id === foodId ? { ...food, consumed: true } : food
      ),
    }));
  }, []);

  /**
   * Updates animations for food items, such as growth scaling.
   */
  const updateFoodAnimations = useCallback(() => {
    setFoodState(prev => ({
      ...prev,
      foods: prev.foods.map(food => {
        if (food.scale < 1 && !food.consumed) {
          return { ...food, scale: Math.min(1, food.scale + 0.2) };
        }
        return food;
      }),
    }));
  }, []);

  return {
    foods: foodState.foods,
    spawnFood,
    consumeFood,
    tryConsumeFood,
    updateFoodAnimations,
    canSpawnFood:
      Date.now() - foodState.lastSpawnTime >= foodState.spawnCooldown,
    isFoodAvailable,
    getFoodById,
    markFoodAsConsumed,
  };
}
