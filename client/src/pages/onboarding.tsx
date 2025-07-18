"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BubblesBackground } from "@/components/bubble-background"
import { useBubbles } from "@/hooks/use-bubbles"
import { FishCard } from "@/components/ui/FishCard"

const starterFish = [
  {
    id: 1,
    name: "REDGLOW",
    image: "/fish/fish3.png",
    description: "A vibrant and energetic fish, ideal for combat.",
    color: "orange-red"
  },
  {
    id: 2,
    name: "BLUESHINE",
    image: "/fish/fish1.png",
    description: "A calm and elegant fish, perfect for exploration.",
    color: "blue"
  },
  {
    id: 3,
    name: "TROPICORAL",
    image: "/fish/fish2.png",
    description: "An exotic and mysterious fish, with unique abilities.",
    color: "orange-pink"
  },
  {
    id: 4,
    name: "SHADOWFIN",
    image: "/fish/fish4.png",
    description: "A stealthy and elusive fish, master of disguise.",
    color: "purple"
  },
  {
    id: 5,
    name: "SUNBURST",
    image: "/fish/fish1.png",
    description: "A radiant and cheerful fish, bringing light to your aquarium.",
    color: "golden"
  },
  {
    id: 6,
    name: "DEEPSCALE",
    image: "/fish/fish2.png",
    description: "A resilient and ancient fish, with deep-sea wisdom.",
    color: "deep-blue"
  }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const bubbles = useBubbles()
  const [selectedFish, setSelectedFish] = useState<number[]>([])

  const handleFishSelect = (fishId: number) => {
    console.log("Fish selected:", fishId)
    setSelectedFish(prev => {
      const newSelection = prev.includes(fishId)
        ? prev.filter(id => id !== fishId)
        : prev.length < 2
          ? [...prev, fishId]
          : [prev[1], fishId]
      
      console.log("New selection:", newSelection)
      return newSelection
    })
  }

  const handleContinue = () => {
    console.log("Continue button clicked, selectedFish:", selectedFish)
    if (selectedFish.length === 2) {
      const fishParams = selectedFish.map(id => {
        const fish = starterFish.find(f => f.id === id)
        return fish?.name.toLowerCase() || ""
      }).join(",")
      
      console.log("Navigating to game with fish:", fishParams)
      navigate(`/game?fish=${fishParams}`)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <div className="water-movement"></div>
      <BubblesBackground bubbles={bubbles} />

      <div className="absolute top-6 right-6 z-50 pointer-events-auto p-2">
        <Button
          onClick={handleContinue}
          disabled={selectedFish.length !== 2}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative z-50 cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to Aqua Stark!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            We see you're new to our aquatic adventure. To get you started, we've gifted you a personalized aquarium and two unique fish to choose from as your initial companions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full"
        >
          {starterFish.map((fish, index) => (
            <motion.div
              key={fish.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <FishCard
                fish={fish}
                isSelected={selectedFish.includes(fish.id)}
                onSelect={() => handleFishSelect(fish.id)}
                variant="onboarding"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-white/80 text-lg">
            {selectedFish.length === 0 && "Select 2 fish to continue"}
            {selectedFish.length === 1 && "Select 1 more fish"}
            {selectedFish.length === 2 && "Perfect! You can now continue"}
          </p>
        </motion.div>
      </main>
    </div>
  )
} 