'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { FishType, FoodItem, Fish } from '@/types';
import { useFishMovement } from '@/hooks';
import { FishDisplay } from './fish-display';
import { Food } from '@/components';
import { FoodParticles } from '@/components';
import { useFoodSystem } from '@/hooks';

interface FeedingSystemProps {
  isFeeding: boolean;
  foods: FoodItem[];
  particleEffects: Array<{
    id: number;
    position: { x: number; y: number };
    trigger: boolean;
  }>;
  handleFeedClick: (
    clientX: number,
    clientY: number,
    containerRect: DOMRect | undefined
  ) => boolean;
  handleFoodConsumed: (foodId: number, fish: Fish) => void;
  handleParticleComplete: (foodId: number) => void;
  updateAquariumBounds: (bounds: { width: number; height: number }) => void;
  updateFishState?: (id: string, newState: Partial<Fish>) => void;
  increaseHunger?: (id: string) => void;
}

interface FeedingAquariumProps {
  fish: FishType[];
  feedingSystem: FeedingSystemProps;
  containerWidth?: number;
  containerHeight?: number;
  cleanlinessScore?: number;
  fullFishList: Fish[];
  isMobile?: boolean;
}

export function FeedingAquarium({
  fish,
  feedingSystem,
  containerWidth = 1000,
  containerHeight = 600,
  cleanlinessScore,
  fullFishList,
  isMobile = false,
}: FeedingAquariumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: containerWidth,
    height: containerHeight,
  });
  // Destructure frequent fields to avoid object dependency pitfalls and satisfy lint
  const {
    updateAquariumBounds,
    isFeeding,
    foods,
    handleFoodConsumed,
    particleEffects,
    handleParticleComplete,
    handleFeedClick,
    updateFishState,
    increaseHunger,
    tryConsumeFood, // Use tryConsumeFood from the same food system instance
  } = feedingSystem;

  // Handle container resizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        };
        setDimensions(newDimensions);
        updateAquariumBounds(newDimensions);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateAquariumBounds]);

  // Handle container clicks for feeding
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      handleFeedClick(event.clientX, event.clientY, rect);
    },
    [handleFeedClick, isFeeding]
  );

  // Handle touch events for mobile
  const handleContainerTouch = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = containerRef.current?.getBoundingClientRect();
        handleFeedClick(touch.clientX, touch.clientY, rect);
      }
    },
    [handleFeedClick, isFeeding]
  );

  // Keyboard accessibility: drop food at container center on Enter/Space
  const handleContainerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isFeeding) return;
      if (event.key === 'Enter' || event.key === ' ') {
        const rect = containerRef.current?.getBoundingClientRect();
        const cx = rect ? rect.left + rect.width / 2 : 0;
        const cy = rect ? rect.top + rect.height / 2 : 0;
        handleFeedClick(cx, cy, rect);
        event.preventDefault();
      }
    },
    [isFeeding, handleFeedClick]
  );

  // Create a lookup map for fish metadata
  const fishMetadataMap = React.useMemo(
    () =>
      Object.fromEntries(
        fish.map(f => [
          f.id,
          {
            name: f.name,
            image: f.image,
            rarity: f.rarity,
            generation: f.generation,
            lastFedTimestamp: f.lastFedTimestamp,
            lastUpdated: f.lastUpdated,
          },
        ])
      ),
    [fish]
  );

  // Calculate fish positions with movement and preserve metadata
  const fishWithMovement = useFishMovement(fish, {
    aquariumBounds: dimensions,
    foods,
    onFoodConsumed: (foodId: number, fishId: number) => {
      // First try to find the fish instance in the current fish array
      const fishInstance = fish.find(f => f.id === fishId);
      if (!fishInstance) {
        console.warn(`Fish instance ${fishId} not found`);
        // Still consume the food even if fish not found
        handleFoodConsumed(foodId);
        return;
      }

      // Try to find the fish type in fullFishList (catalog) by matching name or ID
      // The fish instance ID might match the type ID, or we might need to match by name
      let targetFish = fullFishList.find(
        f => f.id === fishId || f.name === fishInstance.name
      );

      // If fish not found in catalog, create a mock fish for consumption
      if (!targetFish) {
        targetFish = {
          id: fishInstance.id,
          name: fishInstance.name,
          hunger: 50, // Default hunger level
          traits: {
            color: 'blue',
            pattern: 'plain',
            fins: 'normal',
            size: 'medium',
          },
        } as any;
      }

      // Try to consume food with satiety logic
      const wasConsumed = tryConsumeFood(
        foodId,
        targetFish,
        updateFishState ?? (() => {}),
        increaseHunger ?? (() => {})
      );

      // Always call handleFoodConsumed to:
      // 1. Remove food from array (if not already removed by tryConsumeFood)
      // 2. Trigger particle effects
      // handleFoodConsumed checks if food exists before consuming, so it's safe to call
      handleFoodConsumed(foodId);
    },
  }).map(state => ({
    ...state,
    ...fishMetadataMap[state.id],
  }));

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full fish-container overflow-hidden'
      onClick={isFeeding ? handleContainerClick : undefined}
      onTouchStart={isFeeding ? handleContainerTouch : undefined}
      onKeyDown={isFeeding ? handleContainerKeyDown : undefined}
      role={isFeeding ? 'button' : undefined}
      tabIndex={isFeeding ? 0 : undefined}
      style={{
        cursor: isFeeding ? 'pointer' : 'default',
        userSelect: 'none',
        pointerEvents: isFeeding ? 'auto' : 'none', // Allow clicks when feeding, block when not
      }}
    >
      <FishDisplay
        fish={fishWithMovement}
        cleanlinessScore={cleanlinessScore}
        isMobile={isMobile}
      />
      {foods
        .filter((food: FoodItem) => !food.consumed)
        .map((food: FoodItem) => (
          <Food key={food.id} food={food} aquariumBounds={dimensions} />
        ))}
      {particleEffects.map(effect => (
        <FoodParticles
          key={effect.id}
          position={effect.position}
          trigger={effect.trigger}
          onComplete={() => handleParticleComplete(effect.id)}
        />
      ))}
    </div>
  );
}
