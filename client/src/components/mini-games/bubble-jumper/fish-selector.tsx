"use client"

interface FishType {
  image: string
  name: string
  rarity: string
  multiplier: number
}

interface FishSelectorProps {
  fishTypes: FishType[]
  selectedFish: FishType
  onSelectFish: (fish: FishType) => void
}

export function FishSelector({ fishTypes, selectedFish, onSelectFish }: FishSelectorProps) {
  return (
    <div className="mb-6">
      <p className="text-white/90 text-sm mb-3">Choose your fish:</p>
      <div className="flex gap-3 justify-center">
        {fishTypes.map((fish, index) => (
          <button
            key={index}
            onClick={() => onSelectFish(fish)}
            className={`p-3 rounded-xl border-2 transition-all shadow-lg ${
              selectedFish === fish
                ? "border-yellow-400 bg-yellow-400/20 shadow-yellow-400/30"
                : "border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50"
            }`}
          >
            <img src={fish.image || "/placeholder.svg"} alt={fish.name} className="w-10 h-8 object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}
