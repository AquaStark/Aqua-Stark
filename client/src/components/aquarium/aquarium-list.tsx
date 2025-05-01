import { AquariumCard } from "./aquarium-card";

interface Aquarium {
  id: number;
  name: string;
  image: string;
  level: number;
  type: string;
  health: number;
  lastVisited: string;
  fishCount: string;
  rating: number;
  isPremium?: boolean;
}

interface AquariumListProps {
  aquariums: Aquarium[];
}

export function AquariumList({ aquariums }: AquariumListProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-4">
        My Collection ({aquariums.length})
      </h2>
      {aquariums.length === 0 ? (
        <div className="bg-blue-800/40 border border-blue-700/50 rounded-lg p-8 text-center">
          <p className="text-blue-200 text-lg">
            No aquariums found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aquariums.map((aquarium) => (
            <AquariumCard key={aquarium.id} aquarium={aquarium} />
          ))}
        </div>
      )}
    </>
  );
}
