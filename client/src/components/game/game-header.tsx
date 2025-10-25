import { Fish, Monitor } from 'lucide-react';
import { GameStatusBar, SSEStatus } from '@/components';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface GameHeaderProps {
  happiness: number;
  food: number;
  energy: number;
  onMenuToggle: () => void;
  isCleaningMode?: boolean;
  onWallpaperToggle?: () => void;
  isWallpaperMode?: boolean;
}

export function GameHeader({
  happiness,
  food,
  energy,
  onMenuToggle,
  isCleaningMode = false,
  onWallpaperToggle,
  isWallpaperMode = false,
}: GameHeaderProps) {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuToggle();
  };

  return (
    <div className='absolute top-0 left-0 right-0 flex justify-between items-center p-2 sm:p-4 z-[10001]'>
      <div className='flex items-center gap-2 sm:gap-4'>
        <img
          src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
          alt='Aqua Stark Logo'
          width={120}
          height={50}
          className='drop-shadow-lg w-20 h-8 sm:w-24 sm:h-10 md:w-32 md:h-12 object-contain'
        />
      </div>

      <div className='flex items-center gap-1 sm:gap-2 md:gap-4 bg-blue-900/40 backdrop-blur-sm p-2 sm:p-2 md:p-3 rounded-xl overflow-x-auto'>
        <div className='flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4 bg-blue-800/50 px-2 sm:px-3 py-1 rounded-lg flex-shrink-0'>
          <Fish className='text-blue-200 h-4 w-4 sm:h-5 sm:w-5' />
          <span className='text-white font-bold text-xs sm:text-sm'>2/10</span>
        </div>

        <div className='flex items-center gap-1 sm:gap-2 flex-shrink-0'>
          <GameStatusBar
            icon='🌟'
            value={happiness}
            color='from-yellow-400 to-yellow-600'
            label='Happiness'
          />
          <GameStatusBar
            icon='🍖'
            value={food}
            color='from-orange-400 to-orange-600'
            label='Hunger'
          />
          <GameStatusBar
            icon='⚡'
            value={energy}
            color='from-blue-400 to-blue-600'
            label='Energy'
          />
        </div>

        <div className='flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4'>
          <SSEStatus />
          <FullscreenButton />
          {onWallpaperToggle && (
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onWallpaperToggle();
              }}
              className='game-button p-2 text-white hover:bg-blue-500/50 rounded-lg transition-colors flex-shrink-0'
              title={isWallpaperMode ? 'Exit Wallpaper Mode' : 'Wallpaper Mode'}
            >
              <Monitor className='h-4 w-4 sm:h-5 sm:w-5' />
            </button>
          )}
        </div>
      </div>

      {/* Sponge Mode Text */}
      {isCleaningMode && (
        <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-3 flex items-center gap-3 bg-blue-900/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-400/40 shadow-lg'>
          <img
            src='/dirt/sponge.png'
            alt='Sponge'
            className='w-8 h-8 drop-shadow-lg'
          />
          <span className='text-white text-3xl font-bold font-nunito drop-shadow-lg'>
            Sponge Mode
          </span>
        </div>
      )}

      <div className='flex items-center gap-2 mr-8'>
        <button
          className='game-button p-2 text-white hover:bg-blue-500/50 rounded-lg transition-colors flex-shrink-0'
          onClick={handleMenuClick}
          title='Menu'
        >
          <svg
            className='h-4 w-4 sm:h-5 sm:w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
