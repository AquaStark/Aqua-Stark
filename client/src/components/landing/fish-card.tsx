'use client';
import { FishTank } from '@/components/fish-tank';

export function FishCardComponent({
  name,
  image,
  rarity,
  description,
}: {
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  description?: string;
}) {
  const rarityColors: Record<typeof rarity, string> = {
    common: 'text-gray-300',
    rare: 'text-blue-300',
    epic: 'text-purple-300',
    legendary: 'text-yellow-300',
    mythic: 'text-orange-300',
  };

  return (
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl flex flex-col relative z-10 w-full max-w-[150px] sm:max-w-[220px] md:max-w-[200px]'>
      <div className='p-1 sm:p-2 md:p-2 flex flex-col items-center justify-between text-center'>
        <h3 className='text-[10px] sm:text-sm md:text-base font-bold text-white mb-1 sm:mb-1 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden mb-1 sm:mb-1 min-h-[50px] sm:min-h-[70px] md:min-h-[80px]'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-lg sm:rounded-xl' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-[8px] sm:text-xs md:text-sm text-white/80 mb-1 sm:mb-1 px-1 sm:px-2 text-center leading-relaxed'>
          {description ||
            'A curious aquatic specimen with unique traits and vibrant colors. Perfect for your aquarium.'}
        </p>
      </div>

      <div
        className={`w-full p-1 sm:p-1 md:p-2 text-center text-xs sm:text-xs md:text-sm font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-lg sm:rounded-b-xl`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
