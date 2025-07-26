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

export function BottomInfoPanel({ selectedFish, score, bestScore }: BottomInfoPanelProps) {
  // Always use the forward-facing (right direction) version of the fish image
  let fishImage = selectedFish.image;
  if (!fishImage.endsWith("-flip.png")) {
    fishImage = fishImage.replace(".png", "-flip.png");
  }

  return (
    <div className="w-full max-w-2xl bg-blue-800/30 border border-blue-600/30 rounded-2xl p-6 flex items-center justify-between shadow-md mt-4">
      <div className="flex items-center gap-6">
        <img src={fishImage} alt={selectedFish.name} className="w-20 h-20 object-contain" />
        <div>
          <div className="text-white font-bold text-lg">{selectedFish.name}</div>
          <div className="text-blue-200 text-sm">Experience Multiplier: {selectedFish.experienceMultiplier}x</div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="text-white font-bold text-xl">Score: {score}</div>
        <div className="text-blue-200 text-sm">Best: {bestScore}</div>
      </div>
    </div>
  );
} 