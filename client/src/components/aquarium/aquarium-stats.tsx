interface AquariumStatsProps {
  totalAquariums: number;
  totalFish: number;
  premiumAquariums: number;
  averageHealth: number;
}

export function AquariumStats({
  totalAquariums,
  totalFish,
  premiumAquariums,
  averageHealth,
}: AquariumStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-600/30 border border-blue-400/30 rounded-lg p-4">
        <div className="text-blue-200 text-sm">Total Aquariums</div>
        <div className="text-white text-3xl font-bold">{totalAquariums}</div>
      </div>
      <div className="bg-blue-600/30 border border-blue-400/30 rounded-lg p-4">
        <div className="text-blue-200 text-sm">Total Fish</div>
        <div className="text-white text-3xl font-bold">{totalFish}</div>
      </div>
      <div className="bg-blue-600/30 border border-blue-400/30 rounded-lg p-4">
        <div className="text-blue-200 text-sm">Premium Aquariums</div>
        <div className="text-white text-3xl font-bold">{premiumAquariums}</div>
      </div>
      <div className="bg-blue-600/30 border border-blue-400/30 rounded-lg p-4">
        <div className="text-blue-200 text-sm">Average Health</div>
        <div className="text-white text-3xl font-bold">{averageHealth}%</div>
      </div>
    </div>
  );
}
