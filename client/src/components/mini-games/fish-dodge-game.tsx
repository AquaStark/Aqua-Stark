'use client';

import { FishDodgeCanvas } from './fish-dodge/fish-dodge-canvas';
import { useFishDodge } from './fish-dodge/use-fish-dodge';
import { useGameScoreSubmission } from '@/hooks/use-game-score-submission';
import { useEffect } from 'react';

interface FishDodgeGameProps {
  selectedFish?: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FishDodgeGame(_props: FishDodgeGameProps) {
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
  } = useFishDodge();

  const { handleGameOver } = useGameScoreSubmission('fish-dodge');

  // Submit score when game ends
  useEffect(() => {
    if (gameOver && score > 0) {
      handleGameOver(score);
    }
  }, [gameOver, score, handleGameOver]);

  const handleBack = () => {
    window.location.href = '/mini-games';
  };

  const handleCanvasClick = () => {
    if (!started && !gameOver) {
      startGame();
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      onClick={handleCanvasClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCanvasClick();
        }
      }}
      role='button'
      tabIndex={0}
      className={isMobile ? 'w-screen' : ''}
      style={isMobile ? { width: '100vw', maxWidth: '100vw' } : {}}
    >
      <FishDodgeCanvas
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
      />
    </div>
  );
}
