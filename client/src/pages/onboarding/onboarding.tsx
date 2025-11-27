'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BubblesBackground, PageHeader } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { FishCard } from '@/components/ui/fish-card/fish-card';
import { useAquarium } from '@/hooks/dojo';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useAquaStarkEnhanced } from '@/hooks/dojo/useAquaStarkEnhanced';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileOnboardingView } from '@/components/mobile/mobile-onboarding-view';
import { CairoCustomEnum } from 'starknet';
import { useAquariumSync } from '@/hooks/use-aquarium-sync';
import { useFishSync } from '@/hooks/use-fish-sync';
import { useActiveAquarium } from '@/store/active-aquarium';

// This map connects your frontend IDs to Cairo enum variants
// Cairo enums use numeric indices, not names
const fishEnumMap: Record<number, CairoCustomEnum> = {
  1: new CairoCustomEnum({ AngelFish: {} }), // index 0
  2: new CairoCustomEnum({ GoldFish: {} }), // index 1
  3: new CairoCustomEnum({ Betta: {} }), // index 2
  4: new CairoCustomEnum({ NeonTetra: {} }), // index 3
  5: new CairoCustomEnum({ Corydoras: {} }), // index 4
  6: new CairoCustomEnum({ Hybrid: {} }), // index 5
};

// Map frontend IDs to species names for backend
const fishSpeciesMap: Record<number, string> = {
  1: 'AngelFish',
  2: 'GoldFish',
  3: 'Betta',
  4: 'NeonTetra',
  5: 'Corydoras',
  6: 'Hybrid',
};

const starterFish = [
  {
    id: 1,
    name: 'AngelFish',
    image: '/fish/fish1.png',
    description: 'A calm and elegant fish.',
    color: 'blue',
  },
  {
    id: 2,
    name: 'GoldFish',
    image: '/fish/fish2.png',
    description: 'A vibrant golden fish.',
    color: 'gold',
  },
  {
    id: 3,
    name: 'Betta',
    image: '/fish/fish3.png',
    description: 'A colorful fighting fish.',
    color: 'red',
  },
  {
    id: 4,
    name: 'NeonTetra',
    image: '/fish/fish4.png',
    description: 'A bright neon fish.',
    color: 'neon',
  },
  {
    id: 5,
    name: 'Corydoras',
    image: '/fish/fish5.png',
    description: 'A bottom-dwelling fish.',
    color: 'silver',
  },
  {
    id: 6,
    name: 'Hybrid',
    image: '/fish/fish6.png',
    description: 'A unique hybrid fish.',
    color: 'mixed',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const bubbles = useBubbles();
  const { account } = useAccount();
  const [selectedFish, setSelectedFish] = useState<number[]>([]);
  const { getPlayerAquariums, newAquarium } = useAquarium();
  const { newFish } = useAquaStarkEnhanced();
  const { syncAquarium } = useAquariumSync();
  const { syncFish } = useFishSync();
  const { setActiveAquariumId } = useActiveAquarium();

  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Step states
  const [aquariumId, setAquariumId] = useState<bigint | null>(null);
  const [aquariumCreated, setAquariumCreated] = useState(false);
  const [fishCreated, setFishCreated] = useState(false);
  const [isCreatingAquarium, setIsCreatingAquarium] = useState(false);
  const [isCreatingFish, setIsCreatingFish] = useState(false);

  // Check for existing aquariums on mount
  useEffect(() => {
    const checkExistingAquariums = async () => {
      if (!account?.address) return;

      try {
        console.log('🔍 Checking for existing aquariums on onboarding...');
        const response = await getPlayerAquariums(account.address);
        if (
          response &&
          response.success &&
          response.data &&
          response.data.length > 0
        ) {
          console.log('✅ Found existing aquarium, redirecting to game...');
          const primaryAquarium = response.data[0];
          const existingId = primaryAquarium.on_chain_id;

          setActiveAquariumId(existingId, account.address);
          toast.success('Existing aquarium found! resuming game...');
          navigate(`/loading?aquarium=${existingId}`);
        }
      } catch (error) {
        console.error('⚠️ Error checking existing aquariums:', error);
      }
    };

    checkExistingAquariums();
  }, [account, navigate, setActiveAquariumId]);

  const handleFishSelect = (fishId: number) => {
    setSelectedFish(prev => {
      if (prev.includes(fishId)) {
        return prev.filter(id => id !== fishId);
      }
      if (prev.length >= 2) {
        return prev; // Max 2 fish
      }
      return [...prev, fishId];
    });
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Step 1: Create Aquarium
  const handleCreateAquarium = async () => {
    if (!account?.address) {
      toast.error('Wallet not connected! Please connect your wallet.');
      return;
    }

    if (isCreatingAquarium) {
      return;
    }

    try {
      setIsCreatingAquarium(true);
      toast.loading('Creating your aquarium...', { id: 'aquarium' });

      const tx = await newAquarium(account as any, account.address, 10, 5);

      let extractedAquariumId: bigint | null = null;

      if (tx.events && Array.isArray(tx.events)) {
        const aquariumEvent = tx.events.find(
          (e: any) =>
            e.keys && e.keys[0] && e.keys[0].includes('AquariumCreated')
        );
        if (aquariumEvent && aquariumEvent.data && aquariumEvent.data[0]) {
          extractedAquariumId = BigInt(aquariumEvent.data[0]);
        }
      }

      if (extractedAquariumId) {
        try {
          await syncAquarium(
            extractedAquariumId.toString(),
            account.address,
            extractedAquariumId.toString()
          );
        } catch (syncError) {
          console.error('Failed to sync aquarium to backend:', syncError);
        }

        toast.success('Aquarium created successfully!', { id: 'aquarium' });
        setAquariumId(extractedAquariumId);
        setAquariumCreated(true);
      } else {
        toast.loading('Searching for your aquarium...', { id: 'aquarium' });

        const aquariumsBefore = await getPlayerAquariums(account.address);
        let aquariums: any[] = [];
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
          await delay(3000);
          aquariums = await getPlayerAquariums(account.address);

          if (aquariums && aquariums.length > (aquariumsBefore?.length || 0)) {
            break;
          }
          attempts++;
        }

        let newAquariumId: bigint | null = null;
        if (aquariums && aquariums.length > 0) {
          const sortedAquariums = [...aquariums].sort((a, b) => {
            const idA =
              typeof a === 'object' && a.id ? BigInt(a.id) : BigInt(a);
            const idB =
              typeof b === 'object' && b.id ? BigInt(b.id) : BigInt(b);
            return idA > idB ? -1 : 1;
          });
          const newestAquarium = sortedAquariums[0];
          newAquariumId =
            typeof newestAquarium === 'object' && newestAquarium.id
              ? newestAquarium.id
              : newestAquarium;
        }

        if (!newAquariumId) {
          throw new Error('Aquarium created but ID not found');
        }

        try {
          await syncAquarium(
            newAquariumId.toString(),
            account.address,
            newAquariumId.toString()
          );
        } catch (syncError) {
          console.error('Failed to sync aquarium to backend:', syncError);
        }

        toast.success('Aquarium found!', { id: 'aquarium' });
        setAquariumId(newAquariumId);
        setAquariumCreated(true);
      }
    } catch (error) {
      console.error('Error creating aquarium:', error);
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

  // Step 2: Create Fish (2 fish)
  const handleCreateFish = async () => {
    if (!account || !aquariumId || selectedFish.length !== 2) return;

    if (isCreatingFish) {
      return;
    }

    try {
      setIsCreatingFish(true);
      toast.loading('Creating your first fish...', { id: 'fish' });

      // Create first fish
      const species1 = fishEnumMap[selectedFish[0]];
      if (!species1) {
        toast.error('First fish not selected');
        return;
      }

      const tx1 = await newFish(account as any, aquariumId, species1);

      // Extract fish ID from transaction events or generate
      let fishId1: string | null = null;
      if (tx1.events && Array.isArray(tx1.events)) {
        const fishEvent = tx1.events.find((e: any) =>
          e.keys?.[0]?.includes('FishCreated')
        );
        if (fishEvent?.data?.[0]) {
          fishId1 = String(fishEvent.data[0]);
        }
      }

      // Sync fish 1 to backend
      if (fishId1) {
        try {
          const speciesName1 = fishSpeciesMap[selectedFish[0]];
          await syncFish(fishId1, account.address, fishId1, speciesName1);
        } catch (syncError) {
          console.error('Failed to sync fish 1 to backend:', syncError);
        }
      }

      // Small delay between creations
      await delay(1000);

      // Create second fish
      toast.loading('Creating your second fish...', { id: 'fish' });
      const species2 = fishEnumMap[selectedFish[1]];
      if (!species2) {
        toast.error('Second fish not selected');
        return;
      }

      const tx2 = await newFish(account as any, aquariumId, species2);

      // Extract fish ID from transaction events or generate
      let fishId2: string | null = null;
      if (tx2.events && Array.isArray(tx2.events)) {
        const fishEvent = tx2.events.find((e: any) =>
          e.keys?.[0]?.includes('FishCreated')
        );
        if (fishEvent?.data?.[0]) {
          fishId2 = String(fishEvent.data[0]);
        }
      }

      // Sync fish 2 to backend
      if (fishId2) {
        try {
          const speciesName2 = fishSpeciesMap[selectedFish[1]];
          await syncFish(fishId2, account.address, fishId2, speciesName2);
        } catch (syncError) {
          console.error('Failed to sync fish 2 to backend:', syncError);
        }
      }

      await delay(5000); // 5 seconds for both fish to be indexed

      toast.success('Both fish created! 🎉', { id: 'fish' });
      setFishCreated(true);
    } catch (error) {
      console.error('Error creating fish:', error);
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

  // Step 3: Go to Loading (then Game)
  const handleGoToGame = () => {
    if (!aquariumId || !account) return;
    setActiveAquariumId(aquariumId.toString(), account.address);
    navigate(`/loading?aquarium=${aquariumId}`);
  };
  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return <MobileOnboardingView />;
  }

  // Desktop/tablet view
  return (
    <OrientationLock>
      <div className='relative min-h-screen w-full overflow-y-auto flex flex-col'>
        {/* Oceanic background image and gradient overlays - Same as Start page */}
        <div className='fixed inset-0 -z-10'>
          <img
            src='/backgrounds/initaial-background.webp'
            alt='Ocean Background'
            className='absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none'
            draggable='false'
            role='presentation'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-[#001a2e] via-[#021d3b] to-[#000d1a] opacity-95' />
          {/* Glow spots for dynamic lighting */}
          <div className='absolute top-10 left-1/4 w-72 h-40 bg-cyan-400/10 blur-3xl rounded-full' />
          <div className='absolute bottom-20 right-1/5 w-80 h-32 bg-purple-400/10 blur-3xl rounded-full' />
          <div className='absolute top-1/2 right-10 w-40 h-40 bg-blue-300/10 blur-2xl rounded-full' />
        </div>

        {/* Bubbles animation overlay */}
        <BubblesBackground bubbles={bubbles} className='fixed z-10' />

        {/* Page header */}
        <PageHeader
          title='Your First Steps'
          backTo='/start'
          backText='Back'
          className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30 z-30 sticky top-0'
        />

        <main className='flex flex-col items-center gap-6 px-4 py-6 relative z-30 flex-1'>
          {/* Step 1: Welcome Message + Aquarium Button - CENTERED */}
          {!aquariumCreated && (
            <div className='flex items-center justify-center min-h-[70vh]'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='w-full max-w-2xl'
              >
                <div className='relative bg-gradient-to-b from-blue-900/70 to-blue-800/60 backdrop-blur-lg rounded-3xl px-8 py-10 border border-blue-400/30 shadow-[0_0_30px_5px_rgba(0,0,50,0.2)] overflow-hidden'>
                  {/* Top highlight strip */}
                  <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400/20 via-blue-300/30 to-purple-500/20' />

                  <div className='text-center space-y-6'>
                    <h2 className='text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'>
                      Welcome to Aqua Stark!
                    </h2>
                    <p className='text-lg text-blue-100/90 leading-relaxed'>
                      To begin your journey in this aquatic world, we're gifting
                      you your very first aquarium. This will be your underwater
                      sanctuary where you can nurture and grow your fish
                      collection.
                    </p>

                    <Button
                      onClick={handleCreateAquarium}
                      disabled={isCreatingAquarium}
                      className='w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-6 shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-50'
                    >
                      {isCreatingAquarium ? (
                        <div className='flex items-center gap-2'>
                          <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                          Creating Your Aquarium...
                        </div>
                      ) : (
                        'Claim Your First Aquarium'
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Step 2: Fish Selection + Fish Button */}
          {aquariumCreated && !fishCreated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='w-full max-w-5xl space-y-3'
            >
              {/* Header with button side by side */}
              <div className='flex items-center justify-between gap-4 bg-gradient-to-b from-blue-900/70 to-blue-800/60 backdrop-blur-lg rounded-xl px-6 py-4 border border-blue-400/30'>
                <div className='text-left flex-1'>
                  <h3 className='text-xl sm:text-2xl font-bold text-cyan-300 mb-1'>
                    Choose Your First Fish
                  </h3>
                  <p className='text-blue-100/90 text-sm'>
                    Select two fish to begin your adventure!
                  </p>
                </div>
                <Button
                  onClick={handleCreateFish}
                  disabled={selectedFish.length !== 2 || isCreatingFish}
                  className='bg-purple-500 hover:bg-purple-600 text-white font-bold text-base px-8 py-4 shadow-lg shadow-purple-500/20 transition-all duration-200 disabled:opacity-50 whitespace-nowrap'
                >
                  {isCreatingFish ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Creating...
                    </div>
                  ) : (
                    'Welcome Your Fish'
                  )}
                </Button>
              </div>

              <div className='grid grid-cols-3 gap-3 max-w-4xl mx-auto'>
                {starterFish.map((fish, index) => (
                  <motion.div
                    key={fish.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <FishCard
                      fish={fish}
                      isSelected={selectedFish.includes(fish.id)}
                      onSelect={() => handleFishSelect(fish.id)}
                      variant='onboarding'
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Success + Dive In Button */}
          {fishCreated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='w-full max-w-2xl text-center'
            >
              <div className='relative bg-gradient-to-b from-blue-900/70 to-blue-800/60 backdrop-blur-lg rounded-3xl px-8 py-12 border border-blue-400/30 shadow-[0_0_30px_5px_rgba(0,0,50,0.2)] overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400/20 via-blue-300/30 to-purple-500/20' />

                <div className='space-y-6 text-center'>
                  <h2 className='text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'>
                    You're All Set!
                  </h2>
                  <p className='text-lg text-blue-100/90 leading-relaxed'>
                    Your aquarium is ready and your first two fish are swimming
                    happily. It's time to dive into the depths of AquaStark and
                    discover everything this aquatic world has to offer!
                  </p>

                  <Button
                    onClick={handleGoToGame}
                    className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xl py-8 shadow-lg shadow-cyan-500/30 animate-pulse'
                  >
                    🌊 Dive Into AquaStark
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </OrientationLock>
  );
}
