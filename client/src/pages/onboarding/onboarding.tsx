'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BubblesBackground } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { FishCard } from '@/components/ui/fish-card/fish-card';
import { useAquarium } from '@/hooks/dojo';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useFish } from '@/hooks';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileOnboardingView } from '@/components/mobile/mobile-onboarding-view';
import { CairoCustomEnum } from 'starknet';
import { SpeciesEnum } from '@/typescript/models.gen';
import { WalletAccount } from '@/types';
// Removed unused import

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
  const { getPlayerAquariums } = useAquarium();
  const { newFish } = useFish();

  // Mobile detection
  const { isMobile } = useMobileDetection();

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
  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return <MobileOnboardingView />;
  }

  // Desktop/tablet view
  return (
    <OrientationLock>
      <div className='relative min-h-screen overflow-y-auto bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800'>
        {/* Ambient lights */}
        <div className='absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-2xl' />
        <div className='absolute bottom-10 right-10 w-[350px] h-[350px] bg-yellow-300/10 rounded-full blur-2xl' />

        <BubblesBackground bubbles={bubbles} />

        <div className='absolute top-6 right-6 z-50 pointer-events-auto p-2'>
          <Button
            onClick={handleContinue}
            disabled={selectedFish.length !== 2}
            className='bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative z-50 cursor-pointer'
          >
            Next
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>

        <main className='relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 pointer-events-auto'>
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
                We see you're new to our aquatic adventure. To get you started,
                we've gifted you a personalized aquarium and two unique fish to
                choose from as your initial companions.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full'
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
              {selectedFish.length === 0 && 'Select 2 fish to continue'}
              {selectedFish.length === 1 && 'Select 1 more fish'}
              {selectedFish.length === 2 && 'Perfect! You can now continue'}
            </p>
          </motion.div>
        </main>
      </div>
    </OrientationLock>
  );
}
