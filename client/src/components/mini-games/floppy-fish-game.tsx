import React, { useRef, useEffect, useState, useCallback } from "react";

interface FloppyFishGameProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  onGameOver?: (score: number) => void;
}

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const FISH_SIZE = 48;
const GRAVITY = 0.5;
const JUMP_VELOCITY = -8;
const COLUMN_WIDTH = 60;
const GAP_HEIGHT = 150;
const COLUMN_INTERVAL = 1600; // ms
const COLUMN_SPEED = 2.5;
const FISH_X = 80;

function getRandomGapY() {
  // Ensure gap is always fully on screen
  const minY = 60;
  const maxY = GAME_HEIGHT - GAP_HEIGHT - 60;
  return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
}

export function FloppyFishGame({ selectedFish, onGameOver }: FloppyFishGameProps) {
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
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastColumnTime = useRef<number>(0);

  // Load best score from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("floppyFishBestScore");
    if (stored) setBestScore(Number(stored));
  }, []);

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("floppyFishBestScore", String(score));
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

  // Input listeners
  useEffect(() => {
    if (gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    const handleClick = (e: MouseEvent) => {
      // Only jump if click is inside game area
      if (gameAreaRef.current && gameAreaRef.current.contains(e.target as Node)) {
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [jump, gameOver]);

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
            .map((col) => ({ ...col, x: col.x - COLUMN_SPEED }))
            .filter((col) => col.x + COLUMN_WIDTH > 0)
        );
        // Spawn new columns
        if (now - lastColumnTime.current > COLUMN_INTERVAL) {
          setColumns((cols: { x: number; gapY: number; scored?: boolean }[]) => [
            ...cols,
            { x: GAME_WIDTH, gapY: getRandomGapY() },
          ]);
          lastColumnTime.current = now;
        }
        // Score: passed columns
        setColumns((cols: { x: number; gapY: number; scored?: boolean }[]) => {
          let scored = false;
          const updated = cols.map((col) => {
            if (!col["scored"] && col.x + COLUMN_WIDTH < FISH_X) {
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
        type Rect = { left: number; right: number; top: number; bottom: number };
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
    // eslint-disable-next-line
  }, [started, fishY, velocity, columns, gameOver, onGameOver, score]);

  // Reset on game over
  useEffect(() => {
    if (gameOver) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [gameOver]);

  // Touch support for mobile
  useEffect(() => {
    if (gameOver) return;
    const handleTouch = (e: TouchEvent) => {
      if (gameAreaRef.current && gameAreaRef.current.contains(e.target as Node)) {
        jump();
      }
    };
    window.addEventListener("touchstart", handleTouch);
    return () => window.removeEventListener("touchstart", handleTouch);
  }, [jump, gameOver]);

  // Responsive scaling
  const scale = typeof window !== "undefined"
    ? Math.min(1, (window.innerWidth - 32) / GAME_WIDTH)
    : 1;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative bg-blue-900 rounded-xl overflow-hidden shadow-lg border border-blue-700"
        style={{
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          backgroundImage: 'url("/mini-games/background.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          touchAction: "manipulation",
        }}
        tabIndex={0}
        aria-label="Floppy Fish Game Area"
      >
        {/* Fish */}
        <img
          src={selectedFish.image}
          alt={selectedFish.name}
          className="absolute z-10"
          style={{
            left: FISH_X * scale,
            top: fishY * scale,
            width: FISH_SIZE * scale,
            height: FISH_SIZE * scale,
            transition: started ? "none" : "top 0.3s",
            filter: gameOver ? "grayscale(1)" : "none",
          }}
        />
        {/* Columns */}
        {columns.map((col: { x: number; gapY: number; scored?: boolean }, idx: number) => (
          <>
            {/* Top column */}
            <img
              key={`top-${idx}`}
              src="/mini-games/element-up.webp"
              alt="Column Top"
              className="absolute"
              style={{
                left: col.x * scale,
                top: 0,
                width: COLUMN_WIDTH * scale,
                height: col.gapY * scale,
                objectFit: "fill",
                zIndex: 5,
              }}
            />
            {/* Bottom column */}
            <img
              key={`bot-${idx}`}
              src="/mini-games/element-down.webp"
              alt="Column Bottom"
              className="absolute"
              style={{
                left: col.x * scale,
                top: (col.gapY + GAP_HEIGHT) * scale,
                width: COLUMN_WIDTH * scale,
                height: (GAME_HEIGHT - col.gapY - GAP_HEIGHT) * scale,
                objectFit: "fill",
                zIndex: 5,
              }}
            />
          </>
        ))}
        {/* Score overlay */}
        {started && !gameOver && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-3xl font-bold drop-shadow-lg z-20 select-none">
            {score}
          </div>
        )}
        {/* Start overlay */}
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <div className="text-white text-2xl font-bold mb-2 drop-shadow">Press Space or Click/Tap to Start</div>
            <div className="text-blue-200 text-sm">(or tap the screen on mobile)</div>
          </div>
        )}
        {/* Game Over Panel */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/90 rounded-xl z-40">
            <div className="text-white text-3xl font-bold mb-4">Game Over</div>
            <div className="text-blue-200 text-lg mb-6">Score: {score}</div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold text-lg"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      {/* Info Panel */}
      <FloppyFishInfoPanel selectedFish={selectedFish} score={score} bestScore={bestScore} />
    </div>
  );
}

// Info Panel as a reusable component
function FloppyFishInfoPanel({ selectedFish, score, bestScore }: { selectedFish: { id: string; name: string; image: string; experienceMultiplier: number }; score: number; bestScore: number }) {
  return (
    <div className="w-full max-w-xl bg-blue-800/30 border border-blue-600/30 rounded-xl p-4 flex items-center justify-between shadow-sm mt-2">
      <div className="flex items-center gap-4">
        <img src={selectedFish.image} alt={selectedFish.name} className="w-16 h-16 object-contain" />
        <div>
          <div className="text-white font-bold">{selectedFish.name}</div>
          <div className="text-blue-200 text-xs">Experience Multiplier: {selectedFish.experienceMultiplier}x</div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="text-white font-bold">Score: {score}</div>
        <div className="text-blue-200 text-xs">Best: {bestScore}</div>
      </div>
    </div>
  );
} 