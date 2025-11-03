'use client';

import { useEffect, useRef } from 'react';
import { FallingFish } from './FallingFish';
import { PlayerFish } from './PlayerFish';
import { FishDodgeUI } from './fish-dodge-ui';
import { GameOverScreen } from './game-over-screen';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';

interface FishDodgeCanvasProps {
  playerX: number;
  playerY: number;
  fallingFishes: Array<{
    id: string;
    x: number;
    y: number;
    speed: number;
  }>;
  score: number;
  round: number;
  lives: number;
  started: boolean;
  gameOver: boolean;
  onRestart: () => void;
  onBack: () => void;
  onInput: (direction: 'left' | 'right' | null) => void;
  GAME_WIDTH: number;
  GAME_HEIGHT: number;
  scale: number;
}

export function FishDodgeCanvas({
  playerX,
  playerY,
  fallingFishes,
  score,
  round,
  lives,
  started,
  gameOver,
  onRestart,
  onBack,
  onInput,
  GAME_WIDTH,
  GAME_HEIGHT,
  scale,
}: FishDodgeCanvasProps) {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const bubbles = useBubbles({
    initialCount: 8,
    maxBubbles: 15,
    minSize: 3,
    maxSize: 10,
    minDuration: 8,
    maxDuration: 15,
    interval: 1200,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || !started) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        onInput('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onInput('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'D'
      ) {
        e.preventDefault();
        onInput(null);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (gameOver || !started) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const centerX = rect.width / 2;
        if (touchX < centerX) {
          onInput('left');
        } else {
          onInput('right');
        }
      }
    };

    const handleTouchEnd = () => {
      onInput(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('touchstart', handleTouchStart);
      gameArea.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameArea) {
        gameArea.removeEventListener('touchstart', handleTouchStart);
        gameArea.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [onInput, gameOver, started]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className={`flex flex-col items-center justify-center ${isMobile ? 'w-screen fixed left-0 right-0' : 'w-full'} ${isMobile ? 'px-0 m-0' : 'px-2 sm:px-4'}`}
      style={
        isMobile
          ? {
              width: '100vw',
              maxWidth: '100vw',
              margin: 0,
              padding: 0,
              left: 0,
              right: 0,
            }
          : {}
      }
    >
      <div
        ref={gameAreaRef}
        className='relative bg-black/10 border border-white/20 overflow-hidden cursor-pointer shadow-2xl select-none'
        style={{
          width: isMobile ? '100vw' : `${GAME_WIDTH * scale}px`,
          height: `${GAME_HEIGHT * scale}px`,
          maxWidth: isMobile ? '100vw' : 'none',
          minWidth: isMobile ? '100vw' : 'auto',
          borderRadius: isMobile ? '0' : '1rem',
          margin: isMobile ? '0' : 'auto',
          backgroundImage: "url('/backgrounds/background2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 pointer-events-none z-10'>
          <BubblesBackground bubbles={bubbles} />
        </div>

        <div className='absolute inset-0 light-rays z-20 pointer-events-none' />
        <div className='absolute inset-0 animate-water-movement z-20 pointer-events-none' />

        <FishDodgeUI
          score={score}
          round={round}
          lives={lives}
          started={started}
          gameOver={gameOver}
        />

        {fallingFishes.map(fish => (
          <FallingFish
            key={fish.id}
            id={fish.id}
            x={fish.x * scale}
            y={fish.y * scale}
            speed={fish.speed}
            scale={scale}
          />
        ))}

        <PlayerFish
          x={playerX * scale}
          y={playerY * scale}
          scale={scale}
          lives={lives}
        />

        {gameOver && (
          <GameOverScreen
            score={score}
            round={round}
            onRestart={onRestart}
            onBack={onBack}
          />
        )}

        {!started && !gameOver && (
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none'>
            <div className='bg-blue-900/90 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-400/50 shadow-2xl text-center'>
              <h2 className='text-2xl font-bold text-white mb-4'>Fish Dodge</h2>
              <p className='text-white/90 mb-4'>
                Use Arrow Keys or A/D to move
                <br />
                Avoid the falling fish!
              </p>
              <p className='text-yellow-400 font-bold'>
                Click anywhere to start
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
