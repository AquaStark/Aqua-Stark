'use client';

interface FishDodgeUIProps {
  score: number;
  round: number;
  lives: number;
  started: boolean;
  gameOver: boolean;
}

export function FishDodgeUI({
  score,
  round,
  lives,
  gameOver,
}: FishDodgeUIProps) {
  if (gameOver) return null;

  return (
    <div className='absolute top-4 left-4 right-4 z-50 flex justify-between items-start'>
      {/* Left side - Score and Round */}
      <div className='bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20'>
        <div className='text-white text-sm font-bold'>
          <div>Score: {score}</div>
          <div className='text-xs mt-1'>Round: {round}</div>
        </div>
      </div>

      {/* Right side - Lives */}
      <div className='bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20'>
        <div className='flex items-center gap-2'>
          <span className='text-white text-sm font-bold'>Lives:</span>
          <div className='flex gap-1'>
            {[1, 2, 3].map(life => (
              <div
                key={life}
                className={`w-4 h-4 rounded-full border-2 ${
                  life <= lives
                    ? 'bg-green-500 border-green-300'
                    : 'bg-gray-700 border-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
