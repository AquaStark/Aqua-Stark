'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GameButton } from './game-button';

interface BottomNavBarProps {
  isFeeding: boolean;
  timeRemaining: number;
  onStartFeeding: () => void;
  onStopFeeding: () => void;
}

const OTHER_NAV_ITEMS = [
  {
    id: 'clean',
    icon: '🧽',
    label: 'Clean',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'shop',
    icon: '🛒',
    label: 'Shop',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'collection',
    icon: '🐠',
    label: 'Collection',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 'games',
    icon: '🎮',
    label: 'Games',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'rewards',
    icon: '🎁',
    label: 'Rewards',
    color: 'from-yellow-500 to-orange-500',
  },
];

export function BottomNavBar({
  isFeeding,
  timeRemaining,
  onStartFeeding,
  onStopFeeding,
}: BottomNavBarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);

    switch (itemId) {
      case 'clean':
        console.log('Clean tank action triggered');
        break;
      case 'shop':
        console.log('Shop opened');
        break;
      case 'collection':
        console.log('Fish collection opened');
        break;
      case 'games':
        console.log('Mini-games opened');
        break;
      case 'rewards':
        console.log('Daily rewards opened');
        break;
    }
  };

  const progress =
    isFeeding && timeRemaining > 0
      ? ((30000 - timeRemaining) / 30000) * 100
      : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='fixed bottom-16 left-0 right-0 flex justify-center z-40'
    >
      <div className='relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-2xl' />

        <div className='relative flex items-center justify-center gap-6'>
          <motion.div
            className='flex flex-col items-center gap-1 relative'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className='relative overflow-hidden rounded-xl'>
              <GameButton
                icon={isFeeding ? '⏱️' : '🍽️'}
                color={
                  isFeeding
                    ? 'from-orange-500 to-red-600'
                    : 'from-green-400 to-blue-500'
                }
                tooltip={isFeeding ? 'Stop Feeding' : 'Feed Fish'}
                onClick={isFeeding ? onStopFeeding : onStartFeeding}
                className={`w-12 h-12 transition-all duration-200 ease-out hover:shadow-lg active:scale-95 ${
                  isFeeding ? 'animate-pulse ring-2 ring-orange-400/50' : ''
                }`}
              />

              {isFeeding && (
                <div className='absolute inset-0 pointer-events-none'>
                  <div
                    className='absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear rounded-b-xl'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

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

            <span className='text-xs text-white/80 font-medium'>Feed</span>
            {isFeeding && timeRemaining > 0 && (
              <div className='text-xs text-orange-300 font-mono'>
                {Math.ceil(timeRemaining / 1000)}s
              </div>
            )}
          </motion.div>

          {OTHER_NAV_ITEMS.map(item => (
            <motion.div
              key={item.id}
              className='flex flex-col items-center gap-1'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GameButton
                icon={item.icon}
                color={item.color}
                tooltip={item.label}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  'w-12 h-12 transition-all duration-200 ease-out',
                  'hover:shadow-lg active:scale-95',
                  activeItem === item.id ? 'ring-2 ring-white/30 scale-105' : ''
                )}
              />
              <span className='text-xs text-white/80 font-medium'>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
