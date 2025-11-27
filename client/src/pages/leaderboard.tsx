import { useState } from 'react';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { Leaderboard } from '@/components';
import { Trophy, Gamepad2 } from 'lucide-react';

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState<string | undefined>(
    undefined
  );

  const gameTypes = [
    { id: undefined, name: 'Global', description: 'All games combined' },
    {
      id: 'floppy-fish',
      name: 'Floppy Fish',
      description: 'Navigate through obstacles',
    },
    {
      id: 'bubble-jumper',
      name: 'Bubble Jumper',
      description: 'Jump on platforms',
    },
    { id: 'fish-dodge', name: 'Fish Dodge', description: 'Dodge falling fish' },
  ];

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden flex flex-col'>
      <PageHeader
        title='Leaderboard'
        backTo='/mini-games'
        backText='Back to Games'
        rightContent={null}
      />

      <main className='relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1'>
        {/* Game Type Selector */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {gameTypes.map(game => (
              <button
                key={game.id || 'global'}
                onClick={() => setSelectedGame(game.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedGame === game.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <div className='flex items-center gap-2'>
                  {game.id === undefined ? (
                    <Trophy className='w-4 h-4' />
                  ) : (
                    <Gamepad2 className='w-4 h-4' />
                  )}
                  <span>{game.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className='bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6'>
          <Leaderboard
            gameType={selectedGame}
            limit={50}
            title={
              selectedGame
                ? `${gameTypes.find(g => g.id === selectedGame)?.name} Leaderboard`
                : 'Global Leaderboard'
            }
          />
        </div>
      </main>

      <LayoutFooter />
    </div>
  );
}
