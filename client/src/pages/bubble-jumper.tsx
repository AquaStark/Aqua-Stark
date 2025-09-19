'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { useBubbles } from '@/hooks/use-bubbles';
import { BubblesBackground } from '@/components/bubble-background';
import { GameCanvas } from '@/components/mini-games/bubble-jumper/game-canvas';
import { GameUI } from '@/components/mini-games/bubble-jumper/game-ui';
import { GameModals } from '@/components/mini-games/bubble-jumper/game-modals';

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

const FISH_TYPES = [
  {
    image: '/fish/fish1.png',
    name: 'SUNBURST',
    rarity: 'Common',
    multiplier: 1.0,
  },
  {
    image: '/fish/fish2.png',
    name: 'BLUESHINE',
    rarity: 'Rare',
    multiplier: 1.2,
  },
  {
    image: '/fish/fish3.png',
    name: 'REDGLOW',
    rarity: 'Epic',
    multiplier: 1.5,
  },
  {
    image: '/fish/fish4.png',
    name: 'SHADOWFIN',
    rarity: 'Legendary',
    multiplier: 2.0,
  },
];

export default function BubbleJumperPage() {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [selectedFish, setSelectedFish] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected-fish');
      if (stored) {
        try {
          const parsedFish = JSON.parse(stored);
          // Ensure the fish has the correct structure with 'multiplier' property
          return {
            ...parsedFish,
            multiplier: parsedFish.multiplier || parsedFish.xpMultiplier || 1.0,
          };
        } catch {
          return FISH_TYPES[0];
        }
      }
    }
    return FISH_TYPES[0];
  });
  // const [showMenu, setShowMenu] = useState(false)
  // const [showTips, setShowTips] = useState(false)

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

    platforms.push({
      id: 0,
      x: GAME_CONFIG.gameWidth / 2 - GAME_CONFIG.platformWidth / 2,
      y: GAME_CONFIG.gameHeight - 50,
      width: GAME_CONFIG.platformWidth,
      type: 'normal',
    });

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;

      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
        return;
      }

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
  }, [gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver || gameState.isPaused)
      return;

    const gameLoop = () => {
      setGameState(prev => {
        const newState = { ...prev };
        const fish = { ...newState.fish };

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

        fish.velocityY += GAME_CONFIG.gravity;
        fish.x += fish.velocityX;
        fish.y += fish.velocityY;

        if (fish.x < -fish.width) fish.x = GAME_CONFIG.gameWidth;
        if (fish.x > GAME_CONFIG.gameWidth) fish.x = -fish.width;

        if (fish.velocityY > 0) {
          for (const platform of newState.platforms) {
            if (
              fish.x + fish.width > platform.x &&
              fish.x < platform.x + platform.width &&
              fish.y + fish.height > platform.y &&
              fish.y + fish.height < platform.y + 20 &&
              fish.velocityY > 0
            ) {
              if (platform.type === 'broken') {
                platform.type = 'normal';
                continue;
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
                Math.floor(heightScore * selectedFish.multiplier)
              );
              break;
            }
          }
        }

        const fishScreenY = fish.y - newState.camera.y;
        if (fishScreenY < GAME_CONFIG.gameHeight * 0.4) {
          newState.camera.y = fish.y - GAME_CONFIG.gameHeight * 0.4;
        }

        const highestPlatform = Math.min(...newState.platforms.map(p => p.y));
        const fishDistanceFromTop = fish.y - highestPlatform;

        if (fishDistanceFromTop < 1000) {
          newState.platforms = generateMorePlatforms(
            newState.platforms,
            highestPlatform
          );
        }

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
    selectedFish.multiplier,
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
    window.history.back();
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('selected-fish');
      if (stored) {
        try {
          const parsedFish = JSON.parse(stored);
          setSelectedFish({
            ...parsedFish,
            multiplier: parsedFish.multiplier || parsedFish.xpMultiplier || 1.0,
          });
        } catch {
          // Keep current fish if parsing fails
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

      <PageHeader
        title='Bubble Jumper'
        backTo='/mini-games'
        backText='Back to Games'
        rightContent={null}
      />

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
