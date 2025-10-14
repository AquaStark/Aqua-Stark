'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GameButton } from './game-button';

// Interface defining the props for the BottomNavBar component
interface BottomNavBarProps {
  isFeeding: boolean;
  timeRemaining: number;
  onStartFeeding: () => void;
  onStopFeeding: () => void;
}

// Array of navigation items with their properties
const OTHER_NAV_ITEMS = [
  {
    id: 'clean',
    icon: '🧽',
    label: 'Clean',
  },
  {
    id: 'shop',
    icon: '🛒',
    label: 'Shop',
  },
  {
    id: 'collection',
    icon: '🐠',
    label: 'Collection',
  },
  {
    id: 'games',
    icon: '🎮',
    label: 'Games',
  },
  {
    id: 'rewards',
    icon: '🎁',
    label: 'Rewards',
  },
];

/**
 * Bottom Navigation Bar component for the aquarium game
 * Provides access to feeding functionality and other game actions
 */
export function BottomNavBar({
  isFeeding,
  timeRemaining,
  onStartFeeding,
  onStopFeeding,
}: BottomNavBarProps) {
  // State to track which navigation item is currently active
  const [activeItem, setActiveItem] = useState<string | null>(null);

  /**
   * Handles click events on navigation items
   * @param itemId - The ID of the clicked navigation item
   */
  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);

    // Execute different actions based on the clicked item
    switch (itemId) {
      case 'clean':
        break;
      case 'shop':
        break;
      case 'collection':
        break;
      case 'games':
        break;
      case 'rewards':
        break;
    }
  };

  // Calculate progress percentage for the feeding timer (30 seconds total)
  const progress =
    isFeeding && timeRemaining > 0
      ? ((30000 - timeRemaining) / 30000) * 100
      : 0;

  return (
    <div className='flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto scrollbar-hide'>
      {/* Feed button section with special handling for feeding state */}
      <motion.div
        className='flex flex-col items-center gap-1 relative'
        // Hover and tap animations
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className='relative overflow-hidden rounded-xl'>
          {/* Feed button with dynamic properties based on feeding state */}
          <GameButton
            icon={isFeeding ? '⏱️' : '🍽️'}
            color={
              isFeeding
                ? 'from-orange-500 to-red-600'
                : 'from-green-400 to-blue-500'
            }
            tooltip={isFeeding ? 'Stop Feeding' : 'Feed Fish'}
            onClick={isFeeding ? onStopFeeding : onStartFeeding}
            className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-out hover:shadow-lg active:scale-95 ${
              isFeeding ? 'animate-pulse ring-2 ring-orange-400/50' : ''
            }`}
          />

          {/* Progress bar shown during feeding */}
          {isFeeding && (
            <div className='absolute inset-0 pointer-events-none'>
              <div
                className='absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear rounded-b-xl'
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Animated particles shown during feeding */}
          {isFeeding && (
            <div className='absolute inset-0 pointer-events-none overflow-hidden rounded-xl'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping'
                  style={{
                    left: `${25 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '1.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feed button label */}
        <span className='text-xs text-white/80 font-medium hidden sm:block'>
          Feed
        </span>

        {/* Timer display during feeding */}
        {isFeeding && timeRemaining > 0 && (
          <div className='text-xs text-orange-300 font-mono'>
            {Math.ceil(timeRemaining / 1000)}s
          </div>
        )}
      </motion.div>

      {/* Render other navigation items */}
      {OTHER_NAV_ITEMS.map(item => (
        <motion.div
          key={item.id}
          className='flex flex-col items-center gap-1'
          // Hover and tap animations
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <GameButton
            icon={item.icon}
            color='from-blue-500/30 to-blue-600/30'
            tooltip={item.label}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ease-out',
              'hover:shadow-lg active:scale-95',
              'bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm text-white border border-blue-400/40 shadow-lg hover:shadow-blue-400/30',
              // Highlight active item with ring
              activeItem === item.id ? 'ring-2 ring-white/30 scale-105' : ''
            )}
          />
          {/* Item label */}
          <span className='text-xs text-white/80 font-medium hidden sm:block'>
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
