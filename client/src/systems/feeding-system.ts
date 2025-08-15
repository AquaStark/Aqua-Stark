'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useFoodSystem } from '@/hooks/use-food-system';

interface FeedingSystemOptions {
  aquariumBounds: { width: number; height: number };
  maxFoodsPerSecond?: number;
  foodLifetime?: number;
  attractionRadius?: number;
}

interface ParticleEffect {
  id: number;
  position: { x: number; y: number };
  trigger: boolean;
}

export interface FeedingSystemState {
  isFeeding: boolean;
  particleEffects: ParticleEffect[];
  feedingStartTime: number | null;
  feedingDuration: number;
}

export function useFeedingSystem(options: FeedingSystemOptions) {
  const {
    aquariumBounds: initialBounds,
    maxFoodsPerSecond = 3,
    foodLifetime = 10,
    attractionRadius = 50,
  } = options;

  // Track aquarium bounds in state to ensure proper updates
  const [aquariumBounds, setAquariumBounds] = useState(initialBounds);

  // Initialize food system with tracked bounds
  const { foods, spawnFood, consumeFood, updateFoodAnimations, canSpawnFood } =
    useFoodSystem({
      aquariumBounds,
      maxFoodsPerSecond,
      foodLifetime,
      attractionRadius,
    });

  // Feeding state management
  const [feedingState, setFeedingState] = useState<FeedingSystemState>({
    isFeeding: false,
    particleEffects: [],
    feedingStartTime: null,
    feedingDuration: 30000, // 30 seconds default
  });

  const feedingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop feeding mode
  const stopFeeding = useCallback(() => {
    setFeedingState(prev => ({
      ...prev,
      isFeeding: false,
      feedingStartTime: null,
    }));

    if (feedingTimeoutRef.current) {
      clearTimeout(feedingTimeoutRef.current);
      feedingTimeoutRef.current = null;
    }

    console.log('🛑 Feeding mode stopped');
  }, []);

  // Start feeding mode
  const startFeeding = useCallback(
    (duration: number = 30000) => {
      setFeedingState(prev => ({
        ...prev,
        isFeeding: true,
        feedingStartTime: Date.now(),
        feedingDuration: duration,
      }));

      // Clear any existing timeout
      if (feedingTimeoutRef.current) {
        clearTimeout(feedingTimeoutRef.current);
      }

      // Auto-stop feeding after duration
      feedingTimeoutRef.current = setTimeout(() => {
        stopFeeding();
      }, duration);

      console.log(`🍽️ Feeding mode started for ${duration / 1000} seconds`);
    },
    [stopFeeding]
  );

  // Handle food spawning
  const handleFeedClick = useCallback(
    (clientX: number, clientY: number, containerRect: DOMRect | undefined) => {
      if (!containerRect || !feedingState.isFeeding) {
        console.log(
          '🚫 Cannot feed - feeding mode is not active or container not ready'
        );
        return false;
      }

      const clickX = clientX - containerRect.left;
      const clickY = clientY - containerRect.top;

      // spawn food at click position
      const spawned = spawnFood(clickX, clickY);

      if (!spawned) {
        console.log('⏳ Food spawning on cooldown');
      }

      return spawned;
    },
    [feedingState.isFeeding, spawnFood]
  );

  // Handle food consumption with particle effects
  const handleFoodConsumed = useCallback(
    (foodId: number) => {
      const consumedFood = foods.find(f => f.id === foodId);
      if (consumedFood) {
        // Add particle effect
        setFeedingState(prev => ({
          ...prev,
          particleEffects: [
            ...prev.particleEffects,
            {
              id: foodId,
              position: consumedFood.position,
              trigger: true,
            },
          ],
        }));

        // Consume the food
        consumeFood(foodId);
      }
    },
    [foods, consumeFood]
  );

  // Clean up completed particle effects
  const handleParticleComplete = useCallback((foodId: number) => {
    setFeedingState(prev => ({
      ...prev,
      particleEffects: prev.particleEffects.filter(
        effect => effect.id !== foodId
      ),
    }));
  }, []);

  // Get feeding status info
  const getFeedingStatus = useCallback(() => {
    const { isFeeding, feedingStartTime, feedingDuration } = feedingState;

    if (!isFeeding || !feedingStartTime) {
      return {
        isActive: false,
        timeRemaining: 0,
        progress: 0,
      };
    }

    const elapsed = Date.now() - feedingStartTime;
    const timeRemaining = Math.max(0, feedingDuration - elapsed);
    const progress = Math.min(1, elapsed / feedingDuration);

    return {
      isActive: true,
      timeRemaining,
      progress,
    };
  }, [feedingState]);

  // Update aquarium bounds
  const updateAquariumBounds = useCallback(
    (newBounds: { width: number; height: number }) => {
      setAquariumBounds(newBounds);
    },
    []
  );

  // Handle animations
  useEffect(() => {
    // Start animation interval
    animationIntervalRef.current = setInterval(() => {
      updateFoodAnimations();
    }, 100);

    // Cleanup
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [updateFoodAnimations]);

  return {
    // Food system
    foods,
    canSpawnFood,

    // Feeding system
    feedingState,
    startFeeding,
    stopFeeding,
    handleFeedClick,
    handleFoodConsumed,
    handleParticleComplete,
    getFeedingStatus,
    updateAquariumBounds,

    // Status
    isFeeding: feedingState.isFeeding,
    particleEffects: feedingState.particleEffects,
  };
}
