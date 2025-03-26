import { FishType } from "@/types/game"

interface FishDisplayProps {
  fish: FishType[]
}

export function FishDisplay({ fish }: FishDisplayProps) {
  return (
    <div>
      {fish.map((fish) => (
        <div
          key={fish.id}
          className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
          style={{ left: `${fish.position.x}%`, top: `${fish.position.y}%` }}
        >
          <div className="relative">
            <img
              src={fish.image || "/placeholder.svg"}
              alt={fish.name}
              width={80}
              height={80}
              className="transform hover:scale-110 transition-transform duration-200"
            />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 game-container p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              <div className="font-bold text-white">{fish.name}</div>
              <div className="text-xs text-white/80">
                Rarity: {fish.rarity} • Gen {fish.generation}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 