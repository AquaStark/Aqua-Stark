interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, onRestart }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/90 rounded-2xl z-40">
      <div className="text-white text-4xl font-bold mb-6">Game Over</div>
      <div className="text-blue-200 text-2xl mb-8">Score: {score}</div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-10 rounded-lg font-semibold text-2xl shadow-lg"
        onClick={onRestart}
      >
        Play Again
      </button>
    </div>
  );
} 