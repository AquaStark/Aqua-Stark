'use client';

import { useState, useMemo, useEffect } from 'react';
import { LayoutFooter } from '@/components';
import { AquariumStats } from '@/components';
import { AquariumList } from '@/components';
import { PurchaseModal } from '@/components';
import { CreateAquariumButton } from '@/components';
import { BubblesBackground } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';
import { Search } from 'lucide-react';
import { useActiveAquarium } from '../store/active-aquarium';
import { useNavigate } from 'react-router-dom';
import type { Aquarium } from '@/types';
import { useAccount } from '@starknet-react/core';
import * as models from '@/typescript/models.gen';
import { num, type BigNumberish } from 'starknet';
import { useAquarium } from '@/hooks/dojo';
import { useAquariumSync } from '@/hooks/use-aquarium-sync';
import { useFishSystemEnhanced } from '@/hooks/dojo';
import { useSpeciesCatalog } from '@/hooks/use-species-catalog';

export default function AquariumsPage() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [coinBalance, setCoinBalance] = useState(12500);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { account } = useAccount();
  const { getPlayerAquariums, getAquarium, newAquarium } = useAquarium();
  const { getFish } = useFishSystemEnhanced();
  const { getPlayerAquariums: getPlayerAquariumsBackend } = useAquariumSync();
  const { getSpeciesImage, getSpeciesDisplayName } = useSpeciesCatalog();

  // Get stored player address from persisted store
  const {
    playerAddress: storedPlayerAddress,
    activeAquariumId: storedAquariumId,
  } = useActiveAquarium();

  // Use stored player address if account is not connected yet
  const effectivePlayerAddress = account?.address || storedPlayerAddress;

  const bubbles = useBubbles({
    initialCount: 15,
    maxBubbles: 35,
    minSize: 8,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  const setActiveAquariumId = useActiveAquarium(s => s.setActiveAquariumId);
  const navigate = useNavigate();

  // Function to load aquarium with its fish
  const loadAquariumWithFishes = async (aquariumId: BigNumberish) => {
    try {
      const id = num.toBigInt(aquariumId);
      const aquariumData = await getAquarium(id);
      if (!aquariumData) return null;

      if (!aquariumData.housed_fish || aquariumData.housed_fish.length === 0) {
        return {
          aquariumData,
          fishData: [],
        };
      }

      const fishPromises = aquariumData.housed_fish.map(
        async (fishId: BigNumberish) => {
          try {
            const fish = await getFish(fishId);
            console.log('🐟 Fish data from blockchain:', fish);
            return fish;
          } catch (err) {
            console.error('❌ Error loading fish:', err);
            return null;
          }
        }
      );
      const fishData = await Promise.all(fishPromises);

      const validFish = fishData.filter(
        (fish): fish is models.Fish => fish !== null
      );
      console.log('✅ Valid fish loaded:', validFish);

      return {
        aquariumData,
        fishData: validFish,
      };
    } catch (error) {
      return null;
    }
  };

  // Function to transform contract aquarium data to UI format
  const transformAquariumData = (
    contractAquarium: models.Aquarium,
    fishes: models.Fish[] = []
  ): Aquarium => {
    return {
      id: Number(contractAquarium.id),
      name: `Aquarium ${contractAquarium.id}`,
      image: '/items/aquarium.png',
      level: Math.floor(Number(contractAquarium.cleanliness) / 10) + 1,
      type: Number(contractAquarium.fish_count) > 5 ? 'Premium' : 'Standard',
      health: Number(contractAquarium.cleanliness),
      lastVisited: 'Recently',
      fishCount: `${contractAquarium.fish_count}/${contractAquarium.max_capacity}`,
      rating: Math.min(
        5,
        Math.floor(Number(contractAquarium.cleanliness) / 20) + 1
      ),
      isPremium: Number(contractAquarium.max_capacity) > 10,
      fishes: fishes.map(fish => {
        console.log('🔍 Processing fish for card:', {
          fishId: fish.id,
          species: fish.species,
          variant: fish.species?.variant
        });

        // Extract species name from CairoCustomEnum
        let speciesName = 'AngelFish'; // Default
        if (fish.species?.variant) {
          console.log('🔍 Raw species variant:', fish.species.variant);
          console.log('🔍 Type of variant:', typeof fish.species.variant);
          console.log('🔍 Is function?', typeof fish.species.variant === 'function');
          
          // Handle CairoCustomEnum variant extraction
          const variantEntries = Object.entries(fish.species.variant);
          console.log('🔍 Variant entries:', variantEntries);
          const activeVariant = variantEntries.find(([, value]) => value !== undefined);
          console.log('🔍 Active variant found:', activeVariant);
          if (activeVariant) {
            speciesName = activeVariant[0];
          }
        }

        console.log('🎨 Species extracted:', speciesName);

        // Get correct image and display name from catalog
        const fishImage = getSpeciesImage(speciesName);
        const displayName = getSpeciesDisplayName(speciesName);

        console.log('🖼️ Fish display data:', { displayName, fishImage });

        return {
          id: Number(fish.id),
          name: displayName,
          image: fishImage,
          rarity: 'Common' as const,
          generation: Number(fish.generation),
          level: Math.floor(Number(fish.age) / 100) + 1,
          traits: {
            color: 'blue',
            pattern: 'striped',
            fins: 'long',
            size: 'medium',
          },
          hunger: (fish as any).hunger ?? 50,
          state: (fish as any).state ?? 'idle',
        };
      }),
    };
  };

  // Function to load player aquariums using backend + blockchain sync
  const loadPlayerAquariums = async () => {
    if (!effectivePlayerAddress) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try loading from backend first
      try {
        const backendResponse = await getPlayerAquariumsBackend(
          effectivePlayerAddress
        );

        if (
          backendResponse.success &&
          backendResponse.data &&
          backendResponse.data.length > 0
        ) {
          // Use backend aquarium IDs to load details from blockchain
          const aquariumPromises = backendResponse.data.map(
            async (aquariumData: any) => {
              const onChainId = aquariumData.on_chain_id;

              const result = await loadAquariumWithFishes(BigInt(onChainId));
              if (result) {
                return transformAquariumData(
                  result.aquariumData,
                  result.fishData
                );
              }
              return null;
            }
          );

          const loadedAquariums = (await Promise.all(aquariumPromises)).filter(
            Boolean
          ) as Aquarium[];
          setAquariums(loadedAquariums);
          return;
        }
      } catch (backendError) {
        // Fallback to blockchain silently
      }

      // Fallback: Load directly from blockchain if backend fails
      const playerAquariums = await getPlayerAquariums(effectivePlayerAddress);

      if (!playerAquariums || playerAquariums.length === 0) {
        setAquariums([]);
        return;
      }

      // Load each aquarium with its fish
      const aquariumPromises = playerAquariums.map(
        async (aquariumId: BigNumberish) => {
          const result = await loadAquariumWithFishes(aquariumId);
          if (result) {
            return transformAquariumData(result.aquariumData, result.fishData);
          }
          return null;
        }
      );

      const loadedAquariums = (await Promise.all(aquariumPromises)).filter(
        Boolean
      ) as Aquarium[];
      setAquariums(loadedAquariums);
    } catch (error) {
      console.error('❌ Error loading player aquariums:', error);
      setError('Failed to load aquariums. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load aquariums when account changes
  useEffect(() => {
    loadPlayerAquariums();
  }, [effectivePlayerAddress]);

  const handleSelectAquarium = async (aquarium: Aquarium) => {
    if (!effectivePlayerAddress) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      console.log('🎯 Selected aquarium ID:', aquarium.id);
      
      // Persist aquarium ID to store
      setActiveAquariumId(aquarium.id.toString(), effectivePlayerAddress);
      console.log('💾 Saved to store:', aquarium.id.toString());

      // Navigate to game WITH aquarium ID in URL
      console.log('🎮 Navigating to /game?aquarium=' + aquarium.id);
      navigate(`/game?aquarium=${aquarium.id}`);
    } catch (error) {
      setError('Failed to select aquarium. Please try again.');
    }
  };

  const handleAddAquarium = async () => {
    if (!account) {
      setError('Please connect your wallet to create an aquarium');
      return;
    }

    try {
      // Create new aquarium in contract
      const maxCapacity = 15;
      const maxDecorations = 5;

      await newAquarium(account, account.address, maxCapacity, maxDecorations);

      // Reload aquarium list after creation
      await loadPlayerAquariums();

      setCoinBalance(prev => prev - 3535);
    } catch (error) {
      console.error('Error creating new aquarium:', error);
      setError('Failed to create aquarium');
    }
  };

  const filteredAquariums = useMemo(() => {
    if (!searchQuery.trim()) return aquariums;

    return aquariums.filter(
      aquarium =>
        aquarium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aquarium.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aquariums, searchQuery]);

  const handleBackToGame = () => {
    console.log('🔙 BACK BUTTON - storedAquariumId:', storedAquariumId);
    // Navigate back to game with stored aquarium ID
    if (storedAquariumId) {
      console.log('✅ Navigating to /game?aquarium=' + storedAquariumId);
      navigate(`/game?aquarium=${storedAquariumId}`);
    } else {
      console.log('⚠️ No storedAquariumId, going to /game');
      navigate('/game');
    }
  };

  return (
    <OrientationLock>
      <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
        <BubblesBackground bubbles={bubbles} className='pointer-events-none' />

        <div className='relative z-10 flex flex-col min-h-screen w-full'>
          <div className='w-full px-2 sm:px-4'>
            <div className='flex items-center justify-between py-4'>
              {/* Back button */}
              <button
                onClick={handleBackToGame}
                className='bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-white rounded-lg px-4 py-2 flex items-center transition-colors'
              >
                ← Back to Game
              </button>

              {/* Title */}
              <h1 className='text-2xl font-bold text-white'>My Aquariums</h1>

              {/* Coins */}
              <div className='flex items-center px-4 py-2 border rounded-full bg-blue-700/50 border-blue-400/50'>
                <img
                  src='/icons/coin.png'
                  alt='Coins'
                  className='w-5 h-5 mr-2'
                />
                <span className='font-bold text-white'>{coinBalance}</span>
              </div>
            </div>
          </div>

          <div className='w-full px-4 py-4'>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-6'>
              <div className='relative w-full max-w-md'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-5 w-5 text-blue-200' />
                </div>
                <input
                  type='text'
                  placeholder='Search aquariums...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='bg-blue-600/30 border border-blue-400/30 text-white placeholder-blue-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300'
                  aria-label='Search aquariums'
                  role='searchbox'
                />
              </div>
            </div>
          </div>

          <main className='flex-grow mx-auto max-w-7xl px-4 py-8 w-full'>
            {error && (
              <div className='bg-red-600/30 border border-red-400/30 rounded-lg p-4 mb-6'>
                <div className='text-red-200 text-sm'>Error</div>
                <div className='text-white'>{error}</div>
              </div>
            )}

            {!effectivePlayerAddress ? (
              <div className='text-center py-12'>
                <div className='text-white text-xl mb-4'>
                  👋 Welcome to Aqua Stark
                </div>
                <div className='text-blue-200 mb-6'>
                  Connect your wallet to view and manage your aquariums
                </div>
              </div>
            ) : loading ? (
              <div className='flex flex-col justify-center items-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4'></div>
                <div className='text-white text-lg'>
                  Loading your aquariums...
                </div>
                <div className='text-blue-200 text-sm mt-2'>
                  Syncing from backend and blockchain
                </div>
              </div>
            ) : (
              <>
                {aquariums.length > 0 && (
                  <AquariumStats
                    totalAquariums={aquariums.length}
                    totalFish={aquariums.reduce(
                      (acc, curr) => acc + curr.fishes.length,
                      0
                    )}
                    premiumAquariums={aquariums.filter(a => a.isPremium).length}
                    averageHealth={
                      aquariums.length > 0
                        ? Math.round(
                            aquariums.reduce(
                              (acc, curr) => acc + curr.health,
                              0
                            ) / aquariums.length
                          )
                        : 0
                    }
                  />
                )}

                {aquariums.length === 0 ? (
                  <div className='text-center py-12'>
                    <div className='text-white text-xl mb-4'>
                      🐠 No aquariums yet
                    </div>
                    <div className='text-blue-200 mb-6'>
                      Create your first aquarium to start your underwater
                      adventure!
                    </div>
                    <button
                      onClick={() => setShowPurchaseModal(true)}
                      className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors'
                    >
                      Create First Aquarium
                    </button>
                  </div>
                ) : (
                  <AquariumList
                    aquariums={filteredAquariums}
                    onSelectAquarium={aquarium =>
                      handleSelectAquarium(aquarium as any)
                    }
                  />
                )}
              </>
            )}

            {account?.address && (
              <CreateAquariumButton
                onClick={() => setShowPurchaseModal(true)}
              />
            )}
          </main>

          <LayoutFooter />
        </div>

        {showPurchaseModal && (
          <PurchaseModal
            onClose={() => setShowPurchaseModal(false)}
            onPurchase={handleAddAquarium}
            coinBalance={coinBalance}
          />
        )}
      </div>
    </OrientationLock>
  );
}
