'use client';
import { FishTank } from '@/components/fish-tank';
import { useState, useEffect } from 'react';

export function FishCardComponent({
  name,
  image,
  rarity,
}: {
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice =
        width <= 640 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rarityColors: Record<typeof rarity, string> = {
    common: 'text-gray-300',
    rare: 'text-blue-300',
    epic: 'text-purple-300',
    legendary: 'text-yellow-300',
  };

  return (
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-xs sm:rounded-sm md:rounded-md lg:rounded-lg overflow-hidden shadow-xs sm:shadow-sm md:shadow-md border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg flex flex-col relative z-10 scale-100'>
      <div className='p-1 sm:p-1 md:p-1.5 lg:p-2 flex flex-col items-center justify-between text-center'>
        <h3 className='text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-white mb-0.5 sm:mb-1 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-xs sm:rounded-sm md:rounded-md lg:rounded-lg flex items-center justify-center overflow-hidden mb-0.5 sm:mb-1 min-h-[60px] sm:min-h-0'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-xs sm:rounded-sm md:rounded-md lg:rounded-lg' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 transition-transform duration-500 hover:scale-110'
              style={{
                width: isMobile ? '64px' : undefined,
                height: isMobile ? '64px' : undefined,
              }}
            />
          </FishTank>
        </div>

        <p className='text-[9px] sm:text-xs md:text-sm text-white/80 mb-0.5 sm:mb-1 px-0.5 text-center leading-tight hidden sm:block'>
          A curious aquatic specimen with unique traits and vibrant colors.
          Perfect for your aquarium.
        </p>
      </div>

      <div
        className={`w-full p-0.5 sm:p-0.5 md:p-1 text-center text-[9px] sm:text-xs md:text-sm font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-xs sm:rounded-b-sm md:rounded-b-md lg:rounded-b-lg`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
