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
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl h-full flex flex-col relative z-10'>
      <div className='p-1.5 sm:p-2 md:p-3 flex flex-col items-center justify-between h-full text-center'>
        <h3 className='text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-1 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden mb-1.5 sm:mb-2'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-lg sm:rounded-xl md:rounded-2xl' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-xs text-white/80 mb-1.5 sm:mb-2 px-1'>
          A curious aquatic specimen with unique traits and vibrant colors.
          Perfect for your aquarium.
        </p>
      </div>

      <div
        className={`w-full p-1 sm:p-1.5 md:p-2 text-center text-xs font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
