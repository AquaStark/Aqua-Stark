'use client';

interface GameOverScreenProps {
  score: number;
  round: number;
  onRestart: () => void;
  onBack: () => void;
}

export function GameOverScreen({
  score,
  round,
  onRestart,
  onBack,
}: GameOverScreenProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className='absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div
        className={`bg-blue-900/90 backdrop-blur-md rounded-2xl border-2 border-blue-400/50 shadow-2xl max-w-md w-full mx-4 ${
          isMobile ? 'p-4 rounded-xl' : 'p-8'
        }`}
      >
        <h2
          className={`font-bold text-white text-center mb-2 ${
            isMobile ? 'text-xl' : 'text-3xl'
          }`}
        >
          Game Over!
        </h2>
        <div
          className={`text-center text-white/90 space-y-2 ${
            isMobile ? 'mb-4' : 'mb-6'
          }`}
        >
          <div className={isMobile ? 'text-sm' : 'text-xl'}>
            Final Score:{' '}
            <span className='font-bold text-yellow-400'>{score}</span>
          </div>
          <div className={isMobile ? 'text-xs' : 'text-lg'}>
            Reached Round:{' '}
            <span className='font-bold text-cyan-400'>{round}</span>
          </div>
        </div>
        <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-3'}`}>
          <button
            onClick={onRestart}
            className={`w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:scale-105 ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`}
          >
            Play Again
          </button>
          <button
            onClick={onBack}
            className={`w-full bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:scale-105 ${
              isMobile ? 'py-2 text-sm' : 'py-3'
            }`}
          >
            Back to Arcade
          </button>
        </div>
      </div>
    </div>
  );
}
