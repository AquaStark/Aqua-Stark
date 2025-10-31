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
    <div className='bg-blue-900/80 backdrop-blur-sm rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-md sm:shadow-lg md:shadow-xl border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl flex flex-col relative z-10 w-full max-w-[110px] sm:max-w-[150px] md:max-w-[220px]'>
      <div className='p-0.5 sm:p-1 md:p-2 flex flex-col items-center justify-between text-center'>
        <h3 className='text-[8px] sm:text-[10px] md:text-sm lg:text-base font-bold text-white mb-0.5 sm:mb-1 drop-shadow-md'>
          {name}
        </h3>

        <div className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden mb-0.5 sm:mb-1 min-h-[40px] sm:min-h-[50px] md:min-h-[70px]'>
          <div className='absolute inset-0 border border-blue-300/50 rounded-md sm:rounded-lg md:rounded-xl' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 transition-transform duration-500 hover:scale-110'
            />
          </FishTank>
        </div>

        <p className='text-[6px] sm:text-[8px] md:text-xs lg:text-sm text-white/80 mb-0.5 sm:mb-1 px-0.5 sm:px-1 md:px-2 text-center leading-tight sm:leading-relaxed line-clamp-2'>
          {description ||
            'A curious aquatic specimen with unique traits and vibrant colors. Perfect for your aquarium.'}
        </p>
      </div>

      <div
        className={`w-full p-0.5 sm:p-1 md:p-2 text-center text-[7px] sm:text-[9px] md:text-xs lg:text-sm font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-md sm:rounded-b-lg md:rounded-b-xl`}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
