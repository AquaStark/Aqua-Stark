'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBubbles } from '@/hooks/use-bubbles';
import { BubblesBackground } from '@/components/bubble-background';
import { GameCanvas } from '@/components/mini-games/bubble-jumper/game-canvas';
import { GameUI } from '@/components/mini-games/bubble-jumper/game-ui';
import { GameModals } from '@/components/mini-games/bubble-jumper/game-modals';
import { OrientationLock } from '@/components/ui';

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'spring' | 'broken';
  bounceAnimation?: boolean;
}

interface Fish {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  image: string;
  name: string;
  rarity: string;
  multiplier: number;
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  bestScore: number;
  platforms: Platform[];
  fish: Fish;
  camera: { y: number };
  keys: { left: boolean; right: boolean };
}

const GAME_CONFIG = {
  gravity: 0.4, // Reduced for mobile
  jumpForce: -12, // Reduced for mobile
  springJumpForce: -18, // Reduced for mobile
  horizontalSpeed: 4, // Reduced for mobile
  platformWidth: 80,
  platformSpacing: 80,
  gameWidth: 800,
  gameHeight: 600,
  fishWidth: 40,
  fishHeight: 30,
};

export default function MobileBubbleJumperView() {
  const navigate = useNavigate();
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Fixed fish (no localStorage)
  const selectedFish = {
    id: 'fish001',
    name: 'Aqua Puffer',
    image: '/fish/fish1.png',
    rarity: 'Common',
    multiplier: 1.0,
  };

  const bubbles = useBubbles({
    initialCount: 8, // Reduced for mobile
    maxBubbles: 15, // Reduced for mobile
    minSize: 6,
    maxSize: 25, // Reduced for mobile
    minDuration: 10,
    maxDuration: 18,
    interval: 500, // Increased for mobile
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore =
      typeof window !== 'undefined'
        ? Number.parseInt(localStorage.getItem('bubble-jumper-best') || '0')
        : 0;

    return {
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      score: 0,
      bestScore,
      platforms: [],
      fish: {
        x: GAME_CONFIG.gameWidth / 2,
        y: GAME_CONFIG.gameHeight - 100,
        velocityX: 0,
        velocityY: 0,
        width: GAME_CONFIG.fishWidth,
        height: GAME_CONFIG.fishHeight,
        image: selectedFish.image,
        name: selectedFish.name,
        rarity: selectedFish.rarity,
        multiplier: selectedFish.multiplier,
      },
      camera: { y: 0 },
      keys: { left: false, right: false },
    };
  });

  const generatePlatforms = useCallback(() => {
    const platforms: Platform[] = [];

    // Starting platform
    platforms.push({
      id: 0,
      x: GAME_CONFIG.gameWidth / 2 - GAME_CONFIG.platformWidth / 2,
      y: GAME_CONFIG.gameHeight - 50,
      width: GAME_CONFIG.platformWidth,
      type: 'normal',
    });

    // Generate initial platforms
    for (let i = 1; i < 200; i++) {
      let type: 'normal' | 'spring' | 'broken' = 'normal';

      const rand = Math.random();
      if (rand < 0.4) type = 'spring';
      else if (rand < 0.5) type = 'broken';

      const minX = GAME_CONFIG.gameWidth * 0.1;
      const maxX = GAME_CONFIG.gameWidth * 0.9 - GAME_CONFIG.platformWidth;
      const xRange = maxX - minX;

      platforms.push({
        id: i,
        x: minX + Math.random() * xRange,
        y: GAME_CONFIG.gameHeight - 50 - i * GAME_CONFIG.platformSpacing,
        width: GAME_CONFIG.platformWidth,
        type,
      });
    }

    return platforms;
  }, []);

  const generateMorePlatforms = useCallback(
    (currentPlatforms: Platform[], highestY: number) => {
      const newPlatforms = [...currentPlatforms];
      const lastId = Math.max(...currentPlatforms.map(p => p.id));

      for (let i = 1; i <= 50; i++) {
        let type: 'normal' | 'spring' | 'broken' = 'normal';

        const rand = Math.random();
        if (rand < 0.4) type = 'spring';
        else if (rand < 0.5) type = 'broken';

        const minX = GAME_CONFIG.gameWidth * 0.1;
        const maxX = GAME_CONFIG.gameWidth * 0.9 - GAME_CONFIG.platformWidth;
        const xRange = maxX - minX;

        newPlatforms.push({
          id: lastId + i,
          x: minX + Math.random() * xRange,
          y: highestY - i * GAME_CONFIG.platformSpacing,
          width: GAME_CONFIG.platformWidth,
          type,
        });
      }

      return newPlatforms;
    },
    []
  );

  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      isPlaying: false,
      isPaused: false,
    }));
  };

  const initializeGame = useCallback(() => {
    const platforms = generatePlatforms();
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      platforms,
      fish: {
        ...prev.fish,
        x: GAME_CONFIG.gameWidth / 2,
        y: GAME_CONFIG.gameHeight - 100,
        velocityX: 0,
        velocityY: 0,
        image: selectedFish.image,
        name: selectedFish.name,
        rarity: selectedFish.rarity,
        multiplier: selectedFish.multiplier,
      },
      camera: { y: 0 },
    }));
  }, [generatePlatforms, selectedFish]);

  // Touch controls for mobile
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver)
      return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const screenWidth = window.innerWidth;
      
      if (touch.clientX < screenWidth / 2) {
        // Left side - move left
        setGameState(prev => ({
          ...prev,
          keys: { ...prev.keys, left: true, right: false },
        }));
      } else {
        // Right side - move right
        setGameState(prev => ({
          ...prev,
          keys: { ...prev.keys, left: false, right: true },
        }));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setGameState(prev => ({
        ...prev,
        keys: { left: false, right: false },
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState.isPlaying && !gameState.isGameOver) {
          togglePause();
        }
        return;
      }

      if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver)
        return;

      setGameState(prev => ({
        ...prev,
        keys: {
          ...prev.keys,
          left:
            e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
              ? true
              : prev.keys.left,
          right:
            e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'
              ? true
              : prev.keys.right,
        },
      }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setGameState(prev => ({
        ...prev,
        keys: {
          ...prev.keys,
          left:
            e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A'
              ? false
              : prev.keys.left,
          right:
            e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D'
              ? false
              : prev.keys.right,
        },
      }));
    };

    // Add touch event listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver || gameState.isPaused)
      return;

    const gameLoop = () => {
      setGameState(prev => {
        const newState = { ...prev };
        const fish = { ...newState.fish };

        // Horizontal movement
        if (newState.keys.left) {
          fish.velocityX = Math.max(
            fish.velocityX - 0.5,
            -GAME_CONFIG.horizontalSpeed
          );
        } else if (newState.keys.right) {
          fish.velocityX = Math.min(
            fish.velocityX + 0.5,
            GAME_CONFIG.horizontalSpeed
          );
        } else {
          fish.velocityX *= 0.9;
        }

        // Apply gravity and velocity
        fish.velocityY += GAME_CONFIG.gravity;
        fish.x += fish.velocityX;
        fish.y += fish.velocityY;

        // Wrap around horizontally
        if (fish.x < -fish.width) fish.x = GAME_CONFIG.gameWidth;
        if (fish.x > GAME_CONFIG.gameWidth) fish.x = -fish.width;

        // Platform collision detection (only when falling)
        if (fish.velocityY > 0) {
          for (let i = 0; i < newState.platforms.length; i++) {
            const platform = newState.platforms[i];
            if (
              fish.x + fish.width > platform.x &&
              fish.x < platform.x + platform.width &&
              fish.y + fish.height > platform.y &&
              fish.y + fish.height < platform.y + 20 &&
              fish.velocityY > 0
            ) {
              if (platform.type === 'broken') {
                if (platform.bounceAnimation) {
                  newState.platforms.splice(i, 1);
                  continue;
                } else {
                  fish.velocityY = GAME_CONFIG.jumpForce;
                  platform.bounceAnimation = true;
                }
              } else if (platform.type === 'spring') {
                fish.velocityY = GAME_CONFIG.springJumpForce;
                platform.bounceAnimation = true;
                setTimeout(() => {
                  setGameState(prev => ({
                    ...prev,
                    platforms: prev.platforms.map(p =>
                      p.id === platform.id
                        ? { ...p, bounceAnimation: false }
                        : p
                    ),
                  }));
                }, 200);
              } else {
                fish.velocityY = GAME_CONFIG.jumpForce;
              }

              const heightScore = Math.max(
                0,
                Math.floor((GAME_CONFIG.gameHeight - platform.y) / 10)
              );
              newState.score = Math.max(
                newState.score,
                Math.floor(heightScore * fish.multiplier)
              );
              break;
            }
          }
        }

        // Camera follows fish
        const fishScreenY = fish.y - newState.camera.y;
        if (fishScreenY < GAME_CONFIG.gameHeight * 0.4) {
          newState.camera.y = fish.y - GAME_CONFIG.gameHeight * 0.4;
        }

        // Generate more platforms when needed
        const highestPlatform = Math.min(...newState.platforms.map(p => p.y));
        const fishDistanceFromTop = fish.y - highestPlatform;

        if (fishDistanceFromTop < 1000) {
          newState.platforms = generateMorePlatforms(
            newState.platforms,
            highestPlatform
          );
        }

        // Game over if fish falls off screen
        if (fish.y > newState.camera.y + GAME_CONFIG.gameHeight + 200) {
          newState.isGameOver = true;
          newState.isPlaying = false;

          if (newState.score > newState.bestScore) {
            newState.bestScore = newState.score;
            localStorage.setItem(
              'bubble-jumper-best',
              newState.bestScore.toString()
            );
          }
        }

        newState.fish = fish;
        return newState;
      });

      if (gameState.isPlaying && !gameState.isGameOver && !gameState.isPaused) {
        animationRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    gameState.isPlaying,
    gameState.isGameOver,
    gameState.isPaused,
    generateMorePlatforms,
  ]);

  const handlePlayAgain = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setTimeout(() => {
      initializeGame();
    }, 100);
  };

  const handleBack = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    navigate('/mini-games');
  };

  return (
    <OrientationLock>
      <div className='relative h-screen bg-[#005C99] overflow-hidden flex flex-col'>
        {/* Background */}
        <img
          src='/backgrounds/background2.png'
          alt=''
          className='absolute inset-0 w-full h-full object-cover z-0'
          role='presentation'
        />

        <BubblesBackground
          bubbles={bubbles}
          className='absolute inset-0 z-10 pointer-events-none'
        />

        <div className='absolute inset-0 light-rays z-20'></div>
        <div className='absolute inset-0 animate-water-movement z-20'></div>

        {/* Minimal header */}
        <div className='relative z-30 p-2 bg-blue-700/90 backdrop-blur-sm border-b border-blue-400/50'>
          <div className='flex items-center justify-between'>
            <button
              onClick={handleBack}
              className='flex items-center text-white hover:bg-blue-500/50 px-2 py-1 rounded transition-colors'
            >
              <svg className='mr-1' width={14} height={14} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='m12 19-7-7 7-7'/>
                <path d='M19 12H5'/>
              </svg>
              <span className='text-sm'>Back</span>
            </button>
            <h3 className='text-sm font-semibold text-white'>Bubble Jumper</h3>
            <div className='w-12'></div>
          </div>
        </div>

        {/* Game area - takes most of the screen */}
        <main className='relative z-10 w-full flex items-center justify-center px-4 pt-4 pb-4 flex-1'>
          <div className='w-full h-full max-w-lg'>
            <GameCanvas
              gameRef={gameRef}
              platforms={gameState.platforms}
              fish={gameState.fish}
              camera={gameState.camera}
              gameConfig={GAME_CONFIG}
            />
          </div>
        </main>

        <GameUI
          score={gameState.score}
          bestScore={gameState.bestScore}
          isPlaying={gameState.isPlaying}
          isGameOver={gameState.isGameOver}
          isPaused={gameState.isPaused}
          selectedFish={selectedFish}
          onBack={handleBack}
          onTogglePause={togglePause}
          onEndGame={endGame}
        />

        <GameModals
          isPlaying={gameState.isPlaying}
          isPaused={gameState.isPaused}
          isGameOver={gameState.isGameOver}
          score={gameState.score}
          bestScore={gameState.bestScore}
          selectedFish={selectedFish}
          onStartGame={initializeGame}
          onTogglePause={togglePause}
          onPlayAgain={handlePlayAgain}
          onBack={handleBack}
        />

        {/* Bottom Info Panel - Mobile optimized */}
        {gameState.isPlaying && (
          <div className='absolute bottom-4 left-4 right-4 pointer-events-none z-40'>
            <div className='bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md rounded-lg p-3 border border-blue-400/50 flex items-center gap-3 shadow-lg'>
              <img
                src={selectedFish.image || '/placeholder.svg'}
                alt={selectedFish.name}
                className='w-10 h-8 object-contain'
              />
              <div className='flex-1'>
                <h3 className='text-white font-bold text-sm'>{selectedFish.name}</h3>
                <p className='text-white/70 text-sm'>
                  {selectedFish.rarity} • {selectedFish.multiplier}x XP
                </p>
              </div>
              <div className='text-right'>
                <p className='text-white/70 text-sm'>Touch left/right</p>
                <p className='text-white text-sm'>Space to pause</p>
              </div>
            </div>
          </div>
        )}

        {/* Minimal footer */}
        <footer className='relative z-20 bg-blue-800/90 backdrop-blur-sm py-2 border-t border-blue-400/50'>
          <div className='container mx-auto px-4 text-center'>
            <p className='text-white/80 mb-0 text-sm'>
              © 2025 Aqua Stark
            </p>
          </div>
        </footer>
      </div>
    </OrientationLock>
  );
}
