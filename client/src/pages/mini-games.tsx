'use client';

import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { Gamepad2, Lock, Play } from 'lucide-react';

export default function GamesPage() {
  console.log('🖥️ Desktop MiniGamesPage is rendering!');
  const navigate = useNavigate();

  const availableGames = [
    {
      id: 'floppy-fish',
      name: 'Floppy Fish',
      description: 'Navigate through obstacles and test your reflexes!',
      image: '/mini-games/floppy-fish-preview.png',
      route: '/mini-games/floppy-fish',
      available: true,
    },
    {
      id: 'bubble-jumper',
      name: 'Bubble Jumper',
      description: 'Jump on platforms and climb to infinity!',
      image: '/mini-games/bubble-jumper-preview.png',
      route: '/mini-games/bubble-jumper',
      available: true,
    },
    {
      id: 'treasure-hunt',
      name: 'Treasure Hunt',
      description: 'Explore the ocean depths and find hidden treasures',
      route: '#',
      available: false,
    },
    {
      id: 'fish-race',
      name: 'Fish Race',
      description: 'Race against other fish in exciting underwater tracks',
      route: '#',
      available: false,
    },
    {
      id: 'coral-defense',
      name: 'Coral Defense',
      description: 'Protect the coral reef from invaders',
      route: '#',
      available: false,
    },
    {
      id: 'ocean-quest',
      name: 'Ocean Quest',
      description: 'Embark on an epic underwater adventure',
      route: '#',
      available: false,
    },
    {
      id: 'shark-escape',
      name: 'Shark Escape',
      description: 'Avoid predators and survive the deep sea',
      route: '#',
      available: false,
    },
    {
      id: 'pearl-collector',
      name: 'Pearl Collector',
      description: 'Collect precious pearls across the ocean floor',
      route: '#',
      available: false,
    },
    {
      id: 'wave-rider',
      name: 'Wave Rider',
      description: 'Ride the waves and perform amazing tricks',
      route: '#',
      available: false,
    },
  ];

  return (
    <>
      <style>
        {`
          .mini-games-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div
        className='relative bg-gradient-to-b from-blue-600 to-blue-950 mini-games-scroll-container'
        style={{
          height: '100vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
      >
        <PageHeader
          title='Aqua Stark Arcade'
          backTo='/game'
          backText='Back to Game'
          rightContent={null}
        />

        <main className='relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-8'>
          <section>
            <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-2'>
              <Gamepad2 className='w-6 h-6' />
              Mini Games
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {availableGames.map(game => (
                <div
                  key={game.id}
                  onClick={() => game.available && navigate(game.route)}
                  className={`group relative bg-gradient-to-br from-blue-500/20 to-blue-800/40 backdrop-blur-sm border-2 border-blue-400/40 rounded-2xl overflow-hidden transition-all duration-300 ${
                    game.available
                      ? 'hover:scale-[1.02] hover:border-blue-400/70 hover:shadow-2xl hover:shadow-blue-500/40 cursor-pointer'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Image - Cuadrada */}
                  <div className='relative aspect-square overflow-hidden'>
                    {game.available ? (
                      <>
                        <img
                          src={game.image}
                          alt={game.name}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent'></div>
                      </>
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-blue-900/30 to-gray-900/50 flex items-center justify-center'>
                        <div className='text-center'>
                          <Lock className='w-16 h-16 text-white/40 mx-auto mb-3' />
                          <div className='px-4 py-2 bg-white/10 rounded-lg border border-white/20'>
                            <span className='text-white/70 text-sm font-bold'>
                              COMING SOON
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-xl font-bold text-white'>
                        {game.name}
                      </h3>
                      <div className='p-1.5 bg-green-500/20 rounded-lg border border-green-400/30'>
                        <Gamepad2 className='w-4 h-4 text-green-400' />
                      </div>
                    </div>
                    <p className='text-blue-100/90 text-xs mb-3'>
                      {game.description}
                    </p>

                    {game.available ? (
                      <button className='w-full game-button bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105 text-sm'>
                        <Play className='w-3 h-3' />
                        Play Now
                      </button>
                    ) : (
                      <div className='w-full bg-gray-700/30 text-white/50 py-2 rounded-lg font-bold text-center border border-gray-600/30 text-sm'>
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Shine effect */}
                  {game.available && (
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
                      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <LayoutFooter />
      </div>
    </>
  );
}
