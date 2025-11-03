'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 50;
const PLAYER_SPEED = 8;
const PLAYER_START_Y = GAME_HEIGHT - 80;
const PLAYER_START_X = GAME_WIDTH / 2 - PLAYER_SIZE / 2;

const FISH_SIZE = 40;
const INITIAL_FALL_SPEED = 2;
const FISH_SPAWN_INTERVAL = 1500;

interface FallingFish {
  id: string;
  x: number;
  y: number;
  speed: number;
}

export function useFishDodge() {
  const [playerX, setPlayerX] = useState(PLAYER_START_X);
  const [playerY] = useState(PLAYER_START_Y);
  const [fallingFishes, setFallingFishes] = useState<FallingFish[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const animationRef = useRef<number>();
  const fishIdCounter = useRef(0);
  const lastSpawnTime = useRef(0);
  const directionRef = useRef<'left' | 'right' | null>(null);

  const getFallSpeed = useCallback(() => {
    return INITIAL_FALL_SPEED + (round - 1) * 0.5;
  }, [round]);

  const spawnFish = useCallback(
    (currentTime: number) => {
      if (
        currentTime - lastSpawnTime.current >=
        FISH_SPAWN_INTERVAL / (round * 0.3 + 1)
      ) {
        const newFish: FallingFish = {
          id: `fish-${fishIdCounter.current++}`,
          x: Math.random() * (GAME_WIDTH - FISH_SIZE),
          y: -FISH_SIZE,
          speed: getFallSpeed(),
        };
        setFallingFishes(prev => [...prev, newFish]);
        lastSpawnTime.current = currentTime;
      }
    },
    [round, getFallSpeed]
  );

  const checkCollisions = useCallback(
    (fishes: FallingFish[], currentPlayerX: number) => {
      const collisions: string[] = [];

      fishes.forEach(fish => {
        const fishCenterX = fish.x + FISH_SIZE / 2;
        const fishCenterY = fish.y + FISH_SIZE / 2;
        const playerCenterX = currentPlayerX + PLAYER_SIZE / 2;
        const playerCenterY = playerY + PLAYER_SIZE / 2;

        const distance = Math.sqrt(
          Math.pow(fishCenterX - playerCenterX, 2) +
            Math.pow(fishCenterY - playerCenterY, 2)
        );

        if (distance < FISH_SIZE / 2 + PLAYER_SIZE / 2 - 5) {
          collisions.push(fish.id);
        }
      });

      if (collisions.length > 0) {
        setLives(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });

        // Remove the fish that caused collision
        setFallingFishes(prev => prev.filter(f => !collisions.includes(f.id)));
      }
    },
    [playerY]
  );

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!started || gameOver) return;

      // Update player position
      setPlayerX(prev => {
        let newX = prev;
        if (directionRef.current === 'left') {
          newX = Math.max(0, prev - PLAYER_SPEED);
        } else if (directionRef.current === 'right') {
          newX = Math.min(GAME_WIDTH - PLAYER_SIZE, prev + PLAYER_SPEED);
        }
        return newX;
      });

      // Spawn new fish
      spawnFish(currentTime);

      // Update falling fishes and check collisions
      setFallingFishes(prev => {
        const updated = prev.map(fish => ({
          ...fish,
          y: fish.y + fish.speed,
        }));

        // Check collisions before removing out-of-bounds fish
        const currentPlayerX = playerX;
        checkCollisions(updated, currentPlayerX);

        // Remove fish that are out of bounds and increase score
        const removed = updated.filter(fish => fish.y > GAME_HEIGHT);
        if (removed.length > 0) {
          setScore(prev => {
            const newScore = prev + removed.length;
            // Advance round every 20 points
            if (Math.floor(newScore / 20) > Math.floor(prev / 20)) {
              setRound(currentRound => currentRound + 1);
            }
            return newScore;
          });
        }

        return updated.filter(fish => fish.y <= GAME_HEIGHT);
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [started, gameOver, spawnFish, checkCollisions, playerX]
  );

  useEffect(() => {
    if (started && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [started, gameOver, gameLoop]);

  const handleInput = useCallback(
    (direction: 'left' | 'right' | null) => {
      if (!started || gameOver) return;
      directionRef.current = direction;
    },
    [started, gameOver]
  );

  const startGame = useCallback(() => {
    if (gameOver) {
      resetGame();
    }
    setStarted(true);
  }, [gameOver]);

  const resetGame = useCallback(() => {
    setPlayerX(PLAYER_START_X);
    setFallingFishes([]);
    setScore(0);
    setRound(1);
    setLives(3);
    setStarted(false);
    setGameOver(false);
    directionRef.current = null;
    fishIdCounter.current = 0;
    lastSpawnTime.current = 0;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Calculate scale for responsive design
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const containerWidth = isMobile
    ? Math.min(window.innerWidth * 0.95, GAME_WIDTH)
    : Math.min(window.innerWidth * 0.8, 800);
  const containerHeight = isMobile
    ? Math.min(window.innerHeight * 0.7, GAME_HEIGHT)
    : Math.min(window.innerHeight * 0.6, 600);
  const scaleX = containerWidth / GAME_WIDTH;
  const scaleY = containerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY, isMobile ? 1.2 : 1.5);

  return {
    playerX,
    playerY,
    fallingFishes,
    score,
    round,
    lives,
    started,
    gameOver,
    handleInput,
    startGame,
    resetGame,
    GAME_WIDTH,
    GAME_HEIGHT,
    scale,
  };
}
