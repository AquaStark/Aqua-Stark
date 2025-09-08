'use client';

import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/game/game-header';
import { AquariumTabs } from '@/components/game/aquarium-tabs';
import { TipsPopup } from '@/components/game/tips-popup';
import { INITIAL_GAME_STATE } from '@/data/game-data';
import { useAquarium } from '@/hooks/use-aquarium';
import { useFishStats } from '@/hooks/use-fish-stats';
import { GameMenu } from '@/components/game/game-menu';
import { useBubbles } from '@/hooks/use-bubbles';
import { BubblesBackground } from '@/components/bubble-background';
import { motion } from 'framer-motion';
import { useActiveAquarium } from '../store/active-aquarium';
import { initialAquariums } from '@/data/mock-aquarium';
import { DirtDebugger } from '@/components/dirt/dirt-debugger';
import { useDirtSystemFixed as useDirtSystem } from '@/hooks/use-dirt-system-fixed';
import { DirtOverlay } from '@/components/dirt/dirt-overlay';
import { useFeedingSystem } from '@/systems/feeding-system';
import { FeedingAquarium } from '@/components/game/feeding-aquarium';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useFish } from '@/hooks/dojo/useFish';
import { useNavigate } from 'react-router-dom';
import { BottomNavBar } from '@/components/game/bottom-nav-bar';
import { FeedingDebugPanel } from '@/components/game/feeding-debug-panel';
import { fishCollection as fullFishList } from '@/data/fish-data';

export default function GamePage() {
  const activeAquariumId = useActiveAquarium(s => s.activeAquariumId);
  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const navigate = useNavigate();

  // Initialize dirt system
  const dirtSystem = useDirtSystem({
    spawnInterval: 5000, // 5 seconds
    maxSpots: 5,
    aquariumBounds: {
      x: 0,
      y: 0,
      width: 2000,
      height: 1000,
    },
    spawnChance: 0.7, // 70% chance
  });

  const bubbles = useBubbles({
    initialCount: 10,
    maxBubbles: 20,
    minSize: 6,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  // Initialize feeding system
  const feedingSystem = useFeedingSystem({
    aquariumBounds: {
      width: 1000,
      height: 600,
    },
    maxFoodsPerSecond: 3,
    foodLifetime: 10,
    attractionRadius: 50,
  });

  const handleTipsToggle = () => setShowTips(!showTips);
  const [playerFishes, setPlayerFishes] = useState<number[]>([]);
  const { account } = useAccount();
  const { getPlayerFishes } = useFish();

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        if (!account) {
          toast.error('Wallet not connected!');
          return;
        }

        const fishes = await getPlayerFishes(account.address);
        console.table(`Game.tsx::Player fishes`, fishes);

        if (!fishes || fishes.length === 1) {
          navigate('/onboarding');
          return;
        }

        setPlayerFishes(fishes);
      } catch (err) {
        console.error('Error fetching fishes:', err);
      }
    };

    fetchFishes();
  }, [account, navigate]);

  const speciesToFishData = {
    AngelFish: {
      image: '/fish/fish3.png',
      name: 'REDGLOW',
      rarity: 'Epic',
      generation: 1,
    },
    GoldFish: {
      image: '/fish/fish2.png',
      name: 'BLUESHINE',
      rarity: 'Rare',
      generation: 1,
    },
    Betta: {
      image: '/fish/fish2.png',
      name: 'TROPICORAL',
      rarity: 'Uncommon',
      generation: 2,
    },
    NeonTetra: {
      image: '/fish/fish4.png',
      name: 'SHADOWFIN',
      rarity: 'Legendary',
      generation: 1,
    },
    Corydoras: {
      image: '/fish/fish1.png',
      name: 'SUNBURST',
      rarity: 'Rare',
      generation: 1,
    },
    Hybrid: {
      image: '/fish/fish2.png',
      name: 'DEEPSCALE',
      rarity: 'Epic',
      generation: 2,
    },
  } as const;

  function getSpeciesFromCairoEnum(
    species: any
  ): keyof typeof speciesToFishData | null {
    if (typeof species === 'string' && species in speciesToFishData) {
      return species as keyof typeof speciesToFishData;
    }
    if (species && typeof species === 'object') {
      if (species.variant && typeof species.variant === 'object') {
        for (const [key, value] of Object.entries(species.variant)) {
          if (value !== undefined && key in speciesToFishData) {
            return key as keyof typeof speciesToFishData;
          }
        }
      }
      if (species.activeVariant && typeof species.activeVariant === 'string') {
        const variantName = species.activeVariant;
        if (variantName in speciesToFishData) {
          return variantName as keyof typeof speciesToFishData;
        }
      }
      for (const [key, value] of Object.entries(species)) {
        if (
          value !== undefined &&
          typeof value === 'object' &&
          key in speciesToFishData
        ) {
          return key as keyof typeof speciesToFishData;
        }
      }
    }
    return null;
  }

  function bigIntToNumber(value: any): number {
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'number') return value;
    return 0;
  }

  function getSpeciesFromIndex(
    fishType: any
  ): keyof typeof speciesToFishData | null {
    const index = bigIntToNumber(fishType);
    const speciesNames: (keyof typeof speciesToFishData)[] = [
      'AngelFish',
      'GoldFish',
      'Betta',
      'NeonTetra',
      'Corydoras',
      'Hybrid',
    ];
    if (index >= 0 && index < speciesNames.length) return speciesNames[index];
    return null;
  }

  const displayFish = playerFishes
    .map((fish: any, index: number) => {
      if (!fish || typeof fish !== 'object') return null;
      let speciesKey: keyof typeof speciesToFishData | null = null;
      if (fish.species) speciesKey = getSpeciesFromCairoEnum(fish.species);
      if (!speciesKey && fish.fish_type !== undefined) {
        speciesKey = getSpeciesFromIndex(fish.fish_type);
      }
      if (!speciesKey) return null;

      const data = speciesToFishData[speciesKey];
      if (!data) return null;

      return {
        id: fish.id ? bigIntToNumber(fish.id) : index,
        name: data.name,
        image: data.image,
        rarity: data.rarity,
        generation: fish.generation
          ? bigIntToNumber(fish.generation)
          : data.generation,
        position: { x: 0, y: 0 },
        species: speciesKey,
        age: fish.age ? bigIntToNumber(fish.age) : 0,
        health: fish.health ? bigIntToNumber(fish.health) : 100,
        hunger_level: fish.hunger_level ? bigIntToNumber(fish.hunger_level) : 0,
        size: fish.size ? bigIntToNumber(fish.size) : 1,
        color: fish.color,
        pattern: fish.pattern,
      };
    })
    .filter((fish): fish is NonNullable<typeof fish> => fish !== null);

  return (
    <div className='relative w-full h-screen overflow-hidden bg-[#005C99]'>
      {/* Background */}
      <img
        src='/backgrounds/background2.png'
        alt=''
        className='absolute inset-0 w-full h-full object-cover z-0'
        role='presentation'
      />

      {/* Bubbles */}
      <BubblesBackground
        bubbles={bubbles}
        className='absolute inset-0 z-10 pointer-events-none'
      />

      {/* Effects */}
      <div className='absolute inset-0 light-rays z-20'></div>
      <div className='absolute inset-0 animate-water-movement z-20'></div>

      {/* Fish */}
      <motion.div
        key={aquarium.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className='relative z-20 w-full h-full'
      >
        <FeedingAquarium
          fish={displayFish}
          fullFishList={fullFishList}
          feedingSystem={feedingSystem}
          cleanlinessScore={dirtSystem.cleanlinessScore}
        />
      </motion.div>

      <DirtOverlay
        spots={dirtSystem.spots}
        onRemoveSpot={dirtSystem.removeDirtSpot}
        className='absolute inset-0 z-50'
      />

      {/* Header */}
      <GameHeader
        happiness={happiness}
        food={food}
        energy={energy}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {showMenu && <GameMenu show={showMenu} />}

      {/* Click to Feed Instructions */}
      {!feedingSystem.isFeeding && (
        <div className='absolute top-[9rem] left-1/2 transform -translate-x-1/2 z-30'>
          <div className='bg-black/50 text-white text-sm px-4 py-2 rounded-lg border border-gray-500/20 backdrop-blur-sm'>
            <div className='flex items-center gap-2 text-gray-300'>
              <span>🐠</span>
              <span>
                Use the bottom navigation to feed your fish and manage your
                aquarium
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavBar
        isFeeding={feedingSystem.isFeeding}
        timeRemaining={feedingSystem.getFeedingStatus().timeRemaining}
        onStartFeeding={() => feedingSystem.startFeeding(30000)}
        onStopFeeding={feedingSystem.stopFeeding}
      />

      {/* Feeding Debug Panel */}
      <FeedingDebugPanel
        foods={feedingSystem.foods}
        isFeeding={feedingSystem.isFeeding}
        onValidateState={feedingSystem.validateFeedingState}
        className='z-40'
      />

      {/* 🧹 Dirt Debugger */}
      <DirtDebugger dirtSystem={dirtSystem} />

      {/* Tips */}
      <div className='absolute bottom-0 right-4 mb-4 z-30'>
        <TipsPopup
          show={showTips}
          onClose={() => setShowTips(false)}
          onToggle={handleTipsToggle}
        />
      </div>

      {/* Tabs */}
      <AquariumTabs
        aquariums={aquariums}
        selectedAquarium={selectedAquarium}
        onAquariumSelect={handleAquariumChange}
      />
    </div>
  );
}
