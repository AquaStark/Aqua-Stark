
import { Fish } from "./Fish";
import { Obstacles } from "./Obstacles";
import { BottomInfoPanel } from "./BottomInfoPanel";
import { GameOverScreen } from "./GameOverScreen";
import { GameUI } from "./GameUI";
import { useGameLogic } from "./useGameLogic";
import { useInputHandler } from "./useInputHandler";

interface FloppyFishGameCanvasProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  onGameOver?: (score: number) => void;
}

export function FloppyFishGameCanvas({ selectedFish, onGameOver }: FloppyFishGameCanvasProps) {
  const {
    fishY,
    columns,
    score,
    bestScore,
    gameOver,
    started,
    jump,
    resetGame,
    GAME_WIDTH,
    GAME_HEIGHT,
    FISH_SIZE,
    FISH_X,
    COLUMN_WIDTH,
    GAP_HEIGHT,
  } = useGameLogic(onGameOver);

  const { gameAreaRef } = useInputHandler(jump, gameOver);

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
        <Fish
          selectedFish={selectedFish}
          fishY={fishY}
          scale={scale}
          started={started}
          gameOver={gameOver}
          FISH_X={FISH_X}
          FISH_SIZE={FISH_SIZE}
        />
        
        {/* Obstacles */}
        <Obstacles
          columns={columns}
          scale={scale}
          COLUMN_WIDTH={COLUMN_WIDTH}
          GAP_HEIGHT={GAP_HEIGHT}
          GAME_HEIGHT={GAME_HEIGHT}
        />
        
        {/* Game UI */}
        <GameUI score={score} started={started} gameOver={gameOver} />
        
        {/* Game Over Screen */}
        {gameOver && (
          <GameOverScreen score={score} onRestart={resetGame} />
        )}
      </div>
      
      {/* Info Panel */}
      <BottomInfoPanel selectedFish={selectedFish} score={score} bestScore={bestScore} />
    </div>
  );
} 