'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Mobile-specific dimensions - wider game
const GAME_WIDTH = 1800; // Much wider for mobile
const GAME_HEIGHT = 800;
const PLAYER_SIZE = 120; // Player size - larger than fish
const PLAYER_SPEED = 12;
const PLAYER_START_Y = GAME_HEIGHT - 140;
const PLAYER_START_X = GAME_WIDTH / 2 - PLAYER_SIZE / 2;

const FISH_SIZE = 90; // Fish size - smaller than player
const INITIAL_FALL_SPEED = 2.5;
const FISH_SPAWN_INTERVAL = 1200;

interface FallingFish {
  id: string;
  x: number;
  y: number;
  speed: number;
}

export function useFishDodgeMobile() {
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
  const collisionCooldown = useRef(false);
  const livesRef = useRef(3);
  const collidedFishIds = useRef<Set<string>>(new Set());

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
      if (collisionCooldown.current || livesRef.current <= 0) return;

      const collisions: string[] = [];

      fishes.forEach(fish => {
        if (collidedFishIds.current.has(fish.id)) return;

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
          collidedFishIds.current.add(fish.id);
        }
      });

      if (collisions.length > 0) {
        collisionCooldown.current = true;

        const newLives = livesRef.current - 1;
        livesRef.current = newLives;

        if (newLives <= 0) {
          setGameOver(true);
          setLives(0);
        } else {
          setLives(newLives);
        }

        setFallingFishes(prev => {
          const filtered = prev.filter(f => {
            if (collisions.includes(f.id)) {
              collidedFishIds.current.delete(f.id);
              return false;
            }
            return true;
          });
          return filtered;
        });

        setTimeout(() => {
          collisionCooldown.current = false;
        }, 500);
      }
    },
    [playerY]
  );

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!started || gameOver) return;

      let currentPlayerX = playerX;
      setPlayerX(prev => {
        let newX = prev;
        if (directionRef.current === 'left') {
          newX = Math.max(0, prev - PLAYER_SPEED);
        } else if (directionRef.current === 'right') {
          newX = Math.min(GAME_WIDTH - PLAYER_SIZE, prev + PLAYER_SPEED);
        }
        currentPlayerX = newX;
        return newX;
      });

      spawnFish(currentTime);

      setFallingFishes(prev => {
        const updated = prev.map(fish => ({
          ...fish,
          y: fish.y + fish.speed,
        }));

        checkCollisions(updated, currentPlayerX);

        const removed = updated.filter(fish => fish.y > GAME_HEIGHT);
        if (removed.length > 0) {
          removed.forEach(fish => {
            collidedFishIds.current.delete(fish.id);
          });
          setScore(prev => {
            const newScore = prev + removed.length;
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

  const resetGame = useCallback(() => {
    setPlayerX(PLAYER_START_X);
    setFallingFishes([]);
    setScore(0);
    setRound(1);
    setLives(3);
    livesRef.current = 3;
    setStarted(false);
    setGameOver(false);
    directionRef.current = null;
    fishIdCounter.current = 0;
    lastSpawnTime.current = 0;
    collisionCooldown.current = false;
    collidedFishIds.current.clear();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const startGame = useCallback(() => {
    if (gameOver) {
      resetGame();
    }
    setStarted(true);
  }, [gameOver, resetGame]);

  // Calculate scale for mobile - use full viewport width
  // Account for header (40px) and footer (40px) = 80px total
  const containerWidth =
    typeof window !== 'undefined' ? window.innerWidth : GAME_WIDTH;
  const containerHeight =
    typeof window !== 'undefined'
      ? (window.innerHeight - 80) * 0.95
      : GAME_HEIGHT;
  const scaleX = containerWidth / GAME_WIDTH;
  const scaleY = containerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

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
    PLAYER_SIZE,
    FISH_SIZE,
  };
}
