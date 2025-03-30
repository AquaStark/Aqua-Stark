"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMarketStore } from "@/store/market-store"

export function FilterPanel() {
  const { filters, setFilters, resetFilters } = useMarketStore()

  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-4 animate-in fade-in-50 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rarity filter */}
        <div>
          <h3 className="font-bold text-white mb-2">Rarity</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Common", "Uncommon", "Rare", "Epic", "Legendary"].map((rarity) => (
              <Button
                key={rarity}
                variant="outline"
                size="sm"
                className={cn(
                  "border-blue-600/50 text-blue-100",
                  filters.rarity.includes(rarity)
                    ? "bg-blue-700/70 border-blue-500/70"
                    : "bg-blue-800/30 hover:bg-blue-700/50",
                )}
                onClick={() => {
                  if (filters.rarity.includes(rarity)) {
                    setFilters({
                      rarity: filters.rarity.filter((r) => r !== rarity),
                    })
                  } else {
                    setFilters({
                      rarity: [...filters.rarity, rarity],
                    })
                  }
                }}
              >
                {rarity}
              </Button>
            ))}
          </div>
        </div>

        {/* Price range filter */}
        <div>
          <h3 className="font-bold text-white mb-2">Price Range</h3>
          <div className="px-2">
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={10000}
              step={100}
              onValueChange={(value) => {
                setFilters({
                  minPrice: value[0],
                  maxPrice: value[1],
                })
              }}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-blue-200">
              <span>{filters.minPrice} coins</span>
              <span>{filters.maxPrice} coins</span>
            </div>
          </div>
        </div>

        {/* Listing type filter */}
        <div>
          <h3 className="font-bold text-white mb-2">Listing Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "all", label: "All" },
              { value: "sale", label: "Buy Now" },
              { value: "auction", label: "Auctions" },
              { value: "exchange", label: "Exchange" },
            ].map((type) => (
              <Button
                key={type.value}
                variant="outline"
                size="sm"
                className={cn(
                  "border-blue-600/50 text-blue-100",
                  filters.listingType === type.value
                    ? "bg-blue-700/70 border-blue-500/70"
                    : "bg-blue-800/30 hover:bg-blue-700/50",
                )}
                onClick={() => {
                  setFilters({
                    listingType: type.value as any,
                  })
                }}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Traits filter */}
        <div>
          <h3 className="font-bold text-white mb-2">Traits</h3>
          <div className="grid grid-cols-2 gap-2">
            {["Blue", "Red", "Green", "Gold", "Spotted", "Striped", "Long", "Bioluminescent"].map((trait) => (
              <Button
                key={trait}
                variant="outline"
                size="sm"
                className={cn(
                  "border-blue-600/50 text-blue-100",
                  filters.traits.includes(trait)
                    ? "bg-blue-700/70 border-blue-500/70"
                    : "bg-blue-800/30 hover:bg-blue-700/50",
                )}
                onClick={() => {
                  if (filters.traits.includes(trait)) {
                    setFilters({
                      traits: filters.traits.filter((t) => t !== trait),
                    })
                  } else {
                    setFilters({
                      traits: [...filters.traits, trait],
                    })
                  }
                }}
              >
                {trait}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort options */}
        <div>
          <h3 className="font-bold text-white mb-2">Sort By</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "newest", label: "Newest" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "rarity", label: "Rarity" },
              { value: "level", label: "Level" },
            ].map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                className={cn(
                  "border-blue-600/50 text-blue-100",
                  filters.sort === option.value
                    ? "bg-blue-700/70 border-blue-500/70"
                    : "bg-blue-800/30 hover:bg-blue-700/50",
                )}
                onClick={() => {
                  setFilters({
                    sort: option.value as any,
                  })
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Reset filters */}
        <div className="flex items-end">
          <Button
            variant="outline"
            className="border-blue-600/50 text-blue-100 hover:bg-blue-700/50"
            onClick={resetFilters}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

