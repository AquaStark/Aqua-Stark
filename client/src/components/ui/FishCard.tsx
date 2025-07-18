"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface Fish {
  id: number
  name: string
  image: string
  description: string
  color: string
}

interface FishCardProps {
  fish: Fish
  isSelected?: boolean
  onSelect?: () => void
  variant?: "onboarding" | "default"
}

export function FishCard({ fish, isSelected = false, onSelect, variant = "default" }: FishCardProps) {
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

  if (variant === "onboarding") {
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
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
            {fish.name}
          </h3>

          <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-20 blur-sm`} />
            
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={fish.image}
                alt={fish.name}
                className="w-24 h-24 object-contain relative z-30"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              />
            </div>
            
            <img
              src="/fish/fish-tank.svg"
              alt="Fish Tank"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />

            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-10 animate-pulse z-10`} />
          </div>

          <p className="text-sm text-white/80 leading-relaxed">
            {fish.description}
          </p>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </motion.div>
    )
  }
  return (
    <motion.div
      className="relative bg-gray-800/40 backdrop-blur-sm rounded-xl border-2 border-gray-600 overflow-hidden transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
          {fish.name}
        </h3>

        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-20 blur-sm`} />
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fish.image}
              alt={fish.name}
              className="w-24 h-24 object-contain relative z-30"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            />
          </div>
          
          <img
            src="/fish/fish-tank.svg"
            alt="Fish Tank"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
          />

          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClasses(fish.color)} opacity-10 animate-pulse z-10`} />
        </div>

        <p className="text-sm text-white/80 leading-relaxed">
          {fish.description}
        </p>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  )
} 