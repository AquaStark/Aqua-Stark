'use client';

import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { BubblesBackground } from '@/components';
import { AquariumCard } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import type { Aquarium } from '@/types';

interface MobileAquariumsViewProps {
  aquariums: Aquarium[];
  filteredAquariums: Aquarium[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectAquarium: (aquarium: Aquarium) => void;
  onBackToGame: () => void;
  onCreateAquarium: () => void;
  coinBalance: number;
  loading: boolean;
  error: string | null;
  effectivePlayerAddress: string | null;
  totalFish: number;
  premiumAquariums: number;
  averageHealth: number;
}

export function MobileAquariumsView({
  aquariums,
  filteredAquariums,
  searchQuery,
  onSearchChange,
  onSelectAquarium,
  onBackToGame,
  onCreateAquarium,
  coinBalance,
  loading,
  error,
  effectivePlayerAddress,
  totalFish,
  premiumAquariums,
  averageHealth,
}: MobileAquariumsViewProps) {
  const bubbles = useBubbles({
    initialCount: 12,
    maxBubbles: 30,
    minSize: 8,
    maxSize: 25,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  return (
    <OrientationLock forcePortrait={false}>
      <div className='relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900'>
        {/* Oceanic background */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute inset-0 bg-gradient-to-b from-[#001a2e] via-[#021d3b] to-[#000d1a] opacity-95' />
          {/* Glow spots for dynamic lighting */}
          <div className='absolute top-10 left-1/4 w-72 h-40 bg-cyan-400/10 blur-3xl rounded-full' />
          <div className='absolute bottom-20 right-1/5 w-80 h-32 bg-purple-400/10 blur-3xl rounded-full' />
        </div>

        {/* Bubbles animation overlay */}
        <BubblesBackground bubbles={bubbles} className='z-10' />

        {/* Fixed Header */}
        <div className='fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-md border-b border-blue-400/30 shadow-lg'>
          <div className='flex items-center justify-between px-4 py-3 gap-2'>
            {/* Back button */}
            <button
              onClick={onBackToGame}
              className='flex items-center justify-center w-10 h-10 bg-blue-600/50 hover:bg-blue-600/70 border border-blue-400/30 text-white rounded-lg transition-all duration-200 active:scale-95 touch-manipulation'
              aria-label='Back to Game'
            >
              <ArrowLeft className='h-5 w-5' />
            </button>

            {/* Title */}
            <h1 className='flex-1 text-center text-lg font-bold text-white truncate'>
              My Aquariums
            </h1>

            {/* Coins */}
            <div className='flex items-center px-3 py-1.5 border rounded-full bg-blue-700/60 border-blue-400/50 min-w-fit'>
              <img
                src='/icons/coin.png'
                alt='Coins'
                className='w-4 h-4 mr-1.5'
              />
              <span className='font-bold text-white text-sm'>
                {coinBalance}
              </span>
            </div>
          </div>

          {/* Search Bar - Inside Header */}
          <div className='px-4 pb-3'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-4 w-4 text-blue-200' />
              </div>
              <input
                type='text'
                placeholder='Search aquariums...'
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className='w-full bg-blue-600/40 border border-blue-400/30 text-white placeholder-blue-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300'
                aria-label='Search aquariums'
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='pt-28 pb-24 h-full overflow-y-auto overscroll-y-contain scrollbar-thin scrollbar-thumb-blue-400/50 scrollbar-track-blue-900/30'>
          <div className='px-4 space-y-4'>
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-red-600/40 border border-red-400/50 rounded-xl p-4 backdrop-blur-sm'
              >
                <div className='text-red-200 text-xs font-medium mb-1'>
                  Error
                </div>
                <div className='text-white text-sm'>{error}</div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className='flex flex-col justify-center items-center py-16'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-300 mb-3'></div>
                <div className='text-white text-base font-medium'>
                  Loading your aquariums...
                </div>
                <div className='text-blue-200 text-xs mt-1'>
                  Syncing from backend and blockchain
                </div>
              </div>
            )}

            {/* No Wallet Connected */}
            {!effectivePlayerAddress && !loading && (
              <div className='text-center py-16'>
                <div className='text-white text-xl font-bold mb-2'>
                  👋 Welcome to Aqua Stark
                </div>
                <div className='text-blue-200 text-sm mb-6'>
                  Connect your wallet to view and manage your aquariums
                </div>
              </div>
            )}

            {/* Stats Cards - Compact Mobile Design */}
            {!loading && effectivePlayerAddress && aquariums.length > 0 && (
              <div className='grid grid-cols-2 gap-2 mb-4'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='bg-blue-600/40 border border-blue-400/30 rounded-xl p-3 backdrop-blur-sm'
                >
                  <div className='text-blue-200 text-xs font-medium mb-1'>
                    Aquariums
                  </div>
                  <div className='text-white text-2xl font-bold'>
                    {aquariums.length}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className='bg-blue-600/40 border border-blue-400/30 rounded-xl p-3 backdrop-blur-sm'
                >
                  <div className='text-blue-200 text-xs font-medium mb-1'>
                    Total Fish
                  </div>
                  <div className='text-white text-2xl font-bold'>
                    {totalFish}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className='bg-blue-600/40 border border-blue-400/30 rounded-xl p-3 backdrop-blur-sm'
                >
                  <div className='text-blue-200 text-xs font-medium mb-1'>
                    Premium
                  </div>
                  <div className='text-white text-2xl font-bold'>
                    {premiumAquariums}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className='bg-blue-600/40 border border-blue-400/30 rounded-xl p-3 backdrop-blur-sm'
                >
                  <div className='text-blue-200 text-xs font-medium mb-1'>
                    Avg Health
                  </div>
                  <div className='text-white text-2xl font-bold'>
                    {averageHealth}%
                  </div>
                </motion.div>
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              effectivePlayerAddress &&
              filteredAquariums.length === 0 &&
              aquariums.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center py-16'
                >
                  <div className='text-white text-xl font-bold mb-2'>
                    🐠 No aquariums yet
                  </div>
                  <div className='text-blue-200 text-sm mb-6'>
                    Create your first aquarium to start your underwater
                    adventure!
                  </div>
                  <button
                    onClick={onCreateAquarium}
                    disabled
                    className='bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg opacity-50 cursor-not-allowed touch-manipulation'
                  >
                    Create First Aquarium (Disabled)
                  </button>
                </motion.div>
              )}

            {/* No Results from Search */}
            {!loading &&
              effectivePlayerAddress &&
              filteredAquariums.length === 0 &&
              aquariums.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='bg-blue-800/40 border border-blue-700/50 rounded-xl p-8 text-center'
                >
                  <p className='text-blue-200 text-base'>
                    No aquariums found matching "{searchQuery}"
                  </p>
                </motion.div>
              )}

            {/* Aquariums List - Single Column for Mobile */}
            {!loading &&
              effectivePlayerAddress &&
              filteredAquariums.length > 0 && (
                <div className='space-y-4'>
                  <h2 className='text-lg font-bold text-white mb-2'>
                    My Collection ({filteredAquariums.length})
                  </h2>
                  {filteredAquariums.map((aquarium, index) => (
                    <motion.div
                      key={aquarium.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        onClick={() => onSelectAquarium(aquarium)}
                        className='touch-manipulation active:scale-[0.98] transition-transform duration-150'
                      >
                        <AquariumCard
                          aquarium={aquarium}
                          onSelect={() => onSelectAquarium(aquarium)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            {/* Bottom Spacer for FAB */}
            <div className='h-4' />
          </div>
        </div>

        {/* Floating Action Button - Create Aquarium - DISABLED */}
        {/* {effectivePlayerAddress && !loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateAquarium}
            className='fixed bottom-20 right-4 z-40 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center transition-all duration-200 touch-manipulation'
            aria-label='Create New Aquarium'
            disabled
          >
            <Plus className='h-6 w-6' />
          </motion.button>
        )} */}
      </div>
    </OrientationLock>
  );
}
