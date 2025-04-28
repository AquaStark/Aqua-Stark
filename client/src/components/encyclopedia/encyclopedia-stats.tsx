import { useEncyclopedia } from "@/hooks/use-encyclopedia";

export default function EncyclopediaStats() {
  const { totalSpecies, discoveredSpecies } = useEncyclopedia();

  const progress = (discoveredSpecies / totalSpecies) * 100;

  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Collection Stats</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-blue-200">Discovered Species:</span>
          <span className="font-bold">
            {discoveredSpecies} / {totalSpecies}
          </span>
        </div>

        <div className="w-full bg-blue-950/50 h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-blue-300 text-sm italic">
          You're {progress.toFixed(1)}% of the way to discovering all available
          species!
        </p>
      </div>
    </div>
  );
}
