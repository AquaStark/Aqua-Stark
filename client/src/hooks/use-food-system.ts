'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { FoodItem, FoodSystemState } from '@/types/food';

interface UseFoodSystemOptions {
  aquariumBounds: { width: number; height: number };
  maxFoodsPerSecond?: number;
  foodLifetime?: number;
  attractionRadius?: number;
}

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

  // Clean up expired foods
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setFoodState(prev => ({
        ...prev,
        foods: prev.foods.filter(food => {
          const age = (now - food.createdAt) / 1000;
          if (age > foodLifetime) {
            return false;
          }
          return true;
        }),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [foodLifetime]);

  // Spawn food
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

  // Consume food - REMOVE IMMEDIATELY
  const consumeFood = useCallback((foodId: number) => {
    // Add validation to prevent race conditions
    setFoodState(prev => {
      const foodExists = prev.foods.find(f => f.id === foodId && !f.consumed);
      if (!foodExists) {
        console.warn(`⚠️ Food ${foodId} already consumed or doesn't exist`);
        return prev;
      }
      return {
        ...prev,
        foods: prev.foods.filter(food => food.id !== foodId), // Remove immediately!
      };
    });
  }, []);

  // Add method to check if food exists and is available
  const isFoodAvailable = useCallback(
    (foodId: number): boolean => {
      return foodState.foods.some(food => food.id === foodId && !food.consumed);
    },
    [foodState.foods]
  );

  // Add method to get food by ID
  const getFoodById = useCallback(
    (foodId: number): FoodItem | undefined => {
      return foodState.foods.find(food => food.id === foodId && !food.consumed);
    },
    [foodState.foods]
  );

  // Add method to mark food as consumed (for debugging)
  const markFoodAsConsumed = useCallback((foodId: number) => {
    setFoodState(prev => ({
      ...prev,
      foods: prev.foods.map(food =>
        food.id === foodId ? { ...food, consumed: true } : food
      ),
    }));
  }, []);

  // Update food animations
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
    updateFoodAnimations,
    canSpawnFood:
      Date.now() - foodState.lastSpawnTime >= foodState.spawnCooldown,
    // Add new utility methods
    isFoodAvailable,
    getFoodById,
    markFoodAsConsumed,
  };
}
