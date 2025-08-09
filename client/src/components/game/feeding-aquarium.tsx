'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { FishType } from '@/types/game';
import { useFishMovement } from '@/hooks/use-fish-movement';
import { FishDisplay } from './fish-display';
import { Food } from '@/components/food/Food';
import { FoodParticles } from '@/components/food/FoodParticles';
import type { FoodItem } from '@/types/food';

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
  handleFoodConsumed: (foodId: number) => void;
  handleParticleComplete: (foodId: number) => void;
  updateAquariumBounds: (bounds: { width: number; height: number }) => void;
}

interface FeedingAquariumProps {
  fish: FishType[];
  feedingSystem: FeedingSystemProps;
  containerWidth?: number;
  containerHeight?: number;
}

export function FeedingAquarium({
  fish,
  feedingSystem,
  containerWidth = 1000,
  containerHeight = 600,
}: FeedingAquariumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: containerWidth,
    height: containerHeight,
  });

  // Handle container resizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        };
        setDimensions(newDimensions);
        feedingSystem.updateAquariumBounds(newDimensions);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [feedingSystem]);

  // Handle container clicks for feeding
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      feedingSystem.handleFeedClick(
        event.clientX,
        event.clientY,
        containerRef.current?.getBoundingClientRect()
      );
    },
    [feedingSystem]
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
          },
        ])
      ),
    [fish]
  );

  // Calculate fish positions with movement and preserve metadata
  const fishWithMovement = useFishMovement(fish, {
    aquariumBounds: dimensions,
    foods: feedingSystem.foods,
    onFoodConsumed: feedingSystem.handleFoodConsumed,
  }).map(state => ({
    ...state,
    ...fishMetadataMap[state.id],
  }));

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full fish-container overflow-hidden'
      onClick={handleContainerClick}
      style={{
        cursor: feedingSystem.isFeeding ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <FishDisplay fish={fishWithMovement} />
      {feedingSystem.foods.map((food: FoodItem) => (
        <Food key={food.id} food={food} aquariumBounds={dimensions} />
      ))}
      {feedingSystem.particleEffects.map(effect => (
        <FoodParticles
          key={effect.id}
          position={effect.position}
          trigger={effect.trigger}
          onComplete={() => feedingSystem.handleParticleComplete(effect.id)}
        />
      ))}
    </div>
  );
}
