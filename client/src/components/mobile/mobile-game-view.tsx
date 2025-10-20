'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { useActiveAquarium } from '../../store/active-aquarium';
import { useFishStats } from '@/hooks';
import { useBubbles } from '@/hooks';
import { useFeedingSystem } from '@/systems/feeding-system';
import { FishSpecies } from '@/types';
import { useFish } from '@/hooks';
import { fishCollection as fullFishList } from '@/constants';
import {
  Monitor,
  Fish,
  Grid,
  Utensils,
  Timer,
  ShoppingBag,
  Package,
  Gamepad2,
  Trophy,
  HelpCircle,
  Camera,
  Home,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAquarium } from '@/hooks';
import { useSimpleDirtSystem } from '@/hooks/use-simple-dirt-system';
import { SimpleDirtSpot } from '@/components/simple-dirt-spot';
import { FeedingAquarium } from '@/components';
import { BubblesBackground } from '@/components';
import { GameStatusBar } from '@/components';
import { OrientationLock } from '@/components/ui';
import { INITIAL_GAME_STATE } from '@/constants';
import { initialAquariums } from '@/data/mock-aquarium';

export function MobileGameView() {
  // Get account info first
  const { account } = useAccount();

  // All state hooks first
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isWallpaperMode, setIsWallpaperMode] = useState(false);
  const [isCleaningMode, setIsCleaningMode] = useState(false);
  const [playerFishes, setPlayerFishes] = useState<unknown[]>([]);

  // Other hooks
  const activeAquariumId = useActiveAquarium(s => s.activeAquariumId);
  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const navigate = useNavigate();

  // Initialize simple dirt system with backend
  const dirtSystem = useSimpleDirtSystem(
    activeAquariumId || '1',
    account?.address || 'demo-player'
  );

  const bubbles = useBubbles({
    initialCount: 8,
    maxBubbles: 15,
    minSize: 4,
    maxSize: 20,
    minDuration: 8,
    maxDuration: 15,
    interval: 500,
  });

  // Initialize feeding system
  const feedingSystem = useFeedingSystem({
    aquariumBounds: {
      width: typeof window !== 'undefined' ? window.innerWidth : 400,
      height: typeof window !== 'undefined' ? window.innerHeight - 200 : 300,
    },
    maxFoodsPerSecond: 2,
    foodLifetime: 8,
    attractionRadius: 40,
  });

  const handleTipsToggle = () => {
    setShowTips(!showTips);
  };

  const handleWallpaperToggle = () => {
    setIsWallpaperMode(!isWallpaperMode);
    if (!isWallpaperMode) {
      setShowMenu(false);
    }
  };

  const handleToggleCleaningMode = () => {
    setIsCleaningMode(!isCleaningMode);
  };

  const { getPlayerFishes } = useFish();

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const mockFishes = aquarium.fishes.slice(0, 6).map(fish => ({
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

        setPlayerFishes(mockFishes);
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

  const displayFish = playerFishes
    .map((fishId: unknown, index: number) => {
      const mockFish = {
        id: typeof fishId === 'number' ? fishId : index,
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
      if (mockFish.species) {
        const cairoSpecies = getSpeciesFromCairoEnum(mockFish.species);
        speciesKey =
          cairoSpecies && cairoSpecies in speciesToFishData
            ? (cairoSpecies as keyof typeof speciesToFishData)
            : null;
      }
      if (!speciesKey) {
        const fishId = mockFish.id ? bigIntToNumber(mockFish.id) : index;
        const speciesNumber = (fishId % 6) + 1;
        speciesKey = `Fish${speciesNumber}` as keyof typeof speciesToFishData;
      }

      const data = speciesKey ? speciesToFishData[speciesKey] : null;
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
    <OrientationLock forcePortrait={false}>
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

        {/* Mobile Header - Similar to original */}
        <div className='absolute top-0 left-0 right-0 flex justify-between items-center p-2 z-50'>
          <div className='flex items-center gap-2'>
            <img
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
              alt='Aqua Stark Logo'
              width={192}
              height={77}
              className='drop-shadow-lg w-40 h-12 object-contain'
            />
          </div>

          <div className='flex items-center gap-1 bg-blue-900/40 backdrop-blur-sm p-2 rounded-xl overflow-x-auto'>
            <div className='flex items-center gap-1 mr-2 bg-blue-800/50 px-2 py-1 rounded-lg flex-shrink-0'>
              <Fish className='text-blue-200 h-3 w-3' />
              <span className='text-white font-bold text-xs'>2/10</span>
            </div>

            <div className='flex items-center gap-1 flex-shrink-0'>
              <GameStatusBar
                icon='🌟'
                value={happiness}
                color='from-yellow-400 to-yellow-600'
                label='Happiness'
              />
              <GameStatusBar
                icon='🍖'
                value={food}
                color='from-orange-400 to-orange-600'
                label='Hunger'
              />
              <GameStatusBar
                icon='⚡'
                value={energy}
                color='from-blue-400 to-blue-600'
                label='Energy'
              />
            </div>
          </div>

          <div className='flex items-center gap-2 mr-2'>
            <button
              className='game-button bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-400/30 border border-blue-400/40'
              onClick={() => setShowMenu(!showMenu)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Sponge Mode Text */}
        {isCleaningMode && (
          <div className='absolute top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-blue-900/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-400/40 shadow-lg z-50'>
            <img
              src='/dirt/sponge.png'
              alt='Sponge'
              className='w-6 h-6 drop-shadow-lg'
            />
            <span className='text-white text-lg font-bold font-nunito drop-shadow-lg'>
              Sponge Mode
            </span>
          </div>
        )}

        {/* Fish Aquarium */}
        <motion.div
          key={aquarium.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          className='relative z-20 w-full h-full'
          style={{
            pointerEvents: dirtSystem.spots.length > 0 ? 'none' : 'auto',
          }}
        >
          <FeedingAquarium
            fish={displayFish}
            fullFishList={fullFishList}
            feedingSystem={feedingSystem}
            cleanlinessScore={100 - dirtSystem.dirtLevel}
            isMobile={true}
          />
        </motion.div>

        {/* Simple Dirt Spots */}
        {dirtSystem.spots.map(spot => (
          <SimpleDirtSpot
            key={spot.id}
            id={spot.id}
            x={spot.x}
            y={spot.y}
            size={spot.size}
            isSpongeMode={isCleaningMode}
            onRemove={dirtSystem.removeSpot}
            onClean={dirtSystem.cleanSpot}
          />
        ))}

        {/* Mobile Bottom Navigation - Similar to original */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent z-40 p-2'>
          <div className='flex justify-between items-end gap-2'>
            {/* Left side - Aquarium tabs */}
            <div className='flex gap-1 overflow-x-auto scrollbar-hide'>
              {aquariums.slice(0, 3).map(aquarium => (
                <button
                  key={aquarium.id}
                  onClick={() => handleAquariumChange(aquarium)}
                  className={`game-button px-3 py-2 rounded-t-xl font-bold transition-all duration-200 flex items-center text-xs ${
                    selectedAquarium?.id === aquarium.id
                      ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white translate-y-0'
                      : 'bg-blue-800/50 text-white/70 hover:bg-blue-700/50 translate-y-2'
                  }`}
                >
                  {aquarium.name.split(' ')[0]}
                </button>
              ))}
              <button
                className={`game-button px-3 py-2 rounded-t-xl font-bold transition-all duration-200 flex items-center text-xs ${
                  selectedAquarium?.id === 0
                    ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white translate-y-0'
                    : 'bg-blue-800/50 text-white/70 hover:bg-blue-700/50 translate-y-2'
                }`}
                onClick={() => handleAquariumChange()}
              >
                <Grid className='h-3 w-3 mr-1' />
                All
              </button>
            </div>

            {/* Right side - Action buttons */}
            <div className='flex items-center gap-1'>
              {/* Feed button */}
              <div className='relative group'>
                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (feedingSystem.isFeeding) {
                      feedingSystem.stopFeeding();
                    } else {
                      feedingSystem.startFeeding(30000);
                    }
                  }}
                  className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-10 h-10 ${
                    feedingSystem.isFeeding
                      ? 'from-orange-400 to-orange-600'
                      : 'from-green-400 to-green-600'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2 w-full h-full'>
                    {feedingSystem.isFeeding ? (
                      <Timer className='h-4 w-4' />
                    ) : (
                      <Utensils className='h-4 w-4' />
                    )}
                  </div>
                </button>
              </div>

              {/* Clean Button */}
              <div className='relative group'>
                <button
                  onClick={handleToggleCleaningMode}
                  className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-10 h-10 ${
                    isCleaningMode
                      ? 'from-yellow-400 to-yellow-600'
                      : 'from-purple-400 to-purple-600'
                  }`}
                >
                  <div className='flex items-center justify-center gap-2 w-full h-full'>
                    🧽
                  </div>
                </button>
              </div>

              {/* Other action buttons */}
              {[
                {
                  id: 'shop',
                  label: 'Shop',
                  icon: <ShoppingBag className='h-4 w-4' />,
                  color: 'from-blue-400 to-blue-600',
                },
                {
                  id: 'collection',
                  label: 'Collection',
                  icon: <Package className='h-4 w-4' />,
                  color: 'from-teal-400 to-teal-600',
                },
                {
                  id: 'games',
                  label: 'Games',
                  icon: <Gamepad2 className='h-4 w-4' />,
                  color: 'from-pink-400 to-pink-600',
                },
                {
                  id: 'rewards',
                  label: 'Rewards',
                  icon: <Trophy className='h-4 w-4' />,
                  color: 'from-yellow-400 to-yellow-600',
                },
              ].map(item => (
                <div key={item.id} className='relative group'>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle different actions
                      switch (item.id) {
                        case 'shop':
                          navigate('/store');
                          break;
                        case 'collection':
                          navigate('/my-profile');
                          break;
                        case 'games':
                          navigate('/mini-games');
                          break;
                        case 'rewards':
                          navigate('/achievements');
                          break;
                      }
                    }}
                    className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-10 h-10 ${item.color}`}
                  >
                    <div className='flex items-center justify-center gap-2 w-full h-full'>
                      {item.icon}
                    </div>
                  </button>
                </div>
              ))}

              {/* Tips button */}
              <div className='relative group'>
                <button
                  onClick={handleTipsToggle}
                  className='game-button bg-gradient-to-b from-yellow-400 to-yellow-600 text-white rounded-xl relative group cursor-pointer w-10 h-10'
                >
                  <div className='flex items-center justify-center gap-2 w-full h-full'>
                    💡
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Sidebar Style */}
        {showMenu && (
          <div className='absolute top-0 left-0 h-full w-64 bg-gradient-to-b from-cyan-600/70 to-cyan-500/70 backdrop-blur-md z-50 shadow-2xl border-r border-cyan-400/30'>
            <div className='flex flex-col h-full'>
              {/* Header with close button */}
              <div className='flex justify-between items-center p-4 border-b border-cyan-400/30'>
                <h2 className='text-white font-bold text-lg'>Menu</h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className='w-8 h-8 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-colors shadow-lg'
                >
                  <span className='text-white text-lg font-bold'>×</span>
                </button>
              </div>

              {/* Scrollable menu items */}
              <div className='flex-1 overflow-y-auto py-4 px-4'>
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={() => {
                      navigate('/store');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <ShoppingBag className='h-5 w-5' />
                    <span className='font-medium'>Store</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/community');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Home className='h-5 w-5' />
                    <span className='font-medium'>Community</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/my-profile');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Fish className='h-5 w-5' />
                    <span className='font-medium'>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/achievements');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Trophy className='h-5 w-5' />
                    <span className='font-medium'>Achievements</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/mini-games');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Gamepad2 className='h-5 w-5' />
                    <span className='font-medium'>Mini Games</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/encyclopedia');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Package className='h-5 w-5' />
                    <span className='font-medium'>Encyclopedia</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/help-center');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <HelpCircle className='h-5 w-5' />
                    <span className='font-medium'>Help Center</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Settings className='h-5 w-5' />
                    <span className='font-medium'>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      handleWallpaperToggle();
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Monitor className='h-5 w-5' />
                    <span className='font-medium'>Wallpaper Mode</span>
                  </button>

                  {/* Additional menu items for better scrolling */}
                  <button
                    onClick={() => {
                      navigate('/leaderboard');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Trophy className='h-5 w-5' />
                    <span className='font-medium'>Leaderboard</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/events');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Sparkles className='h-5 w-5' />
                    <span className='font-medium'>Events</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/tutorial');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <HelpCircle className='h-5 w-5' />
                    <span className='font-medium'>Tutorial</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/about');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Camera className='h-5 w-5' />
                    <span className='font-medium'>About</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Popup */}
        {showTips && (
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-blue-900/95 backdrop-blur-md rounded-lg border border-blue-400/30 p-4 max-w-xs'>
            <div className='text-center'>
              <h3 className='text-white font-bold mb-2'>💡 Tips</h3>
              <p className='text-white/90 text-sm mb-3'>
                Tap the aquarium to feed your fish! Keep them happy and healthy.
              </p>
              <button
                onClick={() => setShowTips(false)}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm'
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Wallpaper Mode Exit Button */}
        {isWallpaperMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleWallpaperToggle}
            className='absolute top-2 right-2 z-50 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center'
            title='Exit Wallpaper Mode'
          >
            <Monitor className='h-4 w-4' />
          </motion.button>
        )}
      </div>
    </OrientationLock>
  );
}
