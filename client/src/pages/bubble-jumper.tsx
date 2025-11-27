'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBubbles } from '@/hooks/use-bubbles';
import { BubblesBackground } from '@/components/bubble-background';
import { GameCanvas } from '@/components/mini-games/bubble-jumper/game-canvas';
import { GameUI } from '@/components/mini-games/bubble-jumper/game-ui';
import { GameModals } from '@/components/mini-games/bubble-jumper/game-modals';
import { useGameScoreSubmission } from '@/hooks/use-game-score-submission';

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
  gravity: 0.5,
  jumpForce: -15,
  springJumpForce: -22,
  horizontalSpeed: 5,
  platformWidth: 80,
  platformSpacing: 80,
  gameWidth: 800,
  gameHeight: 600,
  fishWidth: 40,
  fishHeight: 30,
};

export default function BubbleJumperPage() {
  const navigate = useNavigate();
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const { handleGameOver: submitScore } =
    useGameScoreSubmission('bubble-jumper');
  const scoreSubmittedRef = useRef(false);

  // Fixed fish (no localStorage)
  const selectedFish = useMemo(
    () => ({
      id: 'fish001',
      name: 'Aqua Puffer',
      image: '/fish/fish1.png',
      rarity: 'Common',
      multiplier: 1.0,
    }),
    []
  );

  const bubbles = useBubbles({
    initialCount: 10,
    maxBubbles: 20,
    minSize: 6,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
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

  // Submit score when game ends
  useEffect(() => {
    if (
      gameState.isGameOver &&
      gameState.score > 0 &&
      !scoreSubmittedRef.current
    ) {
      scoreSubmittedRef.current = true;
      submitScore(gameState.score);
    }
    if (!gameState.isGameOver) {
      scoreSubmittedRef.current = false;
    }
  }, [gameState.isGameOver, gameState.score, submitScore]);

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

  // Keyboard controls - FIX: handle spacebar before checking isPlaying/isPaused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle spacebar for pause/resume regardless of state
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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
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
                // Broken platform: first touch gives jump, second touch removes it
                if (platform.bounceAnimation) {
                  // Second touch: remove platform
                  newState.platforms.splice(i, 1);
                  continue;
                } else {
                  // First touch: give jump and mark as used
                  fish.velocityY = GAME_CONFIG.jumpForce;
                  platform.bounceAnimation = true; // Reuse this property as "used" flag
                }
              } else if (platform.type === 'spring') {
                // Spring platform gives super jump
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
                // Normal platform
                fish.velocityY = GAME_CONFIG.jumpForce;
              }

              // Update score - FIX: use fish.multiplier from state, not closure
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
    console.log('🚀 handleBack called - navigating to /mini-games');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    navigate('/mini-games');
  };

  return (
    <div className='relative w-full h-screen overflow-hidden bg-[#005C99]'>
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

      <GameCanvas
        gameRef={gameRef}
        platforms={gameState.platforms}
        fish={gameState.fish}
        camera={gameState.camera}
        gameConfig={GAME_CONFIG}
      />

      <div className='relative z-60 p-3 sm:p-4 bg-blue-700 border-b-2 border-blue-400/50'>
        <div className='flex flex-row items-center justify-between mx-auto font-sans max-w-7xl'>
          <div className='flex flex-row items-center'>
            <button
              onClick={handleBack}
              className='flex items-center mr-2 text-xs text-white rounded-full hover:bg-blue-500/50 px-2 sm:px-3 md:px-4 py-1 sm:py-2 h-8 sm:h-9 bg-blue-600/30 border border-blue-400/50 cursor-pointer transition-colors'
              style={{
                pointerEvents: 'auto',
                zIndex: 9999,
                position: 'relative',
              }}
            >
              <svg
                className='mr-1 sm:mr-2'
                width={14}
                height={14}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m12 19-7-7 7-7' />
                <path d='M19 12H5' />
              </svg>
              <span className='text-xs'>Back to Games</span>
            </button>
            <h3 className='text-sm sm:text-base md:text-lg font-semibold text-white select-none leading-tight'>
              Bubble Jumper
            </h3>
          </div>
        </div>
      </div>

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

      {/* Bottom Info Panel */}
      {gameState.isPlaying && (
        <div className='absolute bottom-4 left-4 right-4 pointer-events-none z-40'>
          <div className='bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-md rounded-xl p-4 border-2 border-blue-400/50 flex items-center gap-4 shadow-lg'>
            <img
              src={selectedFish.image || '/placeholder.svg'}
              alt={selectedFish.name}
              className='w-12 h-9 object-contain'
            />
            <div className='flex-1'>
              <h3 className='text-white font-bold'>{selectedFish.name}</h3>
              <p className='text-white/70 text-sm'>
                {selectedFish.rarity} • {selectedFish.multiplier}x XP
              </p>
            </div>
            <div className='text-right'>
              <p className='text-white/70 text-sm'>Controls</p>
              <p className='text-white text-sm'>← → or A D • Space to pause</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
