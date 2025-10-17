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
import { Monitor, Menu, Star, Zap, Heart } from 'lucide-react';
import { useAquarium } from '@/hooks';
import { useSimpleDirtSystem } from '@/hooks/use-simple-dirt-system';
import { SimpleDirtSpot } from '@/components/simple-dirt-spot';
import { FeedingAquarium } from '@/components';
import { BubblesBackground } from '@/components';
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
      width: 400,
      height: 300,
    },
    maxFoodsPerSecond: 2,
    foodLifetime: 8,
    attractionRadius: 30,
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

      {/* Mobile Header */}
      <div className='absolute top-0 left-0 right-0 z-30 bg-blue-900/80 backdrop-blur-md border-b border-blue-400/30'>
        <div className='flex items-center justify-between p-2'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>AS</span>
            </div>
            <span className='text-white text-sm font-bold'>Aqua Stark</span>
          </div>

          {/* Stats */}
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1 bg-white/10 rounded-full px-2 py-1'>
              <Star className='w-3 h-3 text-yellow-400' />
              <span className='text-white text-xs'>{happiness}%</span>
            </div>
            <div className='flex items-center gap-1 bg-white/10 rounded-full px-2 py-1'>
              <Heart className='w-3 h-3 text-red-400' />
              <span className='text-white text-xs'>{food}%</span>
            </div>
            <div className='flex items-center gap-1 bg-white/10 rounded-full px-2 py-1'>
              <Zap className='w-3 h-3 text-blue-400' />
              <span className='text-white text-xs'>{energy}%</span>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'
          >
            <Menu className='w-4 h-4 text-white' />
          </button>
        </div>
      </div>

      {/* Fish Aquarium */}
      <motion.div
        key={aquarium.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className='relative z-20 w-full h-full pt-12'
        style={{
          pointerEvents: dirtSystem.spots.length > 0 ? 'none' : 'auto',
        }}
      >
        <FeedingAquarium
          fish={displayFish}
          fullFishList={fullFishList}
          feedingSystem={feedingSystem}
          cleanlinessScore={100 - dirtSystem.dirtLevel}
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

      {/* Mobile Bottom Navigation */}
      <div className='absolute bottom-0 left-0 right-0 z-30 bg-blue-900/90 backdrop-blur-md border-t border-blue-400/30'>
        <div className='flex items-center justify-between p-2'>
          {/* Aquarium Tabs */}
          <div className='flex gap-1'>
            {aquariums.slice(0, 3).map((aquarium, index) => (
              <button
                key={aquarium.id}
                onClick={() => handleAquariumChange(aquarium)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedAquarium?.id === aquarium.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {index === 0 ? 'First' : index === 1 ? 'Second' : 'Third'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-1'>
            <button
              onClick={handleToggleCleaningMode}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isCleaningMode
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
              title='Cleaning Mode'
            >
              🧽
            </button>
            <button
              onClick={handleTipsToggle}
              className='w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center'
              title='Tips'
            >
              💡
            </button>
            <button
              onClick={handleWallpaperToggle}
              className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'
              title='Wallpaper Mode'
            >
              <Monitor className='w-4 h-4 text-white' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className='absolute top-12 right-2 z-40 bg-blue-900/95 backdrop-blur-md rounded-lg border border-blue-400/30 p-2'>
          <div className='flex flex-col gap-1'>
            <button
              onClick={() => navigate('/store')}
              className='px-3 py-2 text-white text-sm hover:bg-white/10 rounded transition-colors'
            >
              🛒 Store
            </button>
            <button
              onClick={() => navigate('/community')}
              className='px-3 py-2 text-white text-sm hover:bg-white/10 rounded transition-colors'
            >
              👥 Community
            </button>
            <button
              onClick={() => navigate('/my-profile')}
              className='px-3 py-2 text-white text-sm hover:bg-white/10 rounded transition-colors'
            >
              👤 Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className='px-3 py-2 text-white text-sm hover:bg-white/10 rounded transition-colors'
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      )}

      {/* Tips Popup */}
      {showTips && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-blue-900/95 backdrop-blur-md rounded-lg border border-blue-400/30 p-4 max-w-xs'>
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
  );
}
