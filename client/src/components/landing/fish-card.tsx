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
      <div className='p-2 sm:p-3 md:p-4 flex flex-col items-center justify-between h-full text-center'>
        <h3 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden mb-2 sm:mb-3'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-lg sm:rounded-xl md:rounded-2xl' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-xs text-white/80 mb-2 sm:mb-3 px-1 sm:px-2'>
          A curious aquatic specimen with unique traits and vibrant colors.
          Perfect for your aquarium.
        </p>
      </div>

      <div
        className={`w-full p-1.5 sm:p-2 md:p-3 text-center text-xs font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
