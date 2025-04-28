"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Fish } from "@/types/fish";

interface FishSelectionProps {
  filteredFish: Fish[];
  onSelectFish: (fish: Fish) => void;
}

export function FishSelection({
  filteredFish,
  onSelectFish,
}: FishSelectionProps) {
  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
      <div className="p-4 border-b border-blue-700/50">
        <h3 className="font-bold text-white">Select Fish for Breeding</h3>
      </div>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {filteredFish.map((fish) => (
            <motion.div
              key={fish.id}
              className="bg-blue-700/30 rounded-lg p-3 flex items-center cursor-pointer hover:bg-blue-700/50 transition-colors"
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectFish(fish)}
            >
              <div className="relative w-16 h-16 mr-3 flex-shrink-0">
                <img
                  src={fish.image || "/placeholder.svg"}
                  alt={fish.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{fish.name}</h4>
                    <div className="flex items-center mt-1">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          fish.rarity === "Common"
                            ? "bg-gray-500/50 text-gray-100"
                            : fish.rarity === "Uncommon"
                              ? "bg-green-500/50 text-green-100"
                              : fish.rarity === "Rare"
                                ? "bg-blue-500/50 text-blue-100"
                                : fish.rarity === "Epic"
                                  ? "bg-purple-500/50 text-purple-100"
                                  : "bg-amber-500/50 text-amber-100",
                        )}
                      >
                        {fish.rarity}
                      </span>
                      <span className="text-blue-200 text-xs ml-2">
                        Gen {fish.generation}
                      </span>
                      <span className="text-blue-200 text-xs ml-2">
                        Lvl {fish.level}
                      </span>
                    </div>
                  </div>
                  {fish.breedingCooldown && (
                    <div
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        fish.breedingCooldown === "Ready"
                          ? "bg-green-500/30 text-green-100"
                          : "bg-orange-500/30 text-orange-100",
                      )}
                    >
                      {fish.breedingCooldown}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
