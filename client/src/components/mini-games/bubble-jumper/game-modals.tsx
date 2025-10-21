'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import StartGameButton from './start-game';

interface FishType {
  id: string;
  image: string;
  name: string;
  rarity: string;
  multiplier: number;
}

interface GameModalsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  bestScore: number;
  selectedFish: FishType | null;
  onStartGame: () => void;
  onTogglePause: () => void;
  onPlayAgain: () => void;
  onBack: () => void;
}

export function GameModals({
  isPlaying,
  isPaused,
  isGameOver,
  score,
  bestScore,
  selectedFish,
  onStartGame,
  onTogglePause,
  onPlayAgain,
  onBack,
}: GameModalsProps) {
  return (
    <>
      {/* Pause Modal */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto z-50'
        >
          <div className='bg-gradient-to-br from-blue-600 to-blue-800 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/50 shadow-2xl text-center'>
            <h2 className='text-3xl font-bold text-white mb-4'>Game Paused</h2>
            <p className='text-white/90 mb-6'>
              Press spacebar or click resume to continue
            </p>
            <Button
              onClick={onTogglePause}
              className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold px-8 py-3 shadow-lg'
            >
              <Play className='h-5 w-5 mr-2' />
              Resume Game
            </Button>
          </div>
        </motion.div>
      )}

      {/* Start Game Modal */}
      {!isPlaying && !isGameOver && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto z-50'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-gradient-to-br from-blue-600 to-blue-800 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/50 max-w-md shadow-2xl'
          >
            <h2 className='text-3xl font-bold text-white mb-6'>
              Bubble Jumper
            </h2>
            <p className='text-white/90 mb-6 leading-relaxed'>
              Use arrow keys or A/D to move. Jump on platforms to climb higher!
              <br />
              <span className='text-green-400 font-semibold'>
                Green platforms
              </span>{' '}
              give super jumps!
              <br />
              <span className='text-red-400 font-semibold'>
                Red platforms
              </span>{' '}
              are fragile!
            </p>

            <StartGameButton onStartGame={onStartGame} />
          </motion.div>
        </div>
      )}

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto z-50'
          >
            <div className='bg-gradient-to-br from-blue-600 to-blue-800 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-400/50 max-w-md shadow-2xl text-center'>
              <h2 className='text-3xl font-bold text-white mb-6'>Game Over!</h2>

              <div className='flex items-center justify-center gap-4 mb-6 bg-white/10 rounded-xl p-4'>
                <img
                  src={selectedFish?.image || '/placeholder.svg'}
                  alt={selectedFish?.name || 'Fish'}
                  className='w-20 h-16 object-contain'
                />
                <div className='text-left'>
                  <p className='text-white font-bold text-lg'>
                    {selectedFish?.name}
                  </p>
                  <p className='text-white/70'>{selectedFish?.rarity}</p>
                </div>
              </div>

              <div className='text-white/90 mb-6 bg-white/10 rounded-xl p-4'>
                <p className='text-xl'>
                  Final Score:{' '}
                  <span className='font-bold text-yellow-400 text-2xl'>
                    {score}
                  </span>
                </p>
                {score === bestScore && score > 0 && (
                  <p className='text-yellow-400 font-bold flex items-center justify-center gap-2 mt-2 text-lg'>
                    <Trophy className='h-5 w-5' />
                    New Best Score!
                  </p>
                )}
              </div>

              <div className='flex gap-4 justify-center'>
                <Button
                  onClick={onPlayAgain}
                  className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold px-8 py-3 shadow-lg'
                >
                  <RotateCcw className='h-4 w-4 mr-2' />
                  Play Again
                </Button>
                <Button
                  onClick={onBack}
                  variant='outline'
                  className='bg-gradient-to-r from-gray-600 to-gray-700 border-gray-400/50 text-white hover:from-gray-500 hover:to-gray-600 px-8 py-3 shadow-lg'
                >
                  Back to Menu
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
