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
    <div className='group bg-blue-800/30 border border-blue-700/50 rounded-md sm:rounded-lg shadow-sm overflow-hidden hover:shadow-md transition transform hover:scale-[1.015] flex flex-col'>
      <div className='w-full h-20 sm:h-24 md:h-28 lg:h-32 bg-blue-900/40'>
        <img
          src={game.image}
          alt={game.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-1 sm:p-2 md:p-3 flex flex-col gap-0.5 sm:gap-1'>
        <h3 className='text-white font-bold text-xs sm:text-sm md:text-base text-center'>
          {game.name}
        </h3>
        <button
          onClick={onClick}
          className='bg-blue-600 hover:bg-blue-700 text-white py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-2 md:px-3 rounded-sm sm:rounded-md font-semibold flex items-center justify-center gap-0.5 sm:gap-1 text-xs sm:text-sm'
        >
          <Play className='w-3 h-3 sm:w-4 sm:h-4' />
          Play
        </button>
      </div>
    </div>
  );
}
