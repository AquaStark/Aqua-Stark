import { Play } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    image: string;
    link: string;
  };
  onClick: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div className='group bg-blue-800/30 border border-blue-700/50 rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.015] flex flex-col'>
      <div className='w-full h-24 sm:h-28 md:h-32 lg:h-36 bg-blue-900/40'>
        <img
          src={game.image}
          alt={game.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-2 sm:p-3 md:p-4 flex flex-col gap-1 sm:gap-2'>
        <h3 className='text-white font-bold text-sm sm:text-base md:text-lg text-center'>
          {game.name}
        </h3>
        <button
          onClick={onClick}
          className='bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-md font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base'
        >
          <Play className='w-3 h-3 sm:w-4 sm:h-4' />
          Play
        </button>
      </div>
    </div>
  );
}
