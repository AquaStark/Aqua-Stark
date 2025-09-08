import { GameCard } from './game-card';

interface Game {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface GameGridProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

export function GameGrid({ games, onGameSelect }: GameGridProps) {
  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
      {games.map(game => (
        <GameCard
          key={game.id}
          game={game}
          onClick={() => onGameSelect(game)}
        />
      ))}
    </section>
  );
}
