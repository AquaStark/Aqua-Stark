'use client';

import { useEffect, useRef } from 'react';
import { FallingFishMobile } from './FallingFishMobile';
import { PlayerFishMobile } from './PlayerFishMobile';
import { FishDodgeUI } from '../fish-dodge-ui';
import { GameOverScreen } from '../game-over-screen';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';

interface FishDodgeCanvasMobileProps {
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
  PLAYER_SIZE: number;
  FISH_SIZE: number;
}

export function FishDodgeCanvasMobile({
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
  PLAYER_SIZE,
  FISH_SIZE,
}: FishDodgeCanvasMobileProps) {
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

    const handleTouchMove = (e: TouchEvent) => {
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

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('touchstart', handleTouchStart);
      gameArea.addEventListener('touchend', handleTouchEnd);
      gameArea.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (gameArea) {
        gameArea.removeEventListener('touchstart', handleTouchStart);
        gameArea.removeEventListener('touchend', handleTouchEnd);
        gameArea.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [onInput, gameOver, started]);

  const canvasWidth = GAME_WIDTH * scale;
  const canvasHeight = GAME_HEIGHT * scale;

  return (
    <div
      className='w-full h-full flex items-center justify-center'
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      <div
        ref={gameAreaRef}
        className='relative bg-black/10 border border-white/20 overflow-hidden cursor-pointer shadow-2xl select-none'
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          maxWidth: '100vw',
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
          <FallingFishMobile
            key={fish.id}
            id={fish.id}
            x={fish.x * scale}
            y={fish.y * scale}
            speed={fish.speed}
            scale={scale}
            fishSize={FISH_SIZE}
          />
        ))}

        <PlayerFishMobile
          x={playerX * scale}
          y={playerY * scale}
          scale={scale}
          playerSize={PLAYER_SIZE}
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
            <div className='bg-blue-900/90 backdrop-blur-md rounded-xl p-4 border-2 border-blue-400/50 shadow-2xl text-center mx-4'>
              <h2 className='text-xl font-bold text-white mb-3'>Fish Dodge</h2>
              <p className='text-white/90 mb-3 text-sm'>
                Tap left/right to move
                <br />
                Avoid the falling fish!
              </p>
              <p className='text-yellow-400 font-bold text-sm'>Tap to start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
