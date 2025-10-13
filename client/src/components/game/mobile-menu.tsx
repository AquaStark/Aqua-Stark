'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GameButton } from './game-button';
import { Grid, X } from 'lucide-react';

interface MobileMenuProps {
  aquariums: Array<{
    id: number;
    name: string;
  }>;
  selectedAquarium: {
    id: number;
    name: string;
  };
  onAquariumSelect: (aquarium?: any) => void;
  isFeeding: boolean;
  timeRemaining: number;
  onStartFeeding: () => void;
  onStopFeeding: () => void;
  onItemClick: (itemId: string) => void;
}

const NAV_ITEMS = [
  {
    id: 'clean',
    icon: '🧽',
    label: 'Clean',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'shop',
    icon: '🛒',
    label: 'Shop',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'collection',
    icon: '🐠',
    label: 'Collection',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'games',
    icon: '🎮',
    label: 'Games',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'rewards',
    icon: '🎁',
    label: 'Rewards',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'tips',
    icon: '💡',
    label: 'Tips',
    color: 'from-orange-400 to-orange-600',
  },
];

export function MobileMenu({
  aquariums,
  selectedAquarium,
  onAquariumSelect,
  isFeeding,
  timeRemaining,
  onStartFeeding,
  onStopFeeding,
  onItemClick,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    onItemClick(itemId);
    setIsOpen(false); // Close menu after selection
  };

  const progress = isFeeding && timeRemaining > 0 ? ((30000 - timeRemaining) / 30000) * 100 : 0;

  return (
    <>
      {/* Menu Toggle Button */}
      <div className='fixed bottom-4 right-4 z-50 sm:hidden'>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700',
            'flex items-center justify-center text-white shadow-lg',
            'border-2 border-white/20 backdrop-blur-sm',
            'transition-all duration-200 hover:scale-105 active:scale-95'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <Grid size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden'
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed bottom-0 left-0 right-0 z-50 sm:hidden'
            >
              <div className='bg-gradient-to-t from-blue-900/95 to-blue-800/95 backdrop-blur-lg border-t border-white/20 rounded-t-3xl p-6 pb-8'>
                {/* Aquarium Selection */}
                <div className='mb-6'>
                  <h3 className='text-white font-bold text-lg mb-3'>Aquariums</h3>
                  <div className='flex gap-2 overflow-x-auto scrollbar-hide'>
                    {aquariums.map(aquarium => (
                      <button
                        key={aquarium.id}
                        onClick={() => {
                          onAquariumSelect(aquarium);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap',
                          selectedAquarium.id === aquarium.id
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                            : 'bg-blue-800/50 text-white/70 hover:bg-blue-700/50'
                        )}
                      >
                        {aquarium.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        onAquariumSelect();
                        setIsOpen(false);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2',
                        selectedAquarium.id === 0
                          ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                          : 'bg-blue-800/50 text-white/70 hover:bg-blue-700/50'
                      )}
                    >
                      <Grid size={16} />
                      View All
                    </button>
                  </div>
                </div>

                {/* Feed Button */}
                <div className='mb-6'>
                  <h3 className='text-white font-bold text-lg mb-3'>Actions</h3>
                  <div className='flex justify-center'>
                    <motion.div
                      className='relative'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GameButton
                        icon={isFeeding ? '⏱️' : '🍽️'}
                        color={isFeeding ? 'from-orange-500 to-red-600' : 'from-green-400 to-blue-500'}
                        tooltip={isFeeding ? 'Stop Feeding' : 'Feed Fish'}
                        onClick={isFeeding ? onStopFeeding : onStartFeeding}
                        className={cn(
                          'w-16 h-16 transition-all duration-200 ease-out',
                          isFeeding ? 'animate-pulse ring-2 ring-orange-400/50' : ''
                        )}
                      />
                      {isFeeding && (
                        <div className='absolute inset-0 pointer-events-none'>
                          <div
                            className='absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear rounded-b-xl'
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                  {isFeeding && timeRemaining > 0 && (
                    <div className='text-center text-orange-300 font-mono text-sm mt-2'>
                      {Math.ceil(timeRemaining / 1000)}s remaining
                    </div>
                  )}
                </div>

                {/* Navigation Items */}
                <div>
                  <h3 className='text-white font-bold text-lg mb-3'>Menu</h3>
                  <div className='grid grid-cols-3 gap-3'>
                    {NAV_ITEMS.map(item => (
                      <motion.div
                        key={item.id}
                        className='flex flex-col items-center gap-2'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <GameButton
                          icon={item.icon}
                          color={item.color}
                          tooltip={item.label}
                          onClick={() => handleItemClick(item.id)}
                          className={cn(
                            'w-12 h-12 transition-all duration-200 ease-out',
                            'hover:shadow-lg active:scale-95',
                            'backdrop-blur-sm text-white border border-white/20 shadow-lg',
                            activeItem === item.id ? 'ring-2 ring-white/30 scale-105' : ''
                          )}
                        />
                        <span className='text-xs text-white/80 font-medium text-center'>
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
