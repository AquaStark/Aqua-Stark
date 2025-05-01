"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FishTank } from "@/components/fish-tank"
import { FishIcon } from "lucide-react"
import type { Fish } from "@/types/fish"
import { fishCollection } from "@/data/fish-data"

interface FishDetailsProps {
  selectedFish: Fish | null
  onSelectForBreeding: (fish: Fish, role: "father" | "mother") => void
}

export function FishDetails({ selectedFish, onSelectForBreeding }: FishDetailsProps) {
  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden flex flex-col lg:h-full">
      <div className="p-4 border-b border-blue-700/50">
        <h3 className="font-bold text-white">Fish Details</h3>
      </div>
      {selectedFish ? (
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-32 h-32 mb-6">
              <FishTank className="h-36">
                <img
                  src={selectedFish.image || "/fish/unkown-fish.png"}
                  alt={selectedFish.name}
                  className="w-24 h-24 object-contain transform -translate-y-2"
                />
              </FishTank>
            </div>
            <h3 className="text-xl font-bold text-white">{selectedFish.name}</h3>
            <div className="flex items-center mt-1 flex-wrap justify-center">
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full m-0.5",
                  selectedFish.rarity === "Common"
                    ? "bg-gray-500/50 text-gray-100"
                    : selectedFish.rarity === "Uncommon"
                      ? "bg-green-500/50 text-green-100"
                      : selectedFish.rarity === "Rare"
                        ? "bg-blue-500/50 text-blue-100"
                        : selectedFish.rarity === "Epic"
                          ? "bg-purple-500/50 text-purple-100"
                          : "bg-amber-500/50 text-amber-100",
                )}
              >
                {selectedFish.rarity}
              </span>
              <span className="text-blue-200 text-xs m-0.5">Generation {selectedFish.generation}</span>
              <span className="text-blue-200 text-xs m-0.5">Level {selectedFish.level}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-bold text-white mb-2">Genetic Traits</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedFish.traits).map(([trait, value]) => (
                <div key={trait} className="bg-blue-700/30 rounded-lg p-2">
                  <div className="text-xs text-blue-300 capitalize">{trait}</div>
                  <div className="text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedFish.parents && (
            <div className="mb-4">
              <h4 className="font-bold text-white mb-2">Parentage</h4>
              <div className="bg-blue-700/30 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-blue-300">Father</div>
                    <div className="text-white">
                      {fishCollection.find((f) => f.id === selectedFish.parents?.father)?.name || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-300">Mother</div>
                    <div className="text-white">
                      {fishCollection.find((f) => f.id === selectedFish.parents?.mother)?.name || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => onSelectForBreeding(selectedFish, "father")}
              disabled={!!selectedFish.breedingCooldown && selectedFish.breedingCooldown !== "Ready"}
            >
              Select as Father
            </Button>
            <Button
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => onSelectForBreeding(selectedFish, "mother")}
              disabled={!!selectedFish.breedingCooldown && selectedFish.breedingCooldown !== "Ready"}
            >
              Select as Mother
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center flex-1 flex flex-col justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-700/30 flex items-center justify-center mx-auto mb-4">
            <FishIcon className="h-10 w-10 text-blue-400/70" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">No Fish Selected</h4>
          <p className="text-blue-200 text-sm">
            Select a fish from the list to view its details and use it for breeding.
          </p>
        </div>
      )}
    </div>
  )
}

