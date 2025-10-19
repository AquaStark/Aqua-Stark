'use client';

import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingScreen } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useAquarium as useAquariumDojo } from '@/hooks/dojo';
import { useFishSystemEnhanced } from '@/hooks/dojo';

export default function LoadingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aquariumIdFromUrl = searchParams.get('aquarium');
  const { getAquarium } = useAquariumDojo();
  const { getFish } = useFishSystemEnhanced();
  const fishDataRef = useRef<any[]>([]);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    const preloadFish = async () => {
      if (!aquariumIdFromUrl) return;

      // Pre-load fish data in background
      let attempts = 0;
      const maxAttempts = 4;

      while (attempts < maxAttempts) {
        try {
          const aquariumData = await getAquarium(BigInt(aquariumIdFromUrl));
          console.log(
            `🔍 Pre-loading (attempt ${attempts + 1}):`,
            aquariumData
          );

          if (
            aquariumData?.housed_fish &&
            aquariumData.housed_fish.length > 0
          ) {
            console.log('✅ Fish found! Pre-loading fish data...');

            // Pre-load fish data
            const housedFishArray = Array.isArray(aquariumData.housed_fish)
              ? aquariumData.housed_fish
              : [aquariumData.housed_fish];

            const fishPromises = housedFishArray.map((fishId: any) => {
              const id = typeof fishId === 'bigint' ? fishId : BigInt(fishId);
              return getFish(id);
            });

            const fishData = await Promise.all(fishPromises);
            fishDataRef.current = fishData.filter(Boolean);
            console.log(
              `🐟 Fish pre-loaded (${fishDataRef.current.length} fish):`,
              fishDataRef.current
            );
            break;
          }

          await new Promise(resolve => setTimeout(resolve, 1500));
          attempts++;
        } catch (error) {
          console.error('Error pre-loading:', error);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      console.log('⚠️ Pre-load completed');
    };

    preloadFish();
  }, [aquariumIdFromUrl, getAquarium, getFish]);

  const handleComplete = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    // Navigate immediately when loading completes
    if (aquariumIdFromUrl) {
      console.log('🎮 Navigating to game with pre-loaded data');
      navigate(`/game?aquarium=${aquariumIdFromUrl}`, {
        state: { preloadedFish: fishDataRef.current },
        replace: true,
      });
    } else {
      navigate('/game', { replace: true });
    }
  };

  return (
    <OrientationLock>
      <LoadingScreen
        onComplete={handleComplete}
        duration={5000}
        showTips={true}
      />
    </OrientationLock>
  );
}
