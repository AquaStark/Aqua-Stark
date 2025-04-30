import { Edit, Trash2, Eye } from "lucide-react";

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

interface AquariumCardProps {
  aquarium: Aquarium;
}

export function AquariumCard({ aquarium }: AquariumCardProps) {
  return (
    <div className="bg-blue-800/40 border border-blue-700/50 rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={aquarium.image || "/placeholder.svg"}
          alt={aquarium.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-900/70 text-white px-2 py-1 rounded-md text-sm flex items-center">
          <span className="mr-1">🐠</span>
          {aquarium.fishCount}
        </div>
        {aquarium.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-blue-900 px-2 py-1 rounded-md text-sm font-bold">
            ★ PREMIUM
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < aquarium.rating ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{aquarium.name}</h3>
          <span className="text-blue-200 text-xs   px-2 py-1.5 bg-white/20 rounded-full">🌡️</span>
        </div>
        <div className="flex items-center text-blue-200 text-sm mb-3">
          <span className="mr-2">Level {aquarium.level}</span>
          <span className="mx-2">•</span>
          <span>{aquarium.type}</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-200">Health</span>
            <span className="text-white">{aquarium.health}%</span>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                aquarium.health > 80
                  ? "bg-green-500"
                  : aquarium.health > 60
                  ? "bg-yellow-500"
                  : "bg-orange-500"
              }`}
              style={{ width: `${aquarium.health}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="text-blue-200">
            Last visited: {aquarium.lastVisited}
          </div>
          <div className="flex space-x-2">
            <button className="text-blue-200 hover:text-white">
              <Edit className="h-4 w-4" />
            </button>
            <button className="text-blue-200 hover:text-white">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="text-blue-200 hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
