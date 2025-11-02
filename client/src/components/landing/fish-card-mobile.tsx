'use client';
import { FishTank } from '@/components/fish-tank';

export function FishCardMobileComponent({
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
    <div
      className='bg-blue-900/80 backdrop-blur-sm rounded-md overflow-hidden shadow-md border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl flex flex-col relative z-10 w-full'
      style={{ maxWidth: '110px' }}
    >
      <div className='p-0.5 flex flex-col items-center justify-between text-center'>
        <h3 className='text-[8px] font-bold text-white mb-0.5 drop-shadow-md'>
          {name}
        </h3>

        <div
          className='relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-md flex items-center justify-center overflow-hidden mb-0.5'
          style={{ minHeight: '56px' }}
        >
          <div className='absolute inset-0 border border-blue-300/50 rounded-md' />
          <FishTank>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain transition-transform duration-500 hover:scale-110'
              style={{ width: '52px', height: '52px' }}
            />
          </FishTank>
        </div>

        <p className='text-[6px] text-white/80 mb-0.5 px-0.5 text-center leading-tight line-clamp-2'>
          {description ||
            'A curious aquatic specimen with unique traits and vibrant colors. Perfect for your aquarium.'}
        </p>
      </div>

      <div
        className={`w-full p-0.5 text-center font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-md`}
        style={{ fontSize: '7px' }}
      >
        <span className='capitalize'>{rarity}</span>
      </div>
    </div>
  );
}
