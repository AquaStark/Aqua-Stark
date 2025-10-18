'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BubblesBackground } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { FishCard } from '@/components/ui/fish-card/fish-card';
import { useAquarium } from '@/hooks/dojo';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useGameEnhanced } from '@/hooks/dojo/useAdditionalContracts';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileOnboardingView } from '@/components/mobile/mobile-onboarding-view';
import { CairoCustomEnum } from 'starknet';
import { SpeciesEnum } from '@/typescript/models.gen';

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

export default function Onboarding() {
  const navigate = useNavigate();
  const bubbles = useBubbles();
  const { account } = useAccount();
  const [selectedFish, setSelectedFish] = useState<number[]>([]);
  const { getPlayerAquariums, newAquarium } = useAquarium();
  const { newFish } = useGameEnhanced();

  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Step states
  const [aquariumId, setAquariumId] = useState<bigint | null>(null);
  const [aquariumCreated, setAquariumCreated] = useState(false);
  const [fishCreated, setFishCreated] = useState(false);
  const [isCreatingAquarium, setIsCreatingAquarium] = useState(false);
  const [isCreatingFish, setIsCreatingFish] = useState(false);

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

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Step 1: Create Aquarium
  const handleCreateAquarium = async () => {
    if (!account) {
      toast.error('Wallet not connected!');
      return;
    }

    try {
      setIsCreatingAquarium(true);
      console.log('🏗️ Creating aquarium with params:', {
        owner: account.address,
        maxCapacity: 10,
        maxDecorations: 5,
      });
      toast.loading('Creating your aquarium...', { id: 'aquarium' });

      const tx = await newAquarium(
        account as any,
        account.address,
        10, // maxCapacity
        5 // maxDecorations
      );

      console.log('✅ Aquarium created, tx:', tx.transaction_hash);
      toast.success('Aquarium created on-chain!', { id: 'aquarium' });

      // Wait a moment for the transaction to be indexed
      await delay(2000);

      // Get the newly created aquarium
      const aquariums = await getPlayerAquariums(account.address);
      const newAquariumId = aquariums[aquariums.length - 1]?.id;

      if (!newAquariumId) {
        throw new Error('Aquarium created but ID not found');
      }

      console.log('🏠 Aquarium ID:', newAquariumId);
      setAquariumId(newAquariumId);
      setAquariumCreated(true);
    } catch (error) {
      console.error('❌ Error creating aquarium:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        errorMessage.includes('User canceled')
          ? 'You cancelled the transaction'
          : 'Failed to create aquarium',
        { id: 'aquarium' }
      );
    } finally {
      setIsCreatingAquarium(false);
    }
  };

  // Step 2: Create Fish
  const handleCreateFish = async () => {
    if (!account || !aquariumId || selectedFish.length !== 2) return;

    try {
      setIsCreatingFish(true);
      toast.loading('Creating your fish...', { id: 'fish' });

      for (let i = 0; i < 2; i++) {
        const order = i === 0 ? 'First' : 'Second';
        const speciesenum = fishEnumMap[selectedFish[i]];

        if (!speciesenum) {
          toast.error(`${order} fish not selected`);
          continue;
        }

        console.log(
          `🐟 Creating ${order} fish (species ID: ${selectedFish[i]})`
        );
        const tx = await newFish(account as any, aquariumId, speciesenum);
        console.log(`✅ ${order} fish created, tx:`, tx.transaction_hash);
        toast.success(`${order} fish created!`);

        if (i < 1) await delay(5000);
      }

      toast.success('All fish created! 🎉', { id: 'fish' });
      setFishCreated(true);
    } catch (error) {
      console.error('❌ Error creating fish:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(
        errorMessage.includes('USER_REFUSED_OP')
          ? 'You cancelled the transaction'
          : 'Failed to create fish',
        { id: 'fish' }
      );
    } finally {
      setIsCreatingFish(false);
    }
  };

  // Step 3: Go to Game
  const handleGoToGame = () => {
    if (!aquariumId) return;
    console.log('🎉 Navigating to game with aquarium:', aquariumId);
    navigate(`/game?aquarium=${aquariumId}`);
  };
  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return <MobileOnboardingView />;
  }

  // Desktop/tablet view
  return (
    <OrientationLock>
      <div className='relative h-screen overflow-y-auto bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800'>
        {/* Ambient lights */}
        <div className='absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-2xl' />
        <div className='absolute bottom-10 right-10 w-[350px] h-[350px] bg-yellow-300/10 rounded-full blur-2xl' />

        <BubblesBackground bubbles={bubbles} />

        <div className='absolute top-6 right-6 z-50 pointer-events-auto p-2'>
          {!aquariumCreated && (
            <Button
              onClick={handleCreateAquarium}
              disabled={isCreatingAquarium}
              className='bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isCreatingAquarium ? 'Creating...' : 'Obtener Acuario Gratis'}
            </Button>
          )}

          {aquariumCreated && !fishCreated && (
            <Button
              onClick={handleCreateFish}
              disabled={selectedFish.length !== 2 || isCreatingFish}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isCreatingFish ? 'Creating Fish...' : 'Obtener Peces'}
            </Button>
          )}

          {fishCreated && (
            <Button
              onClick={handleGoToGame}
              className='bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg animate-pulse'
            >
              Ir al Juego
            </Button>
          )}
        </div>

        <main className='relative z-20 flex flex-col items-center px-4 py-16 pointer-events-auto min-h-[120vh]'>
          <div className='flex flex-col items-center justify-center min-h-[120vh] w-full'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-center mb-12'
            >
              <h1 className='text-4xl sm:text-5xl font-extrabold uppercase tracking-widest text-white drop-shadow-lg mb-6'>
                Welcome to Aqua Stark!
              </h1>
              <div className='bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl text-white/90 shadow-md max-w-2xl mx-auto'>
                <p className='text-lg md:text-xl leading-relaxed'>
                  We see you're new to our aquatic adventure. To get you
                  started, we've gifted you a personalized aquarium and two
                  unique fish to choose from as your initial companions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full ${
                !aquariumCreated ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {starterFish.map((fish, index) => (
                <motion.div
                  key={fish.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <FishCard
                    fish={fish}
                    isSelected={selectedFish.includes(fish.id)}
                    onSelect={() => handleFishSelect(fish.id)}
                    variant='onboarding'
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className='mt-8 text-center'
            >
              <p className='text-white/90 text-lg'>
                {!aquariumCreated && 'Click "Get Free Aquarium" to start'}
                {aquariumCreated &&
                  !fishCreated &&
                  selectedFish.length === 0 &&
                  'Select 2 fish to continue'}
                {aquariumCreated &&
                  !fishCreated &&
                  selectedFish.length === 1 &&
                  'Select 1 more fish'}
                {aquariumCreated &&
                  !fishCreated &&
                  selectedFish.length === 2 &&
                  'Click "Get Fish" to continue'}
                {fishCreated && 'Click "Go to Game" to start playing!'}
              </p>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className='relative z-30 p-4 bg-blue-900/90 backdrop-blur-md border-t border-blue-400/50'>
          <div className='text-center text-blue-100 text-sm'>
            <p className='mb-2'>© 2025 Aqua Stark - All rights reserved</p>
            <div className='flex flex-wrap justify-center gap-2 text-sm'>
              <span className='hover:text-blue-200 cursor-pointer px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>
                Polity and Privacy
              </span>
              <span className='hover:text-blue-200 cursor-pointer px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>
                Terms of Service
              </span>
              <span className='hover:text-blue-200 cursor-pointer px-2 py-1 rounded hover:bg-blue-500/20 transition-colors'>
                Contact
              </span>
            </div>
          </div>
        </footer>
      </div>
    </OrientationLock>
  );
}
