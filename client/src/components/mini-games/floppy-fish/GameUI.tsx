

interface GameUIProps {
  score: number;
  started: boolean;
  gameOver: boolean;
}

export function GameUI({ score, started, gameOver }: GameUIProps) {
  return (
    <>
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
    </>
  );
} 