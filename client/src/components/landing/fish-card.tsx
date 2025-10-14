'use client';
import { FishTank } from '@/components/fish-tank';

export function FishCardComponent({
  name,
  image,
  rarity,
}: {
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}) {
  const rarityColors: Record<typeof rarity, string> = {
    common: 'text-gray-300',
    rare: 'text-blue-300',
    epic: 'text-purple-300',
    legendary: 'text-yellow-300',
  };

  return (
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-sm sm:rounded-md md:rounded-lg overflow-hidden shadow-sm sm:shadow-md border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg h-full flex flex-col relative z-10 scale-70 sm:scale-100'>
      <div className='p-0.5 sm:p-1 md:p-1.5 flex flex-col items-center justify-between h-full text-center'>
        <h3 className='text-xs sm:text-sm font-bold text-white mb-0.5 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-sm sm:rounded-md md:rounded-lg flex items-center justify-center overflow-hidden mb-0.5 sm:mb-1'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-sm sm:rounded-md md:rounded-lg' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-3 h-3 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-xs text-white/80 mb-0.5 sm:mb-1 px-0.5 text-center leading-tight hidden sm:block'>
          A curious aquatic specimen with unique traits and vibrant colors.
          Perfect for your aquarium.
        </p>
      </div>

      <div
        className={`w-full p-0.5 sm:p-0.5 md:p-1 text-center text-xs font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-sm sm:rounded-b-md md:rounded-b-lg`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
