import { useGameLogic } from '@/hooks';
import { useInputHandler } from '@/hooks';
import { Fish } from './Fish';
import { Obstacles } from './Obstacles';
import { BottomInfoPanel } from './bottom-info-panel';
import { GameOverScreen } from './game-over-screen';
import { GameUI } from './game-ui';

interface FloppyFishGameCanvasProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
}

export function FloppyFishGameCanvas({
  selectedFish,
}: FloppyFishGameCanvasProps) {
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
  } = useGameLogic();

  const { gameAreaRef } = useInputHandler(jump, gameOver);

  // Calculate scale to fit the game in the available space with better mobile support
  const isMobile = window.innerWidth < 768;
  const containerWidth = isMobile 
    ? Math.min(window.innerWidth * 0.95, GAME_WIDTH) 
    : Math.min(window.innerWidth * 0.8, 800);
  const containerHeight = isMobile 
    ? Math.min(window.innerHeight * 0.7, GAME_HEIGHT) 
    : Math.min(window.innerHeight * 0.6, 600);
  const scaleX = containerWidth / GAME_WIDTH;
  const scaleY = containerHeight / GAME_HEIGHT;
  const scale = Math.min(scaleX, scaleY, isMobile ? 1.2 : 1.5); // Better mobile scaling

  return (
    <div className='flex flex-col items-center justify-center w-full px-2 sm:px-4'>
      {/* Game Canvas */}
      <div
        ref={gameAreaRef}
        className='relative bg-blue-900/20 border border-blue-600/30 rounded-2xl overflow-hidden cursor-pointer'
        style={{
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          backgroundImage: "url('/mini-games/background.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Game Elements */}
        <Fish
          selectedFish={selectedFish}
          fishY={fishY}
          scale={scale}
          started={started}
          gameOver={gameOver}
          FISH_X={FISH_X}
          FISH_SIZE={FISH_SIZE}
        />

        <Obstacles
          columns={columns}
          scale={scale}
          COLUMN_WIDTH={COLUMN_WIDTH}
          GAP_HEIGHT={GAP_HEIGHT}
          GAME_HEIGHT={GAME_HEIGHT}
        />

        <GameUI score={score} started={started} />

        {gameOver && <GameOverScreen score={score} onRestart={resetGame} />}
      </div>

      {/* Bottom Info Panel */}
      <BottomInfoPanel
        selectedFish={selectedFish}
        score={score}
        bestScore={bestScore}
      />
    </div>
  );
}
