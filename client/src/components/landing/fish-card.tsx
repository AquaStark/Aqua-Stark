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
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-md sm:shadow-lg border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl h-full flex flex-col relative z-10'>
      <div className='p-1 sm:p-1.5 md:p-2 flex flex-col items-center justify-between h-full text-center'>
        <h3 className='text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 sm:mb-1 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden mb-1 sm:mb-1.5'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-md sm:rounded-lg md:rounded-xl' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-xs text-white/80 mb-1 sm:mb-1.5 px-0.5 sm:px-1'>
          A curious aquatic specimen with unique traits and vibrant colors.
          Perfect for your aquarium.
        </p>
      </div>

      <div
        className={`w-full p-0.5 sm:p-1 md:p-1.5 text-center text-xs font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-md sm:rounded-b-lg md:rounded-b-xl`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
