'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { useActiveAquarium } from '../../store/active-aquarium';
import { useFishStats } from '@/hooks';
import { useBubbles } from '@/hooks';
import { useFeedingSystem } from '@/systems/feeding-system';
import { useSpeciesCatalog } from '@/hooks/use-species-catalog';
import { useFishSync } from '@/hooks/use-fish-sync';
import { useFishUpdates, useAquariumUpdates, useGameEvents } from '@/hooks';
import { useFishSystemEnhanced } from '@/hooks/dojo';
import { useAquarium as useAquariumDojo } from '@/hooks/dojo';
import { fishCollection as fullFishList } from '@/constants';
import {
  Monitor,
  ArrowLeft,
  TrendingUp,
  Heart,
  Settings,
  Users,
  User,
  BookOpen,
  Calendar,
  Award,
  HelpCircle,
  Fish,
} from 'lucide-react';
import { useAquarium } from '@/hooks';
import { useSimpleDirtSystem } from '@/hooks/use-simple-dirt-system';
import { SimpleDirtSpot } from '@/components/simple-dirt-spot';
import { FeedingAquarium } from '@/components';
import { BubblesBackground } from '@/components';
import { GameStatusBar } from '@/components';
import { AquariumTabs } from '@/components/game/aquarium-tabs';
import { OrientationLock } from '@/components/ui';
import { INITIAL_GAME_STATE } from '@/constants';
import { initialAquariums } from '@/data/mock-aquarium';

export function MobileGameView() {
  // Get account info first
  const { account } = useAccount();
  const location = useLocation();

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

  // SSE Real-time updates
  const { subscribeToFishUpdates } = useFishUpdates();
  const { subscribeToAquariumUpdates } = useAquariumUpdates();
  const { subscribeToGameEvents } = useGameEvents();

  const aquarium =
    initialAquariums.find(a => a.id.toString() === activeAquariumId) ||
    initialAquariums[0];
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE);
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium();
  const navigate = useNavigate();

  // CRITICAL: Save aquarium ID from URL immediately on page load
  useEffect(() => {
    if (aquariumIdFromUrl && effectivePlayerAddress) {
      if (aquariumIdFromUrl !== storedAquariumId) {
        setActiveAquariumId(aquariumIdFromUrl, effectivePlayerAddress);
      }
    }
  }, [
    aquariumIdFromUrl,
    effectivePlayerAddress,
    setActiveAquariumId,
    storedAquariumId,
  ]);

  // SSE Event Handlers
  useEffect(() => {
    if (!effectivePlayerAddress) return;

    // Subscribe to fish updates
    subscribeToFishUpdates((data: any) => {
      // Update fish states in real-time
      // You can trigger re-fetch of fish data or update local state
    });

    // Subscribe to aquarium updates
    subscribeToAquariumUpdates((data: any) => {
      // Update aquarium states in real-time
      // You can trigger re-fetch of aquarium data or update local state
    });

    // Subscribe to game events
    subscribeToGameEvents((data: any) => {
      // Handle game events like achievements, notifications, etc.
    });
  }, [
    effectivePlayerAddress,
    subscribeToFishUpdates,
    subscribeToAquariumUpdates,
    subscribeToGameEvents,
  ]);

  // Initialize simple dirt system with backend
  const dirtSystem = useSimpleDirtSystem(
    activeAquariumId || '1',
    effectivePlayerAddress || 'demo-player'
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
          } catch {
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
        setPlayerFishes([]);
      }
    };

    fetchFishes();
  }, [
    effectivePlayerAddress,
    aquariumIdFromUrl,
    preloadedFish,
    activeAquariumId,
    getAquariumData,
    getFish,
    getPlayerAquariumsList,
    getPlayerFish,
    setActiveAquariumId,
    storedAquariumId,
    storedPlayerAddress,
  ]);

  function bigIntToNumber(value: unknown): number {
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'number') return value;
    return 0;
  }

  const displayFish = playerFishes
    .map((fish: any, index: number) => {
      if (!fish) return null;

      // Extract species name from CairoCustomEnum (same logic as desktop)
      let speciesName = 'AngelFish'; // default
      if (fish.species?.variant) {
        // Handle CairoCustomEnum variant extraction
        const variantEntries = Object.entries(fish.species.variant);
        const activeVariant = variantEntries.find(
          ([, value]) => value !== undefined
        );
        if (activeVariant) {
          speciesName = activeVariant[0];
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

        {/* Mobile Bottom Navigation - Use same AquariumTabs component as desktop */}
        <AquariumTabs
          aquariums={aquariums}
          selectedAquarium={selectedAquarium}
          onAquariumSelect={handleAquariumChange}
          feedingSystem={{
            isFeeding: feedingSystem.isFeeding,
            startFeeding: feedingSystem.startFeeding,
            stopFeeding: feedingSystem.stopFeeding,
          }}
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
          realAquariumId={activeAquariumId}
        />

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

              {/* Scrollable menu items - Same options as desktop GameMenu */}
              <div className='flex-1 overflow-y-auto py-4 px-4'>
                <div className='flex flex-col gap-2'>
                  {/* Back to home */}
                  <button
                    onClick={() => {
                      navigate('/');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <ArrowLeft className='h-5 w-5' />
                    <span className='font-medium'>Back to Home</span>
                  </button>
                  {/* Trading Market */}
                  <button
                    onClick={() => {
                      navigate('/trading-market');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <TrendingUp className='h-5 w-5' />
                    <span className='font-medium'>Trading Market</span>
                  </button>
                  {/* Breeding Laboratory */}
                  <button
                    onClick={() => {
                      navigate('/breeding-laboratory');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Heart className='h-5 w-5' />
                    <span className='font-medium'>Breeding Lab</span>
                  </button>
                  {/* Settings */}
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
                  {/* Community */}
                  <button
                    onClick={() => {
                      navigate('/community');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Users className='h-5 w-5' />
                    <span className='font-medium'>Community</span>
                  </button>
                  {/* My Profile */}
                  <button
                    onClick={() => {
                      navigate('/my-profile');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <User className='h-5 w-5' />
                    <span className='font-medium'>My Profile</span>
                  </button>
                  {/* Encyclopedia */}
                  <button
                    onClick={() => {
                      navigate('/encyclopedia');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <BookOpen className='h-5 w-5' />
                    <span className='font-medium'>Encyclopedia</span>
                  </button>
                  {/* Help Center */}
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
                  {/* Events Calendar */}
                  <button
                    onClick={() => {
                      navigate('/events-calendar');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Calendar className='h-5 w-5' />
                    <span className='font-medium'>Events</span>
                  </button>
                  {/* Achievements */}
                  <button
                    onClick={() => {
                      navigate('/achievements');
                      setShowMenu(false);
                    }}
                    className='flex items-center gap-4 px-4 py-3 text-white text-base hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                  >
                    <Award className='h-5 w-5' />
                    <span className='font-medium'>Achievements</span>
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
