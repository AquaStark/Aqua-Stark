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
import { FishSpecies } from '@/types/game';
import { useAccount } from '@starknet-react/core';
// import { toast } from 'sonner';
import { useFish } from '@/hooks/dojo/useFish';
import { useNavigate } from 'react-router-dom';
import { FeedingDebugPanel } from '@/components/game/feeding-debug-panel';
import { fishCollection as fullFishList } from '@/data/fish-data';
import {
  Utensils,
  Sparkles,
  ShoppingBag,
  Package,
  Gamepad2,
  Trophy,
  Timer,
  Monitor,
} from 'lucide-react';

export default function GamePage() {
  const activeAquariumId = useActiveAquarium(s => s.activeAquariumId);
  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isWallpaperMode, setIsWallpaperMode] = useState(false);
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
  const handleWallpaperToggle = () => {
    setIsWallpaperMode(!isWallpaperMode);
    // Close menu when entering wallpaper mode
    if (!isWallpaperMode) {
      setShowMenu(false);
    }
  };
  const [playerFishes, setPlayerFishes] = useState<any[]>([]);
  const { account } = useAccount();
  const { getPlayerFishes } = useFish();

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        // For testing/demo purposes, use mock fishes
        const mockFishes = aquarium.fishes.map(fish => ({
          id: fish.id,
          species: `Fish${fish.id}`,
          generation: fish.generation,
          age: 100,
          health: 100,
          hunger_level: 50,
          size: 1,
          color: fish.traits.color,
          pattern: fish.traits.pattern,
        }));

        console.log(`Game.tsx::Mock fishes for testing`, mockFishes);
        setPlayerFishes(mockFishes);

        // Original blockchain logic (commented for testing)
        /*
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
        */
      } catch (err) {
        console.error('Error fetching fishes:', err);
      }
    };

    fetchFishes();
  }, [account, navigate, getPlayerFishes, aquarium.fishes]);

  const speciesToFishData = {
    Fish1: {
      image: '/fish/fish1.png',
      name: 'Azure Stripe',
      rarity: 'Common',
      generation: 1,
    },
    Fish2: {
      image: '/fish/fish2.png',
      name: 'Coral Beauty',
      rarity: 'Uncommon',
      generation: 1,
    },
    Fish3: {
      image: '/fish/fish3.png',
      name: 'Royal Angel',
      rarity: 'Rare',
      generation: 1,
    },
    Fish4: {
      image: '/fish/fish4.png',
      name: 'Neon Tetra',
      rarity: 'Epic',
      generation: 1,
    },
    Fish5: {
      image: '/fish/fish5.png',
      name: 'Golden Scale',
      rarity: 'Rare',
      generation: 2,
    },
    Fish6: {
      image: '/fish/fish6.png',
      name: 'Deep Sea Glow',
      rarity: 'Epic',
      generation: 1,
    },
    Fish7: {
      image: '/fish/fish7.png',
      name: 'Mystic Shadow',
      rarity: 'Legendary',
      generation: 1,
    },
    Fish8: {
      image: '/fish/fish1.png',
      name: 'Azure Stripe Jr',
      rarity: 'Common',
      generation: 2,
    },
    Fish9: {
      image: '/fish/fish2.png',
      name: 'Coral Beauty Jr',
      rarity: 'Uncommon',
      generation: 2,
    },
    Fish10: {
      image: '/fish/fish3.png',
      name: 'Royal Angel Jr',
      rarity: 'Rare',
      generation: 2,
    },
    Fish11: {
      image: '/fish/fish4.png',
      name: 'Neon Tetra Jr',
      rarity: 'Epic',
      generation: 2,
    },
    Fish12: {
      image: '/fish/fish5.png',
      name: 'Golden Scale Jr',
      rarity: 'Rare',
      generation: 3,
    },
    Fish13: {
      image: '/fish/fish6.png',
      name: 'Deep Sea Glow Jr',
      rarity: 'Epic',
      generation: 2,
    },
    Fish14: {
      image: '/fish/fish7.png',
      name: 'Mystic Shadow Jr',
      rarity: 'Legendary',
      generation: 2,
    },
  } as const;

  function getSpeciesFromCairoEnum(species: unknown): FishSpecies | null {
    if (typeof species === 'string' && species in speciesToFishData) {
      return species as FishSpecies;
    }
    if (species && typeof species === 'object') {
      const obj = species as Record<string, unknown>;
      if ('variant' in obj && obj.variant && typeof obj.variant === 'object') {
        for (const [key, value] of Object.entries(
          obj.variant as Record<string, unknown>
        )) {
          if (value !== undefined && key in speciesToFishData) {
            return key as FishSpecies;
          }
        }
      }
      if ('activeVariant' in obj && typeof obj.activeVariant === 'string') {
        const variantName = obj.activeVariant;
        if (variantName in speciesToFishData) {
          return variantName as FishSpecies;
        }
      }
      for (const [key, value] of Object.entries(obj)) {
        if (
          value !== undefined &&
          typeof value === 'object' &&
          key in speciesToFishData
        ) {
          return key as FishSpecies;
        }
      }
    }
    return null;
  }

  function bigIntToNumber(value: unknown): number {
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'number') return value;
    return 0;
  }


  function getSpeciesFromIndex(
    fishType: any
  ): keyof typeof speciesToFishData | null {
    const index = bigIntToNumber(fishType);
    const speciesNames: (keyof typeof speciesToFishData)[] = [
      'Fish1',
      'Fish2',
      'Fish3',
      'Fish4',
      'Fish5',
      'Fish6',
      'Fish7',
      'Fish8',
      'Fish9',
      'Fish10',
      'Fish11',
      'Fish12',
      'Fish13',
      'Fish14',
    ];
    if (index >= 0 && index < speciesNames.length) return speciesNames[index];
    return null;
  }

  const displayFish = playerFishes
    .map((fishId: number, index: number) => {
      // For now, create a mock fish object since we only have IDs
      // In a real implementation, you'd fetch the fish data by ID
      const mockFish = {
        id: fishId,
        species: null,
        generation: 1,
        age: 0,
        health: 100,
        hunger_level: 0,
        size: 1,
        color: 'blue',
        pattern: 'striped',
      };
      let speciesKey: keyof typeof speciesToFishData | null = null;
      if (mockFish.species)
        speciesKey = getSpeciesFromCairoEnum(mockFish.species);
      if (!speciesKey) {
        // Default to first species for now
        speciesKey = 'AngelFish';
      }

      const data = speciesToFishData[speciesKey];
      if (!data) return null;

      return {
        id: mockFish.id ? bigIntToNumber(mockFish.id) : index,
        name: data.name,
        image: data.image,
        rarity: data.rarity,
        habitat: 'Ocean',
        description: 'A beautiful fish',
        price: 100,
        generation: mockFish.generation
          ? bigIntToNumber(mockFish.generation)
          : data.generation,
        position: { x: 0, y: 0 },
        species: speciesKey,
        age: mockFish.age ? bigIntToNumber(mockFish.age) : 0,
        health: mockFish.health ? bigIntToNumber(mockFish.health) : 100,
        hunger_level: mockFish.hunger_level
          ? bigIntToNumber(mockFish.hunger_level)
          : 0,
        size: mockFish.size ? bigIntToNumber(mockFish.size) : 1,
        color: mockFish.color,
        pattern: mockFish.pattern,
      };
    })
    .filter((fish): fish is NonNullable<typeof fish> => fish !== null);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[#005C99] ${isWallpaperMode ? 'wallpaper-mode' : ''}`}
    >
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
      {!isWallpaperMode && (
        <GameHeader
          happiness={happiness}
          food={food}
          energy={energy}
          onMenuToggle={() => setShowMenu(!showMenu)}
        />
      )}

      {showMenu && !isWallpaperMode && (
        <GameMenu
          show={showMenu}
          onWallpaperToggle={handleWallpaperToggle}
          isWallpaperMode={isWallpaperMode}
        />
      )}

      {/* Debuggers - only shown when explicitly toggled */}
      <div className='absolute bottom-4 left-4 z-40 hidden' data-feeding-debug>
        <FeedingDebugPanel
          foods={feedingSystem.foods}
          isFeeding={feedingSystem.isFeeding}
          onValidateState={feedingSystem.validateFeedingState}
        />
      </div>
      <div className='hidden' data-dirt-debug>
        <DirtDebugger dirtSystem={dirtSystem} />
      </div>

      {/* Tips and Action Menu */}
      {!isWallpaperMode && (
        <div className='absolute bottom-0 right-4 mb-4 z-30 flex items-end gap-12'>
          {/* Action Menu with tooltips on hover - Moved more to the left */}
          <div className='flex items-center gap-2 -ml-8'>
            {/* Feed button */}
            <div className='relative group'>
              <button
                onClick={
                  feedingSystem.isFeeding
                    ? feedingSystem.stopFeeding
                    : () => feedingSystem.startFeeding(30000)
                }
                className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-12 h-12 ${
                  feedingSystem.isFeeding
                    ? 'from-orange-400 to-orange-600'
                    : 'from-green-400 to-green-600'
                }`}
              >
                <div className='flex items-center justify-center gap-2 w-full h-full'>
                  {feedingSystem.isFeeding ? (
                    <Timer className='h-5 w-5' />
                  ) : (
                    <Utensils className='h-5 w-5' />
                  )}
                </div>
              </button>

              {/* Tooltip for Feed */}
              <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 bg-blue-600/90 backdrop-blur-md rounded-lg p-2 border border-blue-400/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50'>
                <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600/90 transform rotate-45 border-r border-b border-blue-400/50'></div>
                <span className='text-white text-xs font-medium text-center block'>
                  Feed
                </span>
              </div>

              {/* Timer display during feeding */}
              {feedingSystem.isFeeding &&
                feedingSystem.getFeedingStatus().timeRemaining > 0 && (
                  <div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-orange-300 font-mono'>
                    {Math.ceil(
                      feedingSystem.getFeedingStatus().timeRemaining / 1000
                    )}
                    s
                  </div>
                )}
            </div>

            {/* Other action items with tooltips */}
            {[
              {
                id: 'clean',
                label: 'Clean',
                icon: <Sparkles className='h-5 w-5' />,
                color: 'from-purple-400 to-purple-600',
              },
              {
                id: 'shop',
                label: 'Shop',
                icon: <ShoppingBag className='h-5 w-5' />,
                color: 'from-blue-400 to-blue-600',
              },
              {
                id: 'collection',
                label: 'Collection',
                icon: <Package className='h-5 w-5' />,
                color: 'from-teal-400 to-teal-600',
              },
              {
                id: 'games',
                label: 'Games',
                icon: <Gamepad2 className='h-5 w-5' />,
                color: 'from-pink-400 to-pink-600',
              },
              {
                id: 'rewards',
                label: 'Rewards',
                icon: <Trophy className='h-5 w-5' />,
                color: 'from-yellow-400 to-yellow-600',
              },
            ].map(item => (
              <div key={item.id} className='relative group'>
                <button
                  onClick={() => {
                    // Handle different actions
                    switch (item.id) {
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
                  }}
                  className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-12 h-12 ${item.color}`}
                >
                  <div className='flex items-center justify-center gap-2 w-full h-full'>
                    {item.icon}
                  </div>
                </button>

                {/* Tooltip for each button */}
                <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 bg-blue-600/90 backdrop-blur-md rounded-lg p-2 border border-blue-400/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50'>
                  <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600/90 transform rotate-45 border-r border-b border-blue-400/50'></div>
                  <span className='text-white text-xs font-medium text-center block'>
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tips - Separated with more space */}
          <TipsPopup
            show={showTips}
            onClose={() => setShowTips(false)}
            onToggle={handleTipsToggle}
          />
        </div>
      )}

      {/* Tabs */}
      {!isWallpaperMode && (
        <AquariumTabs
          aquariums={aquariums}
          selectedAquarium={selectedAquarium}
          onAquariumSelect={handleAquariumChange}
        />
      )}

      {/* Wallpaper Mode Exit Button */}
      {isWallpaperMode && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleWallpaperToggle}
          className='wallpaper-exit-button absolute top-4 right-4 z-50 w-12 h-12 text-white rounded-xl flex items-center justify-center'
          title='Exit Wallpaper Mode'
        >
          <Monitor className='h-5 w-5' />
        </motion.button>
      )}
    </div>
  );
}
