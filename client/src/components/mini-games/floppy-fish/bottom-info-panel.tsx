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
    <div className='w-full max-w-xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-between shadow-lg mt-2 select-none'>
      <div className='flex items-center gap-4'>
        <img
          src={fishImage}
          alt={selectedFish.name}
          className='w-16 h-16 object-contain select-none pointer-events-none'
          draggable={false}
        />
        <div>
          <div className='text-white font-bold'>{selectedFish.name}</div>
          <div className='text-cyan-200 text-xs'>
            Experience Multiplier: {selectedFish.experienceMultiplier}x
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end gap-1'>
        <div className='text-white font-bold'>Score: {score}</div>
        <div className='text-cyan-200 text-xs'>Best: {bestScore}</div>
      </div>
    </div>
  );
}
