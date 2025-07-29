interface GameUIProps {
  score: number;
  started: boolean;
}

export function GameUI({ score, started }: GameUIProps) {
  return (
    <>
      {/* Score overlay */}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-20">
        {score}
      </div>
      
      {/* Press to start overlay */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50 rounded-xl z-30">
          <div className="text-white text-xl font-semibold">
            Press Space or Click to Start
          </div>
        </div>
      )}
    </>
  );
} 