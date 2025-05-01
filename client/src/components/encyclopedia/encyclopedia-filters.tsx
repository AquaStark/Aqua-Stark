"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { EncyclopediaFilters as EncyclopediaFiltersState } from "@/hooks/use-encyclopedia"

interface EncyclopediaFiltersProps {
  showFilters: boolean;
  filters: EncyclopediaFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<EncyclopediaFiltersState>>;
  resetFilters: () => void;
}

const filterCategories = {
  rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
  habitat: ["Freshwater", "Saltwater", "Brackish", "Deep Sea", "Tropical"],
  diet: ["Carnivore", "Herbivore", "Omnivore"],
  temperament: ["Peaceful", "Semi-aggressive", "Aggressive"],
  careLevel: ["Easy", "Moderate", "Difficult", "Expert"],
  discoveryStatus: ["All", "Discovered", "Undiscovered"],
}

export default function EncyclopediaFilters({
  showFilters,
  filters,
  setFilters,
  resetFilters,
}: EncyclopediaFiltersProps) {
  const handleFilterChange = (category: keyof typeof filterCategories, value: string) => {
    if (category === "discoveryStatus") {
      setFilters({
        ...filters,
        discovered: value as EncyclopediaFiltersState['discovered'],
      })
    } else {
      const currentCategoryFilters = filters[category] as string[];
      if (currentCategoryFilters.includes(value)) {
        setFilters({
          ...filters,
          [category]: currentCategoryFilters.filter((item) => item !== value),
        })
      } else {
        setFilters({
          ...filters,
          [category]: [...currentCategoryFilters, value],
        })
      }
    }
  }

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(filterCategories).map(([category, options]) => (
              <div key={category} className="flex flex-col gap-2">
                <h4 className="font-bold text-white capitalize">
                  {category === 'discoveryStatus' ? 'Discovery Status' : category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className={cn(
                    "grid gap-2",
                    options.length > 4 ? "grid-cols-3" : options.length > 2 ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                )}>
                  {options.map((option) => {
                    const isSelected = Array.isArray(filters[category as keyof Omit<EncyclopediaFiltersState, 'search' | 'sort'>])
                      ? (filters[category as keyof Omit<EncyclopediaFiltersState, 'search' | 'sort'>] as string[]).includes(option)
                      : filters[category as keyof Omit<EncyclopediaFiltersState, 'search' | 'sort'>] === option;

                    return (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border transition-all duration-200",
                          isSelected
                            ? "bg-blue-600/50 border-blue-400/50 text-white hover:bg-blue-600/70 hover:text-white"
                            : "bg-blue-800/20 border-blue-600/50 text-gray-100 hover:bg-blue-700/60  font-medium hover:bg-white",
                          category === 'discoveryStatus' && 'col-span-1'
                        )}
                        onClick={() => handleFilterChange(category as keyof typeof filterCategories, option)}
                      >
                        {option}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              className="border-blue-600/50 text-gray-900 hover:bg-blue-700/50 hover:text-white"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}