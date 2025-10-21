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
import { useFishSync } from '@/hooks/use-fish-sync';

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

  // Backend sync hooks
  const { getPlayerFish } = useFishSync();

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

  // Persistent aquarium store
  const {
    activeAquariumId: storedAquariumId,
    playerAddress: storedPlayerAddress,
    setActiveAquariumId,
  } = useActiveAquarium();

  // Determine which aquarium ID to use (URL > stored)
  const activeAquariumId = aquariumIdFromUrl || storedAquariumId;

  // Use stored player address if account is not connected yet
  const effectivePlayerAddress = account?.address || storedPlayerAddress;

  // CRITICAL: Save aquarium ID from URL immediately on page load
  useEffect(() => {
    if (aquariumIdFromUrl && effectivePlayerAddress) {
      if (aquariumIdFromUrl !== storedAquariumId) {
        setActiveAquariumId(aquariumIdFromUrl, effectivePlayerAddress);
      }
    }
  }, [aquariumIdFromUrl, effectivePlayerAddress]);

  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();

  // Initialize simple dirt system with backend
  const dirtSystem = useSimpleDirtSystem(
    activeAquariumId || '1',
    effectivePlayerAddress || 'demo-player'
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
        setPlayerFishes(preloadedFish);
        return;
      }

      if (!effectivePlayerAddress) {
        setPlayerFishes([]);
        return;
      }

      // Wait a bit for the page to fully load and account to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        // Persist aquarium ID and player address to store
        if (activeAquariumId && effectivePlayerAddress) {
          if (
            activeAquariumId !== storedAquariumId ||
            effectivePlayerAddress !== storedPlayerAddress
          ) {
            setActiveAquariumId(activeAquariumId, effectivePlayerAddress);
          }
        }

        // If aquarium ID is available (URL or stored), load fish from that aquarium
        if (activeAquariumId) {
          try {
            // Retry logic for loading aquarium with fish
            let aquariumData: any = null;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
              aquariumData = await getAquariumData(BigInt(activeAquariumId));

              // Check if aquarium has fish
              if (
                aquariumData?.housed_fish &&
                aquariumData.housed_fish.length > 0
              ) {
                break;
              }

              if (attempts < maxAttempts - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
              attempts++;
            }

            if (aquariumData?.housed_fish) {
              const housedFishArray = Array.isArray(aquariumData.housed_fish)
                ? aquariumData.housed_fish
                : [aquariumData.housed_fish];

              if (housedFishArray.length > 0) {
                const fishPromises = housedFishArray.map((fishId: any) => {
                  const id =
                    typeof fishId === 'bigint' ? fishId : BigInt(fishId);
                  return getFish(id);
                });
                const fishData = await Promise.all(fishPromises);
                setPlayerFishes(fishData.filter(Boolean));
              } else {
                setPlayerFishes([]);
              }
            } else {
              setPlayerFishes([]);
            }
          } catch (aquariumError) {
            console.error('❌ Error loading aquarium:', aquariumError);
            setPlayerFishes([]);
          }
        } else {
          // Load fish from backend (new approach)
          try {
            const backendFish = await getPlayerFish(effectivePlayerAddress);

            if (
              backendFish.success &&
              backendFish.data &&
              backendFish.data.length > 0
            ) {
              // Use backend fish IDs to load details from blockchain
              const fishPromises = backendFish.data.map((fish: any) => {
                const onChainId = fish.on_chain_id;
                return getFish(BigInt(onChainId));
              });

              const fishDetails = await Promise.all(fishPromises);
              setPlayerFishes(fishDetails.filter(Boolean));
            } else {
              setPlayerFishes([]);
            }
          } catch (backendError) {
            // Fallback to blockchain if backend fails
            const playerAquariums = await getPlayerAquariumsList(
              effectivePlayerAddress
            );

            if (playerAquariums && playerAquariums.length > 0) {
              const lastAquarium = playerAquariums[playerAquariums.length - 1];
              const lastAquariumId =
                typeof lastAquarium === 'object' && lastAquarium.id
                  ? lastAquarium.id
                  : lastAquarium;

              const aquariumData = await getAquariumData(lastAquariumId);
              if (
                aquariumData?.housed_fish &&
                aquariumData.housed_fish.length > 0
              ) {
                const housedFishArray = Array.isArray(aquariumData.housed_fish)
                  ? aquariumData.housed_fish
                  : [aquariumData.housed_fish];

                const fishPromises = housedFishArray.map((fishId: any) =>
                  getFish(typeof fishId === 'bigint' ? fishId : BigInt(fishId))
                );
                const fishData = await Promise.all(fishPromises);
                setPlayerFishes(fishData.filter(Boolean));
              } else {
                setPlayerFishes([]);
              }
            } else {
              setPlayerFishes([]);
            }
          }
        }
      } catch (err) {
        console.error('❌ Error fetching fishes:', err);
        setPlayerFishes([]);
      }
    };

    fetchFishes();
  }, [effectivePlayerAddress, aquariumIdFromUrl, preloadedFish]);

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
              ([, value]) => value !== undefined
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

      // Use species catalog for image (centralized, scalable)
      const fishImage = getSpeciesImage(speciesName);
      const displayName = getSpeciesDisplayName(speciesName);

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
