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
    <div className='w-full max-w-xl bg-blue-800/30 border border-blue-600/30 rounded-xl p-4 flex items-center justify-between shadow-sm mt-2'>
      <div className='flex items-center gap-4'>
        <img
          src={fishImage}
          alt={selectedFish.name}
          className='w-16 h-16 object-contain'
        />
        <div>
          <div className='text-white font-bold'>{selectedFish.name}</div>
          <div className='text-blue-200 text-xs'>
            Experience Multiplier: {selectedFish.experienceMultiplier}x
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end gap-1'>
        <div className='text-white font-bold'>Score: {score}</div>
        <div className='text-blue-200 text-xs'>Best: {bestScore}</div>
      </div>
    </div>
  );
}
