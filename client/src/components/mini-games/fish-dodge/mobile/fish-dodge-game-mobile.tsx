'use client';

import { FishDodgeCanvasMobile } from './fish-dodge-canvas-mobile';
import { useFishDodgeMobile } from './use-fish-dodge-mobile';

interface FishDodgeGameMobileProps {
  selectedFish?: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FishDodgeGameMobile(_props: FishDodgeGameMobileProps) {
  const {
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
  } = useFishDodgeMobile();

  const handleBack = () => {
    window.location.href = '/mini-games';
  };

  const handleCanvasClick = () => {
    if (!started && !gameOver) {
      startGame();
    }
  };

  return (
    <div
      onClick={handleCanvasClick}
      className='w-full h-full'
      style={{ width: '100vw', maxWidth: '100vw' }}
    >
      <FishDodgeCanvasMobile
        playerX={playerX}
        playerY={playerY}
        fallingFishes={fallingFishes}
        score={score}
        round={round}
        lives={lives}
        started={started}
        gameOver={gameOver}
        onRestart={resetGame}
        onBack={handleBack}
        onInput={handleInput}
        GAME_WIDTH={GAME_WIDTH}
        GAME_HEIGHT={GAME_HEIGHT}
        scale={scale}
        PLAYER_SIZE={PLAYER_SIZE}
        FISH_SIZE={FISH_SIZE}
      />
    </div>
  );
}
