import { useRef, useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks';

/**
 * Game constants used across the Floppy Fish game logic.
 */
const GAME_WIDTH = 600; // Increased from 400
const GAME_HEIGHT = 400; // Reduced from 500 for better aspect ratio
const FISH_SIZE = 40; // Slightly smaller for better proportions
const GRAVITY = 0.3; // Reduced from 0.5 for smoother movement
const JUMP_VELOCITY = -5; // Reduced from -8 for less sensitive jumps
const COLUMN_WIDTH = 80; // Increased for better visibility
const GAP_HEIGHT = 120; // Reduced for easier gameplay
const COLUMN_INTERVAL = 2000; // Increased from 1600 for more spacing
const COLUMN_SPEED = 2; // Reduced from 2.5 for slower movement
const FISH_X = 120; // Moved further right for better visibility

/**
 * Generate a random vertical position for a new gap between columns.
 * Ensures that the gap is always fully visible on screen.
 *
 * @returns {number} The vertical Y coordinate for the top of the gap.
 */
function getRandomGapY(): number {
  const minY = 80;
  const maxY = GAME_HEIGHT - GAP_HEIGHT - 80;
  return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
}

/**
 * Hook that encapsulates the entire game loop and logic for the Floppy Fish game.
 * Handles fish physics, column spawning, collisions, scoring, and persistent best score.
 *
 * @param {function} [onGameOver] - Optional callback triggered when the game ends,
 * receiving the final score as argument.
 * @returns {{
 *   fishY: number,
 *   columns: {x: number, gapY: number, scored?: boolean}[],
 *   score: number,
 *   bestScore: number,
 *   gameOver: boolean,
 *   started: boolean,
 *   jump: () => void,
 *   resetGame: () => void,
 *   GAME_WIDTH: number,
 *   GAME_HEIGHT: number,
 *   FISH_SIZE: number,
 *   FISH_X: number,
 *   COLUMN_WIDTH: number,
 *   GAP_HEIGHT: number
 * }}
 */
export function useGameLogic(onGameOver?: (score: number) => void) {
  const { get, set } = useLocalStorage();
  // Fish state
  const [fishY, setFishY] = useState(GAME_HEIGHT / 2 - FISH_SIZE / 2);
  const [velocity, setVelocity] = useState(0);
  // Columns: { x, gapY }
  const [columns, setColumns] = useState<{ x: number; gapY: number }[]>([]);
  // Game state
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const animationRef = useRef<number>();
  const lastColumnTime = useRef<number>(0);

  // Load best score using unified localStorage hook
  useEffect(() => {
    const stored = get<number>('floppyFishBestScore', {
      parser: (raw: string) => Number(raw),
      validate: (v: unknown): v is number =>
        typeof v === 'number' && Number.isFinite(v),
    });
    if (typeof stored === 'number') setBestScore(stored);
  }, []);

  // Save best score using unified localStorage hook
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      set('floppyFishBestScore', score);
    }
  }, [score, bestScore]);

  // Reset game state
  const resetGame = useCallback(() => {
    setFishY(GAME_HEIGHT / 2 - FISH_SIZE / 2);
    setVelocity(0);
    setColumns([]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
    lastColumnTime.current = 0;
  }, []);

  // Fish jump handler
  const jump = useCallback(() => {
    if (!started) setStarted(true);
    setVelocity(JUMP_VELOCITY);
  }, [started]);

  // Main game loop
  useEffect(() => {
    if (gameOver) return;
    function loop(now: number) {
      // Only update if game started
      if (started) {
        // Fish physics
        setVelocity((v: number) => v + GRAVITY);
        setFishY((y: number) => y + velocity);
        // Column movement
        setColumns((cols: { x: number; gapY: number; scored?: boolean }[]) =>
          cols
            .map(col => ({ ...col, x: col.x - COLUMN_SPEED }))
            .filter(col => col.x + COLUMN_WIDTH > 0)
        );
        // Spawn new columns
        if (now - lastColumnTime.current > COLUMN_INTERVAL) {
          setColumns(
            (cols: { x: number; gapY: number; scored?: boolean }[]) => [
              ...cols,
              { x: GAME_WIDTH, gapY: getRandomGapY() },
            ]
          );
          lastColumnTime.current = now;
        }
        // Score: passed columns
        setColumns((cols: { x: number; gapY: number; scored?: boolean }[]) => {
          let scored = false;
          const updated = cols.map(col => {
            if (!col['scored'] && col.x + COLUMN_WIDTH < FISH_X) {
              scored = true;
              return { ...col, scored: true };
            }
            return col;
          });
          if (scored) setScore((s: number) => s + 1);
          return updated;
        });
      }
      // Collision detection
      const fishRect = {
        left: FISH_X,
        right: FISH_X + FISH_SIZE,
        top: fishY,
        bottom: fishY + FISH_SIZE,
      };
      // Out of bounds
      if (fishRect.top < 0 || fishRect.bottom > GAME_HEIGHT) {
        setGameOver(true);
        if (onGameOver) onGameOver(score);
        return;
      }
      // Columns
      for (const col of columns) {
        // Top column
        const topRect = {
          left: col.x,
          right: col.x + COLUMN_WIDTH,
          top: 0,
          bottom: col.gapY,
        };
        // Bottom column
        const bottomRect = {
          left: col.x,
          right: col.x + COLUMN_WIDTH,
          top: col.gapY + GAP_HEIGHT,
          bottom: GAME_HEIGHT,
        };
        // Check collision
        type Rect = {
          left: number;
          right: number;
          top: number;
          bottom: number;
        };
        function overlap(a: Rect, b: Rect) {
          return (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
          );
        }
        if (overlap(fishRect, topRect) || overlap(fishRect, bottomRect)) {
          setGameOver(true);
          if (onGameOver) onGameOver(score);
          return;
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [started, fishY, velocity, columns, gameOver, onGameOver, score]);

  // Reset on game over
  useEffect(() => {
    if (gameOver) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [gameOver]);

  return {
    // Game state
    fishY,
    columns,
    score,
    bestScore,
    gameOver,
    started,
    // Actions
    jump,
    resetGame,
    // Constants
    GAME_WIDTH,
    GAME_HEIGHT,
    FISH_SIZE,
    FISH_X,
    COLUMN_WIDTH,
    GAP_HEIGHT,
  };
}
