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
    <div className='group bg-blue-800/30 border border-blue-700/50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.015] flex flex-col'>
      <div className='w-full h-32 sm:h-36 lg:h-40 bg-blue-900/40'>
        <img
          src={game.image}
          alt={game.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-3 sm:p-4 flex flex-col gap-2'>
        <h3 className='text-white font-bold text-base sm:text-lg text-center'>
          {game.name}
        </h3>
        <button
          onClick={onClick}
          className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-md font-semibold flex items-center justify-center gap-2 text-sm sm:text-base'
        >
          <Play className='w-3 h-3 sm:w-4 sm:h-4' />
          Play
        </button>
      </div>
    </div>
  );
}
