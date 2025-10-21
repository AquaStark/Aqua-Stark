'use client';

import { useGameLogic } from '@/hooks';
import { useInputHandler } from '@/hooks';
import { Fish } from '@/components/mini-games/floppy-fish/Fish';
import { Obstacles } from '@/components/mini-games/floppy-fish/Obstacles';
import { GameOverScreen } from '@/components/mini-games/floppy-fish/game-over-screen';
import { GameUI } from '@/components/mini-games/floppy-fish/game-ui';

interface MobileFloppyFishGameProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
}

export function MobileFloppyFishGame({
  selectedFish,
}: MobileFloppyFishGameProps) {
  const {
    fishY,
    columns,
    score,
    bestScore,
    gameOver,
    started,
    jump,
    resetGame,
    GAME_WIDTH,
    GAME_HEIGHT,
    FISH_SIZE,
    FISH_X,
    COLUMN_WIDTH,
    GAP_HEIGHT,
  } = useGameLogic();

  const { gameAreaRef } = useInputHandler(jump, gameOver);

  // Mobile-optimized scaling - make game much larger
  const containerWidth = Math.min(window.innerWidth * 0.98, GAME_WIDTH);
  const containerHeight = Math.min(window.innerHeight * 0.75, GAME_HEIGHT);
  const scaleX = containerWidth / GAME_WIDTH;
  const scaleY = containerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY, 1.5); // Allow up to 1.5x scale for mobile

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      {/* Compact score display - top right */}
      <div className='absolute top-2 right-2 z-30 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1'>
        <div className='text-white text-sm font-bold'>Score: {score}</div>
        <div className='text-cyan-200 text-xs'>Best: {bestScore}</div>
      </div>

      {/* Game Canvas - much larger */}
      <div
        ref={gameAreaRef}
        className='relative bg-black/10 border border-white/20 rounded-2xl overflow-hidden cursor-pointer shadow-2xl select-none'
        style={{
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          backgroundImage:
            "url('/background-decorations/background-floppy.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Game Elements */}
        <Fish
          selectedFish={selectedFish}
          fishY={fishY}
          scale={scale}
          started={started}
          gameOver={gameOver}
          FISH_X={FISH_X}
          FISH_SIZE={FISH_SIZE}
        />

        <Obstacles
          columns={columns}
          scale={scale}
          COLUMN_WIDTH={COLUMN_WIDTH}
          GAP_HEIGHT={GAP_HEIGHT}
          GAME_HEIGHT={GAME_HEIGHT}
        />

        <GameUI score={score} started={started} />

        {gameOver && <GameOverScreen score={score} onRestart={resetGame} />}
      </div>

      {/* Compact fish info - bottom left */}
      <div className='absolute bottom-2 left-2 z-30 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-2'>
        <img
          src={selectedFish.image.replace('.png', '-flip.png')}
          alt={selectedFish.name}
          className='w-6 h-6 object-contain'
        />
        <div className='text-white text-xs'>
          <div className='font-bold'>{selectedFish.name}</div>
          <div className='text-cyan-200'>
            {selectedFish.experienceMultiplier}x
          </div>
        </div>
      </div>
    </div>
  );
}
