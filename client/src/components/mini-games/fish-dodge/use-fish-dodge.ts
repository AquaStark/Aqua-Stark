'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GAME_WIDTH = 560; // 40% wider (400 * 1.4)
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
      // Prevent multiple collisions in the same frame
      if (collisionCooldown.current || livesRef.current <= 0) return;

      const collisions: string[] = [];

      fishes.forEach(fish => {
        // Skip fish that already collided
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
          // Mark this fish as having collided
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

        // Remove collided fish immediately and clean up their IDs from the set
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

        // Reset cooldown after a short delay
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

      // Update player position
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

      // Update falling fishes and check collisions
      setFallingFishes(prev => {
        const updated = prev.map(fish => ({
          ...fish,
          y: fish.y + fish.speed,
        }));

        // Check collisions using ref for current lives value
        checkCollisions(updated, currentPlayerX);

        const removed = updated.filter(fish => fish.y > GAME_HEIGHT);
        if (removed.length > 0) {
          // Clean up IDs of fish that went out of bounds
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  let containerWidth: number;
  let containerHeight: number;
  let scale: number;

  if (isMobile) {
    // On mobile, use full viewport width
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight * 0.75;
    // Calculate scale to fill the width - prioritize width on mobile
    scale = containerWidth / GAME_WIDTH; // Use width-based scale directly to fill screen
  } else {
    // PC: keep original logic
    containerWidth = Math.min(window.innerWidth * 0.85, 1000);
    containerHeight = Math.min(window.innerHeight * 0.6, 600);
    const scaleX = containerWidth / GAME_WIDTH;
    const scaleY = containerHeight / GAME_HEIGHT;
    scale = Math.min(scaleX, scaleY, 1.8);
  }

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
