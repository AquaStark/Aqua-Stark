"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Plus, Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { FishSelection } from "@/components/laboratory/fish-selection"
import { BreedingTank } from "@/components/laboratory/breeding-tank"
import { FishDetails } from "@/components/laboratory/fish-details"
import type { Fish } from "@/types/fish"
import { breedingResults } from "@/data/fish-data"
import { cn } from "@/lib/utils"

interface BreedingTabProps {
  filteredFish: Fish[]
}

interface FilterOptions {
  search: string
  rarity: string[]
  species: string[]
  traits: {
    color: string[]
    pattern: string[]
    fins: string[]
    size: string[]
  }
}

export function BreedingTab({ filteredFish }: BreedingTabProps) {
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null)
  const [breedingPair, setBreedingPair] = useState({
    father: null,
    mother: null,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilterTab, setActiveFilterTab] = useState<'rarity' | 'color' | 'pattern' | 'fins'>('rarity')
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    rarity: [],
    species: [],
    traits: {
      color: [],
      pattern: [],
      fins: [],
      size: []
    }
  })
  const [displayedFish, setDisplayedFish] = useState<Fish[]>(filteredFish)

  // Handle fish selection for breeding
  const selectFishForBreeding = (fish: Fish, role: "father" | "mother") => {
    // Check if fish is on cooldown
    if (fish.breedingCooldown && fish.breedingCooldown !== "Ready") {
      return // Fish is on cooldown
    }

    setBreedingPair((prev) => ({
      ...prev,
      [role]: fish,
    }))
  }

  // Reset breeding process
  const resetBreeding = () => {
    setBreedingPair({ father: null, mother: null })
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      rarity: [],
      species: [],
      traits: {
        color: [],
        pattern: [],
        fins: [],
        size: []
      }
    })
  }

  // Handle filter change
  const toggleFilter = (filterType: keyof Omit<FilterOptions, 'search' | 'traits'>, value: string) => {
    setFilters(prev => {
      const current = prev[filterType] as string[];
      return {
        ...prev,
        [filterType]: current.includes(value)
          ? current.filter(item => item !== value)
          : [...current, value]
      };
    });
  }

  // Handle trait filter change
  const toggleTraitFilter = (traitType: keyof FilterOptions['traits'], value: string) => {
    setFilters(prev => {
      const current = prev.traits[traitType];
      return {
        ...prev,
        traits: {
          ...prev.traits,
          [traitType]: current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value]
        }
      };
    });
  }

  // Apply filters to fish
  useEffect(() => {
    let result = filteredFish;
    
    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(fish => 
        fish.name.toLowerCase().includes(searchLower) || 
        fish.id.toString().includes(searchLower)
      );
    }
    
    // Filter by rarity
    if (filters.rarity.length > 0) {
      result = result.filter(fish => filters.rarity.includes(fish.rarity));
    }
    
    // Filter by traits
    const { color, pattern, fins, size } = filters.traits;
    
    if (color.length > 0) {
      result = result.filter(fish => color.includes(fish.traits.color));
    }
    
    if (pattern.length > 0) {
      result = result.filter(fish => pattern.includes(fish.traits.pattern));
    }
    
    if (fins.length > 0) {
      result = result.filter(fish => fins.includes(fish.traits.fins));
    }
    
    if (size.length > 0) {
      result = result.filter(fish => size.includes(fish.traits.size));
    }
    
    setDisplayedFish(result);
  }, [filters, filteredFish]);

  // Count active filters
  const activeFilterCount = [
    ...filters.rarity,
    ...filters.traits.color,
    ...filters.traits.pattern,
    ...filters.traits.fins,
    ...filters.traits.size
  ].length;

  // Get filter summary text
  const getFilterSummary = () => {
    const categories = [];
    if (filters.rarity.length > 0) categories.push(`${filters.rarity.length} rarities`);
    if (filters.traits.color.length > 0) categories.push(`${filters.traits.color.length} colors`);
    if (filters.traits.pattern.length > 0) categories.push(`${filters.traits.pattern.length} patterns`);
    if (filters.traits.fins.length > 0) categories.push(`${filters.traits.fins.length} fins`);
    
    return categories.length > 0 
      ? categories.join(", ") 
      : "";
  };

  return (
    <div className="w-full min-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-0">
        <h2 className="text-xl font-bold text-white">Breeding Laboratory</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className={cn(
              "bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/70 hover:text-white transition-all duration-200",
              showFilters && "bg-blue-700/70 shadow-md shadow-blue-900/50",
              "flex-1 sm:flex-none"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 inline-flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </span>
            )}
            {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-blue-900 transition-colors duration-200 shadow-md shadow-blue-900/30 flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            New Tank
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mt-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
          <Input
            placeholder="Search by fish name or ID..."
            className="bg-blue-700/40 border-blue-600/40 text-white placeholder:text-blue-300/70 pl-10 pr-4 focus:border-blue-500/70 focus:bg-blue-700/50 transition-all duration-200 shadow-md shadow-blue-900/20"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        {showFilters && (
          <div className="mt-4 bg-gradient-to-b from-blue-800/60 to-blue-800/40 backdrop-blur-sm rounded-xl border border-blue-700/50 shadow-lg p-3 animate-fade-in animate-duration-300 max-w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1 -mx-1 px-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "py-1.5 px-3 h-auto border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    activeFilterTab === 'rarity' 
                      ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/80 text-white font-medium shadow-md shadow-blue-900/30"
                      : "bg-blue-800/30 hover:bg-blue-700/50 border-blue-700/50 text-blue-200"
                  )}
                  onClick={() => setActiveFilterTab('rarity')}
                >
                  Rarity
                  {filters.rarity.length > 0 && (
                    <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {filters.rarity.length}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "py-1.5 px-3 h-auto border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    activeFilterTab === 'color' 
                      ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/80 text-white font-medium shadow-md shadow-blue-900/30"
                      : "bg-blue-800/30 hover:bg-blue-700/50 border-blue-700/50 text-blue-200"
                  )}
                  onClick={() => setActiveFilterTab('color')}
                >
                  Color
                  {filters.traits.color.length > 0 && (
                    <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {filters.traits.color.length}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "py-1.5 px-3 h-auto border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    activeFilterTab === 'pattern' 
                      ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/80 text-white font-medium shadow-md shadow-blue-900/30"
                      : "bg-blue-800/30 hover:bg-blue-700/50 border-blue-700/50 text-blue-200"
                  )}
                  onClick={() => setActiveFilterTab('pattern')}
                >
                  Pattern
                  {filters.traits.pattern.length > 0 && (
                    <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {filters.traits.pattern.length}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "py-1.5 px-3 h-auto border transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    activeFilterTab === 'fins' 
                      ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/80 text-white font-medium shadow-md shadow-blue-900/30"
                      : "bg-blue-800/30 hover:bg-blue-700/50 border-blue-700/50 text-blue-200"
                  )}
                  onClick={() => setActiveFilterTab('fins')}
                >
                  Fins
                  {filters.traits.fins.length > 0 && (
                    <span className="ml-1.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {filters.traits.fins.length}
                    </span>
                  )}
                </Button>
              </div>
              
              {activeFilterCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-700/30 hover:bg-blue-600/50 border-blue-600/50 text-white py-1 h-auto transition-colors duration-200 whitespace-nowrap w-full sm:w-auto mt-1 sm:mt-0"
                  onClick={resetFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            
            {activeFilterCount > 0 && (
              <div className="mb-3 text-sm text-blue-300/90 px-1 line-clamp-1 overflow-hidden text-ellipsis">
                Filtering by: {getFilterSummary()}
              </div>
            )}
            
            <div className="bg-blue-900/20 rounded-lg border border-blue-800/50 p-3 overflow-hidden">
              {activeFilterTab === 'rarity' && (
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {["Common", "Uncommon", "Rare", "Epic", "Legendary"].map((rarity) => (
                    <Button
                      key={rarity}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border py-1 px-3 transition-all duration-200 relative overflow-hidden text-xs sm:text-sm whitespace-nowrap",
                        filters.rarity.includes(rarity)
                          ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/70 text-white shadow-sm ring-1 ring-white/10"
                          : "bg-blue-800/30 hover:bg-blue-700/40 border-blue-700/50 text-blue-100"
                      )}
                      onClick={() => toggleFilter("rarity", rarity)}
                    >
                      {filters.rarity.includes(rarity) && (
                        <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 opacity-80"></span>
                      )}
                      {rarity}
                    </Button>
                  ))}
                </div>
              )}
              
              {activeFilterTab === 'color' && (
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {["Blue", "Red", "Green", "Gold", "Silver", "Black"].map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border py-1 px-3 transition-all duration-200 relative overflow-hidden text-xs sm:text-sm whitespace-nowrap",
                        filters.traits.color.includes(color)
                          ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/70 text-white shadow-sm ring-1 ring-white/10"
                          : "bg-blue-800/30 hover:bg-blue-700/40 border-blue-700/50 text-blue-100"
                      )}
                      onClick={() => toggleTraitFilter("color", color)}
                    >
                      {filters.traits.color.includes(color) && (
                        <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 opacity-80"></span>
                      )}
                      {color}
                    </Button>
                  ))}
                </div>
              )}
              
              {activeFilterTab === 'pattern' && (
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {["Solid", "Spotted", "Striped", "Gradient", "Marbled"].map((pattern) => (
                    <Button
                      key={pattern}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border py-1 px-3 transition-all duration-200 relative overflow-hidden text-xs sm:text-sm whitespace-nowrap",
                        filters.traits.pattern.includes(pattern)
                          ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/70 text-white shadow-sm ring-1 ring-white/10"
                          : "bg-blue-800/30 hover:bg-blue-700/40 border-blue-700/50 text-blue-100"
                      )}
                      onClick={() => toggleTraitFilter("pattern", pattern)}
                    >
                      {filters.traits.pattern.includes(pattern) && (
                        <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 opacity-80"></span>
                      )}
                      {pattern}
                    </Button>
                  ))}
                </div>
              )}
              
              {activeFilterTab === 'fins' && (
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {["Long", "Short", "Flowing", "Spiky", "Rounded"].map((fins) => (
                    <Button
                      key={fins}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border py-1 px-3 transition-all duration-200 relative overflow-hidden text-xs sm:text-sm whitespace-nowrap",
                        filters.traits.fins.includes(fins)
                          ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-500/70 text-white shadow-sm ring-1 ring-white/10"
                          : "bg-blue-800/30 hover:bg-blue-700/40 border-blue-700/50 text-blue-100"
                      )}
                      onClick={() => toggleTraitFilter("fins", fins)}
                    >
                      {filters.traits.fins.includes(fins) && (
                        <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 opacity-80"></span>
                      )}
                      {fins}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Breeding interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[700px] lg:min-h-[700px] w-full">
        {/* Left column - Fish selection */}
        <div className="lg:h-full lg:min-h-full overflow-hidden flex flex-col mb-6 lg:mb-0">
          <FishSelection filteredFish={displayedFish} onSelectFish={setSelectedFish} />
        </div>

        {/* Middle column - Breeding tank */}
        <div className="lg:h-full lg:min-h-full overflow-hidden flex flex-col mb-6 lg:mb-0">
          <BreedingTank breedingPair={breedingPair} onReset={resetBreeding} breedingResults={breedingResults} />
        </div>

        {/* Right column - Fish details */}
        <div className="lg:h-full lg:min-h-full overflow-hidden flex flex-col">
          <FishDetails selectedFish={selectedFish} onSelectForBreeding={selectFishForBreeding} />
        </div>
      </div>
    </div>
  )
}

// Add this CSS to the head to fix scrollbar issues
if (typeof document !== 'undefined') {
  if (!document.getElementById('scrollbar-hide-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'scrollbar-hide-styles';
    styleTag.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      /* Custom animations to replace Tailwind animate to avoid layout shifts */
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
      .animate-duration-300 {
        animation-duration: 300ms;
      }
    `;
    document.head.appendChild(styleTag);
  }
}


