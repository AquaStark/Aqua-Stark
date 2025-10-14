interface BottomInfoPanelProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  score: number;
  bestScore: number;
}

export function BottomInfoPanel({
  selectedFish,
  score,
  bestScore,
}: BottomInfoPanelProps) {
  const fishImage = selectedFish.image.replace('.png', '-flip.png');

  return (
    <div className='w-full max-w-xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between shadow-lg mt-2 select-none gap-3 sm:gap-0'>
      <div className='flex items-center gap-3 sm:gap-4'>
        <img
          src={fishImage}
          alt={selectedFish.name}
          className='w-12 h-12 sm:w-16 sm:h-16 object-contain select-none pointer-events-none'
          draggable={false}
        />
        <div className='text-center sm:text-left'>
          <div className='text-white font-bold text-sm sm:text-base'>
            {selectedFish.name}
          </div>
          <div className='text-cyan-200 text-xs'>
            Exp: {selectedFish.experienceMultiplier}x
          </div>
        </div>
      </div>
      <div className='flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1'>
        <div className='text-white font-bold text-sm sm:text-base'>
          Score: {score}
        </div>
        <div className='text-cyan-200 text-xs'>Best: {bestScore}</div>
      </div>
    </div>
  );
}
