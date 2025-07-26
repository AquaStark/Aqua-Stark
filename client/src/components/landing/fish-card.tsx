"use client"
import { FishTank } from "@/components/fish-tank"

export function FishCardComponent({ name, image, price, rarity }: { name: string; image: string; price: number; rarity: string }) {
  return (
    <div className="bg-blue-600/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-3 border-blue-400 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl h-full max-h-80 w-full max-w-xs mx-auto flex flex-col">
      <div className="p-2 sm:p-3 md:p-4 text-center flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md flex-shrink-0">{name}</h3>
        <div className="relative mx-auto w-full flex-1 min-h-0 bg-gradient-to-b from-blue-400/30 to-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-300/50"></div>
          <FishTank>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-contain transform hover:scale-110 transition-all duration-500 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32"
            />
          </FishTank>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-center flex-shrink-0">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 border border-white/20">
            <span className={`text-xs sm:text-sm font-bold ${
              rarity === 'Common' ? 'text-gray-300' :
              rarity === 'Rare' ? 'text-blue-300' :
              rarity === 'Epic' ? 'text-purple-300' :
              rarity === 'Legendary' ? 'text-yellow-300' :
              'text-white'
            }`}>
              {rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}