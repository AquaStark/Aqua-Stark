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
  cleanlinessScore?: number;
}

export function FeedingAquarium({
  fish,
  feedingSystem,
  containerWidth = 1000,
  containerHeight = 600,
  cleanlinessScore,
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
      handleFeedClick(
        event.clientX,
        event.clientY,
        containerRef.current?.getBoundingClientRect()
      );
    },
    [handleFeedClick]
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
    onFoodConsumed: handleFoodConsumed,
  }).map(state => ({
    ...state,
    ...fishMetadataMap[state.id],
  }));

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full fish-container overflow-hidden'
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      role='button'
      tabIndex={0}
      style={{
        cursor: isFeeding ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <FishDisplay
        fish={fishWithMovement}
        cleanlinessScore={cleanlinessScore}
      />
      {foods.map((food: FoodItem) => (
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
