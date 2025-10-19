'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { useActiveAquarium } from '../store/active-aquarium';
import { useFishStats } from '@/hooks';
import { useBubbles } from '@/hooks';
import { useFeedingSystem } from '@/systems/feeding-system';
import { useFishSystemEnhanced } from '@/hooks/dojo';
import { fishCollection as fullFishList } from '@/constants';
import { Monitor } from 'lucide-react';
import { useAquarium } from '@/hooks';
import { useAquarium as useAquariumDojo } from '@/hooks/dojo';
import { useSimpleDirtSystem } from '@/hooks/use-simple-dirt-system';
import { SimpleDirtSpot } from '@/components/simple-dirt-spot';
import { useMobileDetection } from '@/hooks/use-mobile-detection';
import { MobileGameView } from '@/components/mobile/mobile-game-view';
import { useSpeciesCatalog } from '@/hooks/use-species-catalog';

// Importar todos los componentes originales
import { GameHeader } from '@/components';
import { AquariumTabs } from '@/components';
import { OrientationLock } from '@/components/ui';
import { INITIAL_GAME_STATE } from '@/constants';
import { GameMenu } from '@/components';
import { BubblesBackground } from '@/components';
import { FeedingAquarium } from '@/components';
import { FeedingDebugPanel } from '@/components';
import { initialAquariums } from '@/data/mock-aquarium';

export default function GamePage() {
  // Get account info first
  const { account } = useAccount();
  const location = useLocation();

  // Mobile detection
  const { isMobile } = useMobileDetection();

  // Species catalog for image mapping
  const { getSpeciesImage, getSpeciesDisplayName } = useSpeciesCatalog();

  // All state hooks first
  const [showMenu, setShowMenu] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isWallpaperMode, setIsWallpaperMode] = useState(false);
  const [isCleaningMode, setIsCleaningMode] = useState(false);
  const [playerFishes, setPlayerFishes] = useState<unknown[]>([]);

  // Get aquarium ID from URL
  const [searchParams] = useSearchParams();
  const aquariumIdFromUrl = searchParams.get('aquarium');

  // Get pre-loaded fish from navigation state
  const preloadedFish = (location.state as any)?.preloadedFish;

  // Other hooks
  const activeAquariumId = useActiveAquarium(s => s.activeAquariumId);
  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();

  // Initialize simple dirt system with backend
  const dirtSystem = useSimpleDirtSystem(
    activeAquariumId || '1',
    account?.address || 'demo-player'
  );

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
      width:
        typeof window !== 'undefined'
          ? Math.min(window.innerWidth, 1200)
          : 1000,
      height:
        typeof window !== 'undefined'
          ? Math.min(window.innerHeight - 150, 700)
          : 600,
    },
    maxFoodsPerSecond: 3,
    foodLifetime: 10,
    attractionRadius: 50,
  });

  const handleTipsToggle = () => {
    setShowTips(!showTips);
  };

  const handleWallpaperToggle = () => {
    setIsWallpaperMode(!isWallpaperMode);
    // Close menu when entering wallpaper mode
    if (!isWallpaperMode) {
      setShowMenu(false);
    }
  };

  const handleToggleCleaningMode = () => {
    setIsCleaningMode(!isCleaningMode);
  };

  const { getFish } = useFishSystemEnhanced();
  const {
    getAquarium: getAquariumData,
    getPlayerAquariums: getPlayerAquariumsList,
  } = useAquariumDojo();

  useEffect(() => {
    const fetchFishes = async () => {
      // Check if we have pre-loaded fish data from loading page
      if (preloadedFish && preloadedFish.length > 0) {
        console.log(
          `🎯 Using pre-loaded fish data (${preloadedFish.length} fish):`,
          preloadedFish
        );
        setPlayerFishes(preloadedFish);
        return;
      }

      if (!account?.address) {
        console.log('No account connected, waiting...');
        setPlayerFishes([]);
        return;
      }

      // Wait a bit for the page to fully load and account to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        console.log('🐠 Fetching fishes for player:', account.address);

        // If aquarium ID is in URL, load fish from that aquarium
        if (aquariumIdFromUrl) {
          console.log('📦 Loading aquarium from URL:', aquariumIdFromUrl);

          try {
            // Retry logic for loading aquarium with fish
            let aquariumData: any = null;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
              aquariumData = await getAquariumData(BigInt(aquariumIdFromUrl));
              console.log(
                `🏠 Aquarium data (attempt ${attempts + 1}):`,
                aquariumData
              );

              // Check if aquarium has fish
              if (
                aquariumData?.housed_fish &&
                aquariumData.housed_fish.length > 0
              ) {
                console.log('✅ Found fish in aquarium!');
                break;
              }

              if (attempts < maxAttempts - 1) {
                console.log('⏳ No fish yet, retrying in 2 seconds...');
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
              attempts++;
            }

            console.log('🏠 Aquarium housed_fish:', aquariumData?.housed_fish);
            console.log(
              '🏠 Type of housed_fish:',
              typeof aquariumData?.housed_fish
            );
            console.log(
              '🏠 Is Array:',
              Array.isArray(aquariumData?.housed_fish)
            );

            if (aquariumData?.housed_fish) {
              const housedFishArray = Array.isArray(aquariumData.housed_fish)
                ? aquariumData.housed_fish
                : [aquariumData.housed_fish];

              console.log('🎣 Fish IDs in aquarium:', housedFishArray);

              if (housedFishArray.length > 0) {
                const fishPromises = housedFishArray.map((fishId: any) => {
                  const id =
                    typeof fishId === 'bigint' ? fishId : BigInt(fishId);
                  console.log('🔍 Fetching fish with ID:', id);
                  return getFish(id);
                });
                const fishData = await Promise.all(fishPromises);
                console.log('🐟 Fish data from aquarium:', fishData);
                setPlayerFishes(fishData.filter(Boolean));
              } else {
                console.log(
                  '⚠️ Aquarium has no fish yet after',
                  maxAttempts,
                  'attempts'
                );
                setPlayerFishes([]);
              }
            } else {
              console.log('⚠️ Aquarium data has no housed_fish property');
              setPlayerFishes([]);
            }
          } catch (aquariumError) {
            console.error('❌ Error loading aquarium:', aquariumError);
            setPlayerFishes([]);
          }
        } else {
          // Load all player aquariums and their fishes
          console.log('📋 Loading all player aquariums');
          const playerAquariums = await getPlayerAquariumsList(account.address);
          console.log('🏠 Player aquariums:', playerAquariums);

          if (playerAquariums && playerAquariums.length > 0) {
            // Load last (most recent) aquarium's fish
            const lastAquarium = playerAquariums[playerAquariums.length - 1];
            const lastAquariumId =
              typeof lastAquarium === 'object' && lastAquarium.id
                ? lastAquarium.id
                : lastAquarium;

            console.log(
              '📦 Loading last (most recent) aquarium ID:',
              lastAquariumId
            );
            const aquariumData = await getAquariumData(lastAquariumId);
            console.log('🏠 Last aquarium data:', aquariumData);

            if (aquariumData?.housed_fish) {
              const housedFishArray = Array.isArray(aquariumData.housed_fish)
                ? aquariumData.housed_fish
                : [aquariumData.housed_fish];

              console.log('🎣 Fish IDs:', housedFishArray);

              if (housedFishArray.length > 0) {
                const fishPromises = housedFishArray.map((fishId: any) => {
                  const id =
                    typeof fishId === 'bigint' ? fishId : BigInt(fishId);
                  return getFish(id);
                });
                const fishData = await Promise.all(fishPromises);
                console.log('🐟 Fish data:', fishData);
                setPlayerFishes(fishData.filter(Boolean));
              } else {
                setPlayerFishes([]);
              }
            } else {
              setPlayerFishes([]);
            }
          } else {
            console.log('⚠️ No aquariums found for player');
            setPlayerFishes([]);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching fishes:', err);
        setPlayerFishes([]);
      }
    };

    fetchFishes();
  }, [account?.address, aquariumIdFromUrl, preloadedFish]);

  function bigIntToNumber(value: unknown): number {
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'number') return value;
    return 0;
  }

  const displayFish = playerFishes
    .map((fish: any, index: number) => {
      if (!fish) return null;

      // Extract species name from CairoCustomEnum
      let speciesName = 'AngelFish'; // default
      if (fish.species) {
        if (typeof fish.species === 'object') {
          if (fish.species.activeVariant) {
            speciesName = fish.species.activeVariant;
          } else if (fish.species.variant) {
            // Find the variant with a non-undefined value
            const activeKey = Object.entries(fish.species.variant).find(
              ([_, value]) => value !== undefined
            );
            if (activeKey) {
              speciesName = activeKey[0];
            }
          } else {
            const keys = Object.keys(fish.species);
            if (keys.length > 0) {
              speciesName = keys[0];
            }
          }
        }
      }

      // Debug: Check each variant value
      if (fish.species?.variant) {
        console.log(
          '🔍 All variant entries:',
          Object.entries(fish.species.variant)
        );
      }

      console.log('🔍 Species extraction:', {
        rawSpecies: fish.species,
        extractedName: speciesName,
        fishId: fish.id,
      });

      // Use species catalog for image (centralized, scalable)
      const fishImage = getSpeciesImage(speciesName);
      const displayName = getSpeciesDisplayName(speciesName);

      console.log('🎨 Species mapping:', {
        speciesName,
        displayName,
        fishImage,
      });

      // Generate random position within aquarium bounds
      const randomX = Math.random() * 80 + 10; // 10% to 90% of width
      const randomY = Math.random() * 70 + 15; // 15% to 85% of height

      return {
        id: bigIntToNumber(fish.id) || index,
        name: displayName,
        image: fishImage,
        rarity: 'Common',
        habitat: 'Ocean',
        description: `A beautiful ${speciesName}`,
        price: 100,
        generation: bigIntToNumber(fish.generation) || 1,
        position: { x: randomX, y: randomY },
        species: speciesName,
        age: bigIntToNumber(fish.age) || 0,
        health: bigIntToNumber(fish.health) || 100,
        hunger_level: bigIntToNumber(fish.hunger_level) || 50,
        size: bigIntToNumber(fish.size) || 1,
        color: fish.color || 'blue',
        pattern: fish.pattern || 'striped',
      };
    })
    .filter((fish): fish is NonNullable<typeof fish> => fish !== null);

  // Render mobile view if device is detected as mobile
  if (isMobile) {
    return <MobileGameView />;
  }

  return (
    <OrientationLock>
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
          style={{
            pointerEvents: dirtSystem.spots.length > 0 ? 'none' : 'auto', // NO interceptar clicks cuando hay manchas
          }}
        >
          <FeedingAquarium
            fish={displayFish}
            fullFishList={fullFishList}
            feedingSystem={feedingSystem}
            cleanlinessScore={100 - dirtSystem.dirtLevel}
          />
        </motion.div>

        {/* Simple Dirt Spots - SISTEMA QUE FUNCIONA */}
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

        {/* Header */}
        {!isWallpaperMode && (
          <GameHeader
            happiness={happiness}
            food={food}
            energy={energy}
            onMenuToggle={() => setShowMenu(!showMenu)}
            isCleaningMode={isCleaningMode}
          />
        )}

        {/* Game Menu */}
        {showMenu && !isWallpaperMode && (
          <GameMenu
            show={showMenu}
            onWallpaperToggle={handleWallpaperToggle}
            isWallpaperMode={isWallpaperMode}
          />
        )}

        {/* Debuggers - only shown when explicitly toggled */}
        <div
          className='absolute bottom-4 left-4 z-40 hidden'
          data-feeding-debug
        >
          <FeedingDebugPanel
            foods={feedingSystem.foods}
            isFeeding={feedingSystem.isFeeding}
            onValidateState={feedingSystem.validateFeedingState}
          />
        </div>

        {/* Tabs with integrated action buttons */}
        {!isWallpaperMode && (
          <AquariumTabs
            aquariums={aquariums}
            selectedAquarium={selectedAquarium}
            onAquariumSelect={handleAquariumChange}
            feedingSystem={feedingSystem}
            dirtSystem={{
              dirtLevel: dirtSystem.dirtLevel,
              isDirty: dirtSystem.dirtLevel > 10,
              needsCleaning: dirtSystem.dirtLevel > 30,
            }}
            isCleaningMode={isCleaningMode}
            onToggleCleaningMode={handleToggleCleaningMode}
            showTips={showTips}
            onTipsToggle={handleTipsToggle}
            onTipsClose={() => setShowTips(false)}
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
    </OrientationLock>
  );
}
