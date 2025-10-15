'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';
import { useAquarium } from '@/hooks/dojo';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useFish } from '@/hooks';
import { CairoCustomEnum } from 'starknet';
import { SpeciesEnum } from '@/typescript/models.gen';
import { WalletAccount } from '@/types';

// This map connects your frontend IDs to Cairo enum variants
const fishEnumMap: Record<number, SpeciesEnum> = {
  1: new CairoCustomEnum({ AngelFish: 'AngelFish' }),
  2: new CairoCustomEnum({ GoldFish: 'GoldFish' }),
  3: new CairoCustomEnum({ Betta: 'Betta' }),
  4: new CairoCustomEnum({ NeonTetra: 'NeonTetra' }),
  5: new CairoCustomEnum({ Corydoras: 'Corydoras' }),
  6: new CairoCustomEnum({ Hybrid: 'Hybrid' }),
};

const starterFish = [
  {
    id: 1,
    name: 'REDGLOW',
    image: '/fish/fish3.png',
    description: 'A vibrant and energetic fish, ideal for combat.',
    color: 'orange-red',
  },
  {
    id: 2,
    name: 'BLUESHINE',
    image: '/fish/fish1.png',
    description: 'A calm and elegant fish, perfect for exploration.',
    color: 'blue',
  },
  {
    id: 3,
    name: 'TROPICORAL',
    image: '/fish/fish2.png',
    description: 'An exotic and mysterious fish, with unique abilities.',
    color: 'orange-pink',
  },
  {
    id: 4,
    name: 'SHADOWFIN',
    image: '/fish/fish4.png',
    description: 'A stealthy and elusive fish, master of disguise.',
    color: 'purple',
  },
  {
    id: 5,
    name: 'SUNBURST',
    image: '/fish/fish1.png',
    description:
      'A radiant and cheerful fish, bringing light to your aquarium.',
    color: 'golden',
  },
  {
    id: 6,
    name: 'DEEPSCALE',
    image: '/fish/fish2.png',
    description: 'A resilient and ancient fish, with deep-sea wisdom.',
    color: 'deep-blue',
  },
];

export function MobileOnboardingView() {
  const navigate = useNavigate();
  const bubbles = useBubbles({ initialCount: 8, maxBubbles: 20 });
  const { account } = useAccount();
  const [selectedFish, setSelectedFish] = useState<number[]>([]);
  const { getPlayerAquariums } = useAquarium();
  const { newFish } = useFish();

  const handleFishSelect = (fishId: number) => {
    setSelectedFish(prev => {
      const newSelection = prev.includes(fishId)
        ? prev.filter(id => id !== fishId)
        : prev.length < 2
          ? [...prev, fishId]
          : [prev[1], fishId];
      return newSelection;
    });
  };

  //  Create Aquarium
  const createNewAquarium = async (account: WalletAccount) => {
    toast.success('Aquarium created successfully!');

    const aquariums = await getPlayerAquariums(account.address);

    return aquariums[0]?.id;
  };

  const createNewFish = async (
    account: WalletAccount,
    aquariumId: bigint,
    fishId: number,
    order: string
  ) => {
    try {
      const speciesenum = fishEnumMap[fishId];
      if (!speciesenum) {
        toast.error(`${order} fish not selected`);
        return null;
      }

      const tx = await newFish(account as any, aquariumId, speciesenum);

      return { success: true, transactionHash: tx.transaction_hash };
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message?.includes('USER_REFUSED_OP')) {
        toast.error(
          `You rejected the ${order} fish transaction in your wallet.`
        );
        return null;
      }
      console.error(`Error while creating ${order} fish:`, error);
      toast.error(`Something went wrong while creating ${order} fish.`);
      return null;
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleContinue = async () => {
    if (selectedFish.length !== 2) return;
    if (!account) {
      toast.error('Wallet not connected!');
      return;
    }

    try {
      const aquariumId = await createNewAquarium(account as any);
      if (!aquariumId) throw new Error("Couldn't create aquarium");

      for (let i = 0; i < 2; i++) {
        const order = i === 0 ? 'First' : 'Second';

        const result = await createNewFish(
          account as any,
          BigInt(aquariumId),
          selectedFish[i],
          order
        );

        if (result) {
          toast.success(`${order} fish created successfully in aquarium`);
        }

        if (i < selectedFish.length - 1) {
          await delay(5000);
        }
      }

      navigate(`/game?aquarium=${BigInt(aquariumId)}`);
    } catch (err) {
      console.error('Error during onboarding:', err);
      toast.error('Something went wrong while creating your aquarium.');
    }
  };

  return (
    <div className='relative w-full h-screen overflow-y-auto bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800'>
      {/* Ambient lights - mobile optimized */}
      <div className='absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-300/10 rounded-full blur-2xl' />
      <div className='absolute bottom-10 right-10 w-60 h-60 bg-yellow-300/10 rounded-full blur-2xl' />

      <BubblesBackground bubbles={bubbles} />

      {/* Mobile header */}
      <div className='relative z-30 p-3 bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <button
            onClick={() => window.history.back()}
            className='flex items-center text-white text-xs sm:text-sm touch-manipulation hover:bg-blue-500/50 px-2 py-1 rounded transition-colors'
          >
            <span className='mr-1'>←</span>
            Back
          </button>
          <h1 className='text-sm sm:text-base md:text-lg font-bold text-white'>Choose Your Fish</h1>
          <div className='w-12 sm:w-16' /> {/* Spacer */}
        </div>
      </div>

      {/* Mobile main content */}
      <main className='flex flex-col items-center px-2 sm:px-3 py-4 sm:py-6 relative z-30 min-h-[100vh] pb-20'>
        {/* Welcome section - responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-4 sm:mb-6'
        >
          <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg mb-2 sm:mb-3'>
            Welcome to Aqua Stark!
          </h1>
          <div className='bg-white/10 backdrop-blur-sm border border-white/20 px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl text-white/90 shadow-md max-w-xs sm:max-w-sm mx-auto'>
            <p className='text-xs sm:text-sm leading-relaxed'>
              Choose 2 fish to start your aquatic adventure. Each fish has unique abilities and characteristics.
            </p>
          </div>
        </motion.div>

        {/* Fish selection - responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg sm:max-w-xl md:max-w-2xl auto-rows-fr'
        >
          {starterFish.map((fish, index) => (
            <motion.div
              key={fish.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className='h-full'
            >
              <div 
                className={`relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer overflow-hidden transition-all duration-300 shadow-md h-full flex flex-col ${
                  selectedFish.includes(fish.id)
                    ? 'ring-2 ring-blue-300 scale-[1.02]'
                    : 'hover:scale-[1.015]'
                }`}
                onClick={() => handleFishSelect(fish.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFishSelect(fish.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {selectedFish.includes(fish.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='absolute top-1 right-1 sm:top-2 sm:right-2 bg-blue-500 rounded-full p-0.5 sm:p-1 z-20'
                  >
                    <Check className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
                  </motion.div>
                )}

                <div className='p-2 sm:p-4 text-center flex flex-col h-full'>
                  <h3 className='text-sm sm:text-lg font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide'>
                    {fish.name}
                  </h3>

                  <div className='relative w-24 h-24 sm:w-40 sm:h-40 mx-auto mb-2 sm:mb-4 flex-shrink-0 flex items-center justify-center'>
                    <div className='relative w-full h-full flex items-center justify-center'>
                      <div className='relative w-full h-full flex items-center justify-center'>
                        <img
                          src='/fish/fish-tank.svg'
                          alt='Fish Tank Background'
                          className='absolute inset-0 w-full h-full object-contain opacity-50'
                        />
                        <div className='relative z-10 w-4/5 h-4/5 flex items-center justify-center'>
                          <img
                            src={fish.image}
                            alt={fish.name}
                            className='w-16 h-16 sm:w-24 sm:h-24 object-contain'
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                          />
                        </div>
                        <img
                          src='/fish/fish-tank.svg'
                          alt='Fish Tank Overlay'
                          className='absolute inset-0 w-full h-full object-contain z-20 pointer-events-none mix-blend-overlay'
                        />
                      </div>
                    </div>
                  </div>

                  <p className='text-xs sm:text-sm text-white/80 leading-relaxed flex-grow'>
                    {fish.description}
                  </p>
                </div>

                <motion.div
                  className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'
                  initial={false}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Selection status - responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='mt-4 sm:mt-6 text-center'
        >
          <p className='text-white/90 text-xs sm:text-sm'>
            {selectedFish.length === 0 && 'Select 2 fish to continue'}
            {selectedFish.length === 1 && 'Select 1 more fish'}
            {selectedFish.length === 2 && 'Perfect! You can now continue'}
          </p>
        </motion.div>

        {/* Continue button - responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className='mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm'
        >
          <Button
            onClick={handleContinue}
            disabled={selectedFish.length !== 2}
            className='w-full bg-green-500 hover:bg-green-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation h-10 sm:h-12 text-sm sm:text-base'
          >
            Continue
            <ChevronRight className='w-3 h-3 sm:w-4 sm:h-4' />
          </Button>
        </motion.div>
      </main>

      {/* Mobile footer - at end of scroll */}
      <div className='relative z-30 p-2 sm:p-3 bg-blue-900/90 backdrop-blur-md border-t border-blue-400/50'>
        <div className='text-center text-blue-100 text-xs sm:text-sm'>
          <p className='mb-1 sm:mb-2'>© 2025 Aqua Stark - All rights reserved</p>
          <div className='flex flex-wrap justify-center gap-1 sm:gap-2 text-xs sm:text-sm'>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-1 sm:px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Polity and Privacy</span>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-1 sm:px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Terms of Service</span>
            <span className='hover:text-blue-200 cursor-pointer touch-manipulation px-1 sm:px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>Contact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
