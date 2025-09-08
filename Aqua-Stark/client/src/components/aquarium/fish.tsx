'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import type { FishType } from '@/types/game';
import { useEffect, useState, useRef } from 'react';
import { useFishIndicators } from '@/hooks/useFishIndicators';
import { FishStatus } from '@/components/FishStatus';
import { MotionAnimationProps } from '@/types/ui-types';

interface FishProps {
  fish: FishType;
  position: {
    x: number;
    y: number;
  };
  facingLeft: boolean;
  behaviorState:
    | 'idle'
    | 'darting'
    | 'hovering'
    | 'turning'
    | 'feeding'
    | 'exploring'
    | 'playful'
    | 'rejecting';
  //add new state
  style?: React.CSSProperties;
  cleanlinessScore?: number;
}

// Define valid rarity types for type safety
type RarityType =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'exotic';

export function Fish({
  fish,
  position,
  facingLeft,
  behaviorState,
  style = {},
  cleanlinessScore,
}: FishProps) {
  // Track previous facing direction to detect changes for flip animation
  const prevFacingLeftRef = useRef(facingLeft);
  const [isFlipping, setIsFlipping] = useState(false);

  // Per-fish indicators (hunger, energy, happiness)
  const { indicators, feed, setCleanliness } = useFishIndicators({
    fishId: fish.id,
    initial: {
      hunger: fish.stats?.hunger ?? 50,
      energy: fish.stats?.energy ?? 50,
      happiness: fish.stats?.happiness ?? 50,
    },
    lastFedTimestamp: fish.lastFedTimestamp ?? null,
    lastUpdated: fish.lastUpdated ?? null,
    cleanliness: typeof cleanlinessScore === 'number' ? cleanlinessScore : 100,
    onChange: state => {
      // Emit an event so higher-level logic can persist/sync later
      window.dispatchEvent(
        new CustomEvent('fish-indicators-changed', {
          detail: { fishId: fish.id, state },
        })
      );
    },
  });

  // Keep cleanliness in sync from aquarium dirt system
  useEffect(() => {
    if (typeof cleanlinessScore === 'number') {
      setCleanliness(cleanlinessScore);
    }
  }, [cleanlinessScore, setCleanliness]);

  // React to global feeding events emitted by movement logic
  useEffect(() => {
    const handler = (evt: Event) => {
      const ce = evt as CustomEvent<{ fishId: number; foodId: number }>; // runtime-emitted
      if (ce?.detail?.fishId === fish.id) {
        feed(); // apply feeding boost to indicators
      }
    };
    window.addEventListener('fish-fed', handler as EventListener);
    return () =>
      window.removeEventListener('fish-fed', handler as EventListener);
  }, [fish.id, feed]);

  // Apply flip animation when direction changes
  useEffect(() => {
    if (prevFacingLeftRef.current !== facingLeft) {
      // Direction changed, trigger flip animation
      setIsFlipping(true);

      // Clear animation after it completes
      const timer = setTimeout(() => {
        setIsFlipping(false); // Match animation duration
      }, 400);

      // Update ref to current direction
      prevFacingLeftRef.current = facingLeft;

      return () => clearTimeout(timer);
    }
  }, [facingLeft]);

  // Calculate fish size based on rarity
  const getFishSize = () => {
    const rarityFactor: Record<RarityType, number> = {
      common: 80,
      uncommon: 90,
      rare: 100,
      epic: 110,
      legendary: 120,
      exotic: 130,
    };
    // Get the lowercase rarity and check if it's a valid key
    const rarityKey = fish.rarity as RarityType;

    // Default to medium size if rarity is not recognized
    const baseSize = rarityFactor[rarityKey] || 100;

    return Math.round(baseSize);
  };

  const fishSize = getFishSize();

  // Get the correct image based on direction
  const getCorrectFishImage = () => {
    const originalImagePath = fish.image || '/fish/fish1.png';
    const fallbackImage = '/fish/fish1.png';

    try {
      const knownValidFish = [
        '/fish/fish1.png',
        '/fish/fish2.png',
        '/fish/fish3.png',
        '/fish/fish4.png',
      ];

      if (!facingLeft) {
        const isKnownFish = knownValidFish.some(validPath =>
          originalImagePath.endsWith(validPath)
        );

        // Check if fish is moving right (not facing left)
        if (isKnownFish) {
          // For RIGHT movement, use flipped images
          return originalImagePath.replace('.png', '-flip.png');
        } else {
          return '/fish/fish1-flip.png';
        }
      } else {
        // For LEFT movement, use original images
        if (originalImagePath.includes('-flip.')) {
          return originalImagePath.replace('-flip.', '.');
        }

        return originalImagePath;
      }
    } catch (error) {
      console.error('Error determining fish image:', error);
      return fallbackImage;
    }
  };

  const fishImage = getCorrectFishImage();

  //Handle image loading errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = '/fish/fish1.png';
  };

  // Determine bubble position based on facing direction
  const bubblePosition = facingLeft ? 'right-[-5px]' : 'left-[-5px]';

  // Enhanced animation based on behavior state
  const getAnimationProps = (): MotionAnimationProps => {
    switch (behaviorState) {
      case 'feeding':
        return {
          animate: {
            rotate: [-2, 2, -2],
            y: [0, -1, 0],
            scale: [1, 1.05, 1], // Slight excitement scaling
          },
          transition: {
            duration: 0.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
      case 'darting':
        return {
          animate: {
            rotate: [-1, 1, -1],
            y: [0, 1, 0],
          },
          transition: {
            duration: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
      case 'hovering':
        return {
          animate: {
            rotate: [-0.5, 0.5, -0.5],
            y: [0, 3, 0],
          },
          transition: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
      case 'exploring':
        return {
          animate: {
            rotate: [-1.5, 1.5, -1.5],
            y: [0, 1.5, 0],
            scale: [1, 1.02, 1],
          },
          transition: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
      case 'playful':
        return {
          animate: {
            rotate: [-3, 3, -3],
            y: [0, -2, 0],
            scale: [1, 1.08, 1],
          },
          transition: {
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
      default:
        return {
          animate: {
            rotate: [-1, 1, -1],
            y: [0, 2, 0],
          },
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        };
    }
  };

  const animationProps = getAnimationProps();

  // Get visual effects based on behavior
  const getVisualEffects = () => {
    switch (behaviorState) {
      case 'feeding':
        return {
          zIndex: 15, // Higher z-index when feeding
        };
      case 'playful':
        return {
          zIndex: 12,
        };
      case 'darting':
        return {
          zIndex: 10,
        };
      case 'exploring':
        return {
          zIndex: 8,
        };
      default:
        return {
          zIndex: 1,
        };
    }
  };

  const visualEffects = getVisualEffects();

  // CSS classes for different behaviors
  const getFishClasses = () => {
    const baseClasses = 'transition-all hover:scale-105 fish-image';
    const flipClass = isFlipping ? 'fish-flipping' : '';
    const behaviorClass = behaviorState === 'feeding' ? 'fish-feeding' : '';

    return `${baseClasses} ${flipClass} ${behaviorClass}`.trim();
  };

  // Get behavior display text
  const getBehaviorDisplay = () => {
    switch (behaviorState) {
      case 'feeding':
        return ' • 🍽️ Feeding';
      case 'exploring':
        return ' • 🔍 Exploring';
      case 'playful':
        return ' • 🎉 Playful';
      case 'darting':
        return ' • ⚡ Darting';
      case 'hovering':
        return ' • 🌊 Hovering';
      default:
        return '';
    }
  };

  return (
    <>
      <motion.div
        className='absolute cursor-pointer group'
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          zIndex: visualEffects.zIndex,
          ...style,
        }}
        transition={{
          type: 'spring',
          stiffness:
            behaviorState === 'feeding'
              ? 150
              : behaviorState === 'playful'
                ? 130
                : 100,
          damping:
            behaviorState === 'feeding'
              ? 20
              : behaviorState === 'playful'
                ? 18
                : 15,
          mass: 0.8,
        }}
      >
        <div className='relative'>
          <motion.div
            {...animationProps}
            style={{
              display: 'inline-block',
            }}
          >
            <div className='relative'>
              <img
                src={fishImage || '/placeholder.svg'}
                alt={fish.name}
                width={fishSize}
                height={fishSize}
                className={getFishClasses()}
                onError={handleImageError}
              />

              {/* Enhanced glow for feeding fish */}
              {behaviorState === 'feeding' && (
                <div className='absolute top-0 left-0 w-full h-full rounded-full opacity-20 -z-10 fish-feeding-glow' />
              )}

              {/* Playful glow */}
              {behaviorState === 'playful' && (
                <div className='absolute top-0 left-0 w-full h-full rounded-full opacity-15 -z-10 fish-playful-glow' />
              )}

              {/* Subtle glow for depth */}
              <div className='absolute top-0 left-0 w-full h-full rounded-full opacity-10 -z-10 fish-depth-glow' />
            </div>
          </motion.div>

          {/* Enhanced Tooltip on hover */}
          <div className='absolute -top-32 left-1/2 transform -translate-x-1/2 bg-blue-900/90 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 min-w-[180px] border border-blue-400/30 shadow-lg'>
            <div className='flex flex-col gap-1'>
              <div className='font-bold text-white text-center text-sm mb-1'>
                {fish.name}
              </div>
              <div className='text-xs text-blue-200 text-center mb-2'>
                {fish.rarity} • Gen {fish.generation} {getBehaviorDisplay()}
              </div>

              {/* Indicators */}
              <div className='mt-1'>
                <FishStatus indicators={indicators} size='sm' showLabels />
              </div>
            </div>

            {/* Tooltip arrow */}
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-900/90 rotate-45 -z-10 border-b border-r border-blue-400/30'></div>
          </div>

          {/* Enhanced bubbles for active behaviors */}
          {(behaviorState === 'darting' ||
            behaviorState === 'feeding' ||
            behaviorState === 'playful') && (
            <motion.div
              className={`absolute ${bubblePosition} top-1/2 -translate-y-1/2`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 0.8, 1],
                x: facingLeft ? [0, -10] : [0, 10],
              }}
              transition={{
                duration:
                  behaviorState === 'feeding'
                    ? 0.5
                    : behaviorState === 'playful'
                      ? 0.4
                      : 0.7,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay:
                  behaviorState === 'feeding'
                    ? 0.2
                    : behaviorState === 'playful'
                      ? 0.1
                      : 0.3,
                ease: 'easeInOut',
              }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  behaviorState === 'feeding'
                    ? 'bg-yellow-300/40'
                    : behaviorState === 'playful'
                      ? 'bg-pink-300/40'
                      : 'bg-white/25'
                }`}
              />
            </motion.div>
          )}

          {(behaviorState === 'feeding' || behaviorState === 'playful') && (
            <motion.div
              className='absolute -top-6 left-1/2 transform -translate-x-1/2'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <div className='text-xs'>
                {behaviorState === 'feeding'
                  ? '🍽️'
                  : behaviorState === 'playful'
                    ? '🎉'
                    : ''}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
