'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { AquariumStats } from '@/components';
import { AquariumList } from '@/components';
import { PurchaseModal } from '@/components';
import { CreateAquariumButton } from '@/components';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';
import { Search, Filter } from 'lucide-react';
import { useActiveAquarium } from '../store/active-aquarium';
import { useNavigate } from 'react-router-dom';
import type { Aquarium } from '@/components/aquarium/aquarium-card';
import { useAccount } from '@starknet-react/core';
import { useFish } from '@/hooks';
import * as models from '@/typescript/models.gen';
// Removed unused imports
import { num, type BigNumberish } from 'starknet';
import { useAquarium } from '@/hooks/dojo';

export default function AquariumsPage() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [coinBalance, setCoinBalance] = useState(12500);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { account } = useAccount();
  const { getPlayerAquariums, getAquarium, newAquarium } = useAquarium();
  const { getFish } = useFish();

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

      const fishPromises = aquariumData.housed_fish.map(
        (fishId: BigNumberish) => getFish(fishId)
      );
      const fishData = await Promise.all(fishPromises);

      return {
        aquariumData,
        fishData: fishData.filter((fish): fish is models.Fish => fish !== null),
      };
    } catch (error) {
      console.error('Error loading aquarium with fishes:', error);
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
      fishes: fishes.map(fish => ({
        id: Number(fish.id),
        name: `Fish ${fish.id}`,
        image: '/fish/fish1.png',
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
      })),
    };
  };

  // Function to load player aquariums
  const loadPlayerAquariums = async () => {
    if (!account?.address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const playerAquariums = await getPlayerAquariums(account.address);

      if (!playerAquariums || playerAquariums.length === 0) {
        setAquariums([]);
        setLoading(false);
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
      console.error('Error loading player aquariums:', error);
      setError('Failed to load aquariums');
    } finally {
      setLoading(false);
    }
  };

  // Load aquariums when account changes
  useEffect(() => {
    loadPlayerAquariums();
  }, [account?.address]);

  const handleSelectAquarium = async (aquarium: Aquarium) => {
    try {
      // Load complete aquarium with fish before navigating
      const completeAquarium = await loadAquariumWithFishes(aquarium.id);
      if (completeAquarium) {
        setActiveAquariumId(aquarium.id.toString());
        navigate('/game', {
          state: {
            aquarium: transformAquariumData(
              completeAquarium.aquariumData,
              completeAquarium.fishData
            ),
          },
        });
      }
    } catch (error) {
      console.error('Error loading aquarium for navigation:', error);
      // Fallback to simple navigation
      setActiveAquariumId(aquarium.id.toString());
      navigate('/game');
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

  const headerRightContent = (
    <div className='bg-blue-600/50 px-4 py-2 rounded-full flex items-center'>
      <span className='text-yellow-300 mr-1'>🪙</span>
      <span className='text-white font-medium'>{coinBalance}</span>
    </div>
  );

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      <BubblesBackground bubbles={bubbles} className='pointer-events-none' />

      <div className='relative z-10 flex flex-col min-h-screen w-full'>
        <div className=' w-full'>
          <PageHeader
            title='My Aquariums'
            backTo='/game'
            backText=''
            rightContent={
              <div className='flex gap-32 md:gap-64'>
                {headerRightContent}
                <div className='flex flex-col sm:flex-row items-center justify-between b-6 gap-4'>
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
                  <button
                    className='bg-blue-600/30 border border-blue-400/30 text-white rounded-lg px-4 py-2 flex items-center w-full sm:w-auto justify-center'
                    aria-label='Filter Aquariums'
                  >
                    <Filter className='h-5 w-5 mr-2' aria-hidden='true' />
                    Filter
                  </button>
                </div>
              </div>
            }
          />
        </div>

        <main className='flex-grow mx-auto max-w-7xl px-4 py-8 w-full'>
          {error && (
            <div className='bg-red-600/30 border border-red-400/30 rounded-lg p-4 mb-6'>
              <div className='text-red-200 text-sm'>Error</div>
              <div className='text-white'>{error}</div>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-white text-lg'>Loading aquariums...</div>
            </div>
          ) : (
            <>
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
                        aquariums.reduce((acc, curr) => acc + curr.health, 0) /
                          aquariums.length
                      )
                    : 0
                }
              />

              {aquariums.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-white text-xl mb-4'>
                    No aquariums found
                  </div>
                  <div className='text-blue-200 mb-6'>
                    {account?.address
                      ? 'Create your first aquarium to get started!'
                      : 'Connect your wallet to view your aquariums'}
                  </div>
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
            <CreateAquariumButton onClick={() => setShowPurchaseModal(true)} />
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
  );
}
