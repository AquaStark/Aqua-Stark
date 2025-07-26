import { useRef, useEffect, useState, useCallback } from "react";
import { Fish } from "./Fish";
import { Obstacles } from "./Obstacles";
import { BottomInfoPanel } from "./BottomInfoPanel";
import { GameOverScreen } from "./GameOverScreen";

interface FloppyFishGameCanvasProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  onGameOver?: (score: number) => void;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const FISH_SIZE = 64;
const GRAVITY = 0.35;
const JUMP_VELOCITY = -6.5;
const COLUMN_WIDTH = 80;
const GAP_HEIGHT = 200;
const COLUMN_INTERVAL = 1600; // ms
const COLUMN_SPEED = 3.2;
const FISH_X = 120;

function getRandomGapY() {
  const minY = 80;
  const maxY = GAME_HEIGHT - GAP_HEIGHT - 80;
  return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
}

function overlap(a: {left: number; right: number; top: number; bottom: number}, b: {left: number; right: number; top: number; bottom: number}) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

export function FloppyFishGameCanvas({ selectedFish, onGameOver }: FloppyFishGameCanvasProps) {
  // Use refs for fast-changing values
  const fishY = useRef(GAME_HEIGHT / 2 - FISH_SIZE / 2);
  const velocity = useRef(0);
  const columns = useRef<{ x: number; gapY: number; scored?: boolean }[]>([]);
  const lastColumnTime = useRef<number>(0);
  const fishRef = useRef<HTMLImageElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastJumpTime = useRef<number>(0); // Prevent rapid jumping

  // Only use state for UI triggers
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [renderColumns, setRenderColumns] = useState<{ x: number; gapY: number; scored?: boolean }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("floppyFishBestScore");
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("floppyFishBestScore", String(score));
    }
  }, [score, bestScore]);

  const resetGame = useCallback(() => {
    fishY.current = GAME_HEIGHT / 2 - FISH_SIZE / 2;
    velocity.current = 0;
    columns.current = [];
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setRenderColumns([]);
    lastColumnTime.current = 0;
    lastJumpTime.current = 0;
    if (fishRef.current) {
      fishRef.current.style.transform = `translate3d(${FISH_X}px, ${fishY.current}px, 0)`;
    }
  }, []);

  const jump = useCallback(() => {
    const now = performance.now();
    // Prevent rapid jumping (debounce)
    if (now - lastJumpTime.current < 50) return;
    lastJumpTime.current = now;
    
    if (!started) setStarted(true);
    velocity.current = JUMP_VELOCITY;
  }, [started]);

  useEffect(() => {
    if (gameOver) return;
    
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      if (gameAreaRef.current && gameAreaRef.current.contains(e.target as Node)) {
        e.preventDefault();
        jump();
      }
    };
    
    const handleTouch = (e: TouchEvent) => {
      if (gameAreaRef.current && gameAreaRef.current.contains(e.target as Node)) {
        e.preventDefault();
        jump();
      }
    };
    
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("touchstart", handleTouch);
    
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [jump, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    
    function loop(now: number) {
      if (started) {
        // Physics
        velocity.current += GRAVITY;
        fishY.current += velocity.current;
        
        // Move columns
        columns.current = columns.current
          .map((col) => ({ ...col, x: col.x - COLUMN_SPEED }))
          .filter((col) => col.x + COLUMN_WIDTH > 0);
        
        // Spawn new columns
        if (now - lastColumnTime.current > COLUMN_INTERVAL) {
          columns.current.push({ x: GAME_WIDTH, gapY: getRandomGapY() });
          lastColumnTime.current = now;
        }
        
        // Score
        let scored = false;
        columns.current = columns.current.map((col) => {
          if (!col.scored && col.x + COLUMN_WIDTH < FISH_X) {
            scored = true;
            return { ...col, scored: true };
          }
          return col;
        });
        if (scored) setScore((s) => s + 1);
        
        // Move fish DOM
        if (fishRef.current) {
          fishRef.current.style.transform = `translate3d(${FISH_X}px, ${fishY.current}px, 0)`;
        }
        
        // Update render columns (only when needed)
        setRenderColumns(columns.current);
      }
      
      // Collision detection
      const fishRect = {
        left: FISH_X,
        right: FISH_X + FISH_SIZE,
        top: fishY.current,
        bottom: fishY.current + FISH_SIZE,
      };
      
      // Boundary collision
      if (fishRect.top < 0 || fishRect.bottom > GAME_HEIGHT) {
        setGameOver(true);
        if (onGameOver) onGameOver(score);
        return;
      }
      
      // Obstacle collision
      for (const col of columns.current) {
        const topRect = {
          left: col.x,
          right: col.x + COLUMN_WIDTH,
          top: 0,
          bottom: col.gapY,
        };
        const bottomRect = {
          left: col.x,
          right: col.x + COLUMN_WIDTH,
          top: col.gapY + GAP_HEIGHT,
          bottom: GAME_HEIGHT,
        };
        
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
  }, [started, gameOver, onGameOver, score]);

  useEffect(() => {
    if (gameOver) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [gameOver]);

  // Responsive scaling: fit both width and height, with a minimum scale for playability
  let scale = 1;
  if (typeof window !== "undefined") {
    const headerFooterEstimate = 120; // px, adjust if needed
    const availableHeight = window.innerHeight - headerFooterEstimate;
    scale = Math.min(
      1,
      (window.innerWidth - 32) / GAME_WIDTH,
      (availableHeight - 32) / GAME_HEIGHT,
    );
    scale = Math.max(scale, 0.5); // Don't go below 50% size for playability
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div
        ref={gameAreaRef}
        className="relative bg-blue-900 rounded-2xl overflow-hidden shadow-2xl border border-blue-700 flex items-center justify-center"
        style={{
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          maxHeight: 'calc(100vh - 120px)', // extra safety for small screens
          backgroundImage: 'url("/mini-games/background.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          touchAction: "manipulation",
        }}
        tabIndex={0}
        aria-label="Floppy Fish Game Area"
      >
        <Fish
          ref={fishRef}
          fishY={fishY.current}
          scale={scale}
          started={started}
          gameOver={gameOver}
          selectedFish={selectedFish}
          FISH_X={FISH_X}
          FISH_SIZE={FISH_SIZE}
        />
        <Obstacles
          columns={renderColumns}
          scale={scale}
          COLUMN_WIDTH={COLUMN_WIDTH}
          GAP_HEIGHT={GAP_HEIGHT}
          GAME_HEIGHT={GAME_HEIGHT}
        />
        {started && !gameOver && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-4xl font-bold drop-shadow-lg z-20 select-none">
            {score}
          </div>
        )}
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <div className="text-white text-3xl font-bold mb-2 drop-shadow">Press Space or Click/Tap to Start</div>
            <div className="text-blue-200 text-base">(or tap the screen on mobile)</div>
          </div>
        )}
        {gameOver && (
          <GameOverScreen score={score} onRestart={resetGame} />
        )}
      </div>
      <BottomInfoPanel selectedFish={selectedFish} score={score} bestScore={bestScore} />
    </div>
  );
} 