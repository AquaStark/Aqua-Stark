"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface StarterFish {
  id: number
  name: string
  image: string
  description: string
  color: string
}

interface StarterFishCardProps {
  fish: StarterFish
  isSelected: boolean
  onSelect: () => void
}

export function StarterFishCard({ fish, isSelected, onSelect }: StarterFishCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "orange-red":
        return "from-orange-500 to-red-500"
      case "blue":
        return "from-blue-400 to-cyan-400"
      case "orange-pink":
        return "from-orange-400 to-pink-500"
      case "purple":
        return "from-purple-600 to-purple-400"
      case "golden":
        return "from-yellow-400 to-orange-400"
      case "deep-blue":
        return "from-blue-600 to-blue-400"
      default:
        return "from-blue-400 to-cyan-400"
    }
  }

  return (
    <motion.div
      className={`relative bg-gray-800/40 backdrop-blur-sm rounded-xl border-2 cursor-pointer overflow-hidden transition-all duration-300 ${
        isSelected 
          ? "border-green-400 shadow-lg shadow-green-400/30 scale-105" 
          : "border-gray-600 hover:border-gray-400 hover:scale-102"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 z-20 bg-green-500 rounded-full p-1"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      <div className="p-4 text-center">
        {/* Fish name */}
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
          {fish.name}
        </h3>

        {/* Fish visual representation - glowing oval shapes */}
        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          {/* Outer glow */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-30 blur-sm`} />
          
          {/* Main oval */}
          <div className={`relative w-24 h-16 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} shadow-lg`}>
            {/* Inner oval */}
            <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-80`}>
              {/* Eye */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* Additional glow effect */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-20 animate-pulse`} />
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed">
          {fish.description}
        </p>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  )
} 