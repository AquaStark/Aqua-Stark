"use client"
import { FishTank } from "@/components/fish-tank"

export function FishCardComponent({
  name,
  image,
  rarity,
}: {
  name: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
}) {
  const rarityColors: Record<typeof rarity, string> = {
    common: "text-gray-300",
    rare: "text-blue-300",
    epic: "text-purple-300",
    legendary: "text-yellow-300",
  }

  return (
    <div className="bg-blue-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-blue-400 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-3xl h-full flex flex-col">
      <div className="p-4 sm:p-6 flex flex-col items-center justify-between h-full text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">{name}</h3>

        <div className="relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden mb-4">
          <div className="absolute inset-0 border border-blue-300/50 rounded-xl sm:rounded-2xl" />
          <FishTank>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-contain w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 transition-transform duration-500 hover:scale-110"
            />
          </FishTank>
        </div>

        <p className="text-xs sm:text-sm text-white/80 mb-4 px-2 sm:px-4">
          A curious aquatic specimen with unique traits and vibrant colors. Perfect for your aquarium.
        </p>
      </div>

      <div className={`w-full p-3 sm:p-5 text-center text-xs sm:text-sm font-bold ${rarityColors[rarity]} bg-blue-200/10 rounded-b-xl sm:rounded-b-2xl`}>
        <span className="capitalize">{rarity}</span>
      </div>
    </div>
  )
}
