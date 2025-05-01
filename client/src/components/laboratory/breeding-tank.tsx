"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FishTank } from "@/components/fish-tank"
import { X, Heart, Clock, AlertTriangle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Fish, BreedingPair } from "@/types/fish"

interface BreedingTankProps {
  breedingPair: BreedingPair
  onReset: () => void
  breedingResults: any[]
}

export function BreedingTank({ breedingPair, onReset, breedingResults }: BreedingTankProps) {
  const [isBreeding, setIsBreeding] = useState(false)
  const [breedingProgress, setBreedingProgress] = useState(0)
  const [breedingResult, setBreedingResult] = useState<Fish | null>(null)
  const [showBreedingResult, setShowBreedingResult] = useState(false)
  const [showCompatibilityWarning, setShowCompatibilityWarning] = useState(false)
  const breedingTimerRef = useRef<number | null>(null)

  // Start breeding process
  const startBreeding = () => {
    // Check if both fish are selected
    if (!breedingPair.father || !breedingPair.mother) {
      return
    }

    // Check compatibility (for demo, just check if they're the same species)
    if (breedingPair.father.id === breedingPair.mother.id) {
      setShowCompatibilityWarning(true)
      return
    }

    setIsBreeding(true)
    setBreedingProgress(0)

    // Simulate breeding process with timer
    breedingTimerRef.current = window.setInterval(() => {
      setBreedingProgress((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          // Breeding complete
          if (breedingTimerRef.current) {
            clearInterval(breedingTimerRef.current)
          }

          // For demo, just use one of the existing breeding results
          const resultIndex = Math.floor(Math.random() * breedingResults.length)
          setBreedingResult(breedingResults[resultIndex] || null)

          setTimeout(() => {
            setIsBreeding(false)
            setShowBreedingResult(true)
          }, 500)

          return 100
        }
        return newProgress
      })
    }, 100) // Update every 100ms for a total of 10 seconds
  }

  // Reset breeding process
  const resetBreeding = () => {
    if (breedingTimerRef.current) {
      clearInterval(breedingTimerRef.current)
    }
    setIsBreeding(false)
    setBreedingProgress(0)
    setBreedingResult(null)
    setShowBreedingResult(false)
    setShowCompatibilityWarning(false)
    onReset()
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (breedingTimerRef.current) {
        clearInterval(breedingTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden flex flex-col lg:h-full">
      <div className="p-4 border-b border-blue-700/50 flex justify-between items-center">
        <h3 className="font-bold text-white">Breeding Tank</h3>
        {(breedingPair.father || breedingPair.mother) && (
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-700/30 hover:bg-blue-600/50 border-blue-600/50 text-white py-1 h-auto transition-colors duration-200"
            onClick={resetBreeding}
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {showBreedingResult ? (
        <div className="p-6 flex flex-col items-center overflow-y-auto flex-1">
          <div className="text-center mb-4">
            <div className="inline-block bg-green-500/20 text-green-100 px-3 py-1 rounded-full text-sm mb-2">
              Breeding Successful!
            </div>
            <h3 className="text-xl font-bold text-white">New Fish Born!</h3>
          </div>

          <div className="relative w-40 h-40 mb-4">
            <FishTank className="h-40">
              <img
                src={breedingResult?.image || "/fish/unkown-fish.png"}
                alt={breedingResult?.name || "New Fish"}
                className="w-32 h-32 object-contain"
              />
            </FishTank>
          </div>

          <div className="text-center mb-6">
            <h4 className="font-bold text-white text-lg">{breedingResult?.name}</h4>
            <div className="flex justify-center items-center mt-1">
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  breedingResult?.rarity === "Common"
                    ? "bg-gray-500/50 text-gray-100"
                    : breedingResult?.rarity === "Uncommon"
                      ? "bg-green-500/50 text-green-100"
                      : breedingResult?.rarity === "Rare"
                        ? "bg-blue-500/50 text-blue-100"
                        : breedingResult?.rarity === "Epic"
                          ? "bg-purple-500/50 text-purple-100"
                          : "bg-amber-500/50 text-amber-100",
                )}
              >
                {breedingResult?.rarity}
              </span>
              <span className="text-blue-200 text-xs ml-2">Gen {breedingResult?.generation}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            {breedingResult?.traits &&
              Object.entries(breedingResult.traits).map(([trait, value]) => (
                <div key={trait} className="bg-blue-700/30 rounded-lg p-2 text-center">
                  <div className="text-xs text-blue-300 capitalize">{trait}</div>
                  <div className="text-white">{value}</div>
                </div>
              ))}
          </div>

          <div className="flex gap-3">
            <Button className="bg-green-500 hover:bg-green-600 text-white">Add to Aquarium</Button>
            <Button variant="outline" className="border-blue-600 text-blue-200" onClick={resetBreeding}>
              Breed Again
            </Button>
          </div>
        </div>
      ) : isBreeding ? (
        <div className="p-6 flex flex-col items-center justify-center flex-1">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Breeding in Progress</h3>
            <p className="text-blue-200">Please wait while the fish are breeding...</p>
          </div>

          <div className="relative w-full h-40 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <img
                  src={breedingPair.father?.image || "/fish/unkown-fish.png"}
                  alt={breedingPair.father?.name || "Father Fish"}
                  className="w-20 h-20 object-contain absolute -left-12 animate-pulse"
                />
                <div className="w-16 h-16 rounded-full bg-pink-500/30 flex items-center justify-center z-10 relative">
                  <Heart className="h-8 w-8 text-pink-400 animate-pulse" />
                </div>
                <img
                  src={breedingPair.mother?.image || "/fish/unkown-fish.png"}
                  alt={breedingPair.mother?.name || "Mother Fish"}
                  className="w-20 h-20 object-contain absolute -right-12 animate-pulse"
                />
              </div>
            </div>
          </div>

          <div className="w-full mb-4">
            <div className="flex justify-between text-xs text-blue-300 mb-1">
              <span>Breeding Progress</span>
              <span>{breedingProgress}%</span>
            </div>
            <Progress
              value={breedingProgress}
              className="h-2 bg-blue-950/50"
              indicatorClassName="bg-gradient-to-r from-pink-400 to-purple-500"
            />
          </div>

          <div className="text-center text-blue-200 text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1 text-blue-300" />
            Estimated time: {Math.ceil((100 - breedingProgress) / 10)} seconds
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Father selection */}
            <div className="bg-blue-700/30 rounded-xl p-4 flex flex-col items-center">
              <h4 className="font-bold text-white mb-2">Father</h4>
              {breedingPair.father ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src={breedingPair.father.image || "/fish/unkown-fish.png"}
                      alt={breedingPair.father.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-bold text-white">{breedingPair.father.name}</div>
                  <div className="text-xs text-blue-200">
                    {breedingPair.father.rarity} • Gen {breedingPair.father.generation}
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-blue-600/50 rounded-lg flex flex-col items-center justify-center">
                  <Plus className="h-8 w-8 text-blue-400/50 mb-2" />
                  <span className="text-blue-300 text-sm">Select Father</span>
                </div>
              )}
            </div>

            {/* Mother selection */}
            <div className="bg-blue-700/30 rounded-xl p-4 flex flex-col items-center">
              <h4 className="font-bold text-white mb-2">Mother</h4>
              {breedingPair.mother ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src={breedingPair.mother.image || "/fish/unkown-fish.png"}
                      alt={breedingPair.mother.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-bold text-white">{breedingPair.mother.name}</div>
                  <div className="text-xs text-blue-200">
                    {breedingPair.mother.rarity} • Gen {breedingPair.mother.generation}
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-blue-600/50 rounded-lg flex flex-col items-center justify-center">
                  <Plus className="h-8 w-8 text-blue-400/50 mb-2" />
                  <span className="text-blue-300 text-sm">Select Mother</span>
                </div>
              )}
            </div>
          </div>

          {showCompatibilityWarning && (
            <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-100">Compatibility Warning</h4>
                <p className="text-orange-200 text-sm">
                  These fish may not be compatible for breeding. Try selecting different fish for better results.
                </p>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            disabled={!breedingPair.father || !breedingPair.mother}
            onClick={startBreeding}
          >
            <Heart className="h-4 w-4 mr-2" />
            Start Breeding
          </Button>
        </div>
      )}
    </div>
  )
}

