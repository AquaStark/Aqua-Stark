import { useEffect } from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, onRestart }: GameOverScreenProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart]);

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center bg-blue-900/90 rounded-xl z-40 select-none'>
      <div className='text-white text-3xl font-bold mb-4 select-none'>Game Over</div>
      <div className='text-blue-200 text-lg mb-6 select-none'>Score: {score}</div>
      <button
        className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-semibold text-lg select-none'
        onClick={onRestart}
      >
        Play Again
      </button>
    </div>
  );
}
