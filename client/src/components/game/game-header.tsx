import { Fish } from 'lucide-react';
import { GameStatusBar } from '@/components';

interface GameHeaderProps {
  happiness: number;
  food: number;
  energy: number;
  onMenuToggle: () => void;
  isCleaningMode?: boolean;
}

export function GameHeader({
  happiness,
  food,
  energy,
  onMenuToggle,
  isCleaningMode = false,
}: GameHeaderProps) {
  return (
    <div className='absolute top-0 left-0 right-0 flex justify-between items-center p-2 sm:p-4 z-50'>
      <div className='flex items-center gap-2 sm:gap-4'>
        <img
          src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png'
          alt='Aqua Stark Logo'
          width={120}
          height={50}
          className='drop-shadow-lg w-20 h-8 sm:w-24 sm:h-10 md:w-32 md:h-12 object-contain'
        />
      </div>

      <div className='flex items-center gap-1 sm:gap-2 md:gap-4 bg-blue-900/40 backdrop-blur-sm p-2 sm:p-3 rounded-xl'>
        <div className='flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4 bg-blue-800/50 px-2 sm:px-3 py-1 rounded-lg'>
          <Fish className='text-blue-200 h-4 w-4 sm:h-5 sm:w-5' />
          <span className='text-white font-bold text-xs sm:text-sm'>2/10</span>
        </div>

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
          className='game-button bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-400/30 border border-blue-400/40'
          onClick={onMenuToggle}
        >
          ☰
        </button>
      </div>
    </div>
  );
}
