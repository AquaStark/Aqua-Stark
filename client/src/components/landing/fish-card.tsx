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
    <div className="bg-blue-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-400 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl h-full flex flex-col">
      <div className="p-4 text-center flex flex-col items-center justify-between h-full ">
        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{name}</h3>

        <div className="relative w-full aspect-square bg-gradient-to-b from-blue-600/30 to-blue-900/80 rounded-2xl flex items-center justify-center overflow-hidden mb-3">
          <div className="absolute inset-0 rounded-2xl w-22 h-22 border border-blue-300/50"></div>
          <FishTank>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-contain transition-transform duration-500 w-24 h-24 hover:scale-110"
            />
          </FishTank>
        </div>

        <p className="text-sm text-white/80 mb-3">
          A curious aquatic specimen with unique traits and vibrant colors. Perfect for your aquarium.
        </p>
      </div>
      <div className={`w-full p-5 rounded-b-2xl text-center text-sm font-bold ${rarityColors[rarity]} bg-blue-200/10`}>
        <span className="capitalize">{rarity}</span>
      </div>
    </div>
  )
}
