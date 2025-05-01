"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { FishTank } from "@/components/fish-tank"
import { breedingResults } from "@/data/fish-data"
import { fishCollection } from "@/data/fish-data"

export function DiscoveriesTab() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Breeding Discoveries</h2>
        <div className="flex gap-2">
          <div className="relative w-64 hidden md:block">
            <Input
              type="text"
              placeholder="Search discoveries..."
              className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300/70 pr-8"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
          </div>
          <Button variant="outline" className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/70">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Discovery statistics */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-700/30 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-300">Total Discoveries</div>
            <div className="text-2xl font-bold text-white">{breedingResults.length}</div>
          </div>
          <div className="bg-blue-700/30 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-300">Rare+ Discoveries</div>
            <div className="text-2xl font-bold text-white">
              {
                breedingResults.filter((r) => r.rarity === "Rare" || r.rarity === "Epic" || r.rarity === "Legendary")
                  .length
              }
            </div>
          </div>
          <div className="bg-blue-700/30 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-300">Special Traits</div>
            <div className="text-2xl font-bold text-white">
              {breedingResults.filter((r) => r.traits.special).length}
            </div>
          </div>
          <div className="bg-blue-700/30 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-300">Completion</div>
            <div className="text-2xl font-bold text-white">15%</div>
          </div>
        </div>
      </div>

      {/* Discovery registry */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Discovery Registry</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breedingResults.map((result) => (
              <DiscoveryCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      </div>

      {/* Undiscovered species */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Undiscovered Species</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((index) => (
              <UndiscoveredCard key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function DiscoveryCard({ result }) {
  return (
    <div
      className="bg-blue-700/30 rounded-lg overflow-hidden"
      style={{ transform: "scale(1)", transition: "transform 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div className="relative h-40 bg-blue-800/50">
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto">
            <img src={result.image || "/fish/unkown-fish.png"} alt={result.name} className="w-24 h-24 object-contain" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-blue-900/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-blue-100">
          Discovered: {result.discovered}
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-white">{result.name}</h4>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              result.rarity === "Common"
                ? "bg-gray-500/50 text-gray-100"
                : result.rarity === "Uncommon"
                  ? "bg-green-500/50 text-green-100"
                  : result.rarity === "Rare"
                    ? "bg-blue-500/50 text-blue-100"
                    : result.rarity === "Epic"
                      ? "bg-purple-500/50 text-purple-100"
                      : "bg-amber-500/50 text-amber-100",
            )}
          >
            {result.rarity}
          </span>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs">
            <span className="text-blue-300 w-16">Parents:</span>
            <span className="text-white">
              {fishCollection.find((f) => f.id === result.parents.father)?.name || "Unknown"} ×{" "}
              {fishCollection.find((f) => f.id === result.parents.mother)?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center text-xs">
            <span className="text-blue-300 w-16">Traits:</span>
            <span className="text-white">
              {Object.values(result.traits)
                .filter((t) => t !== undefined)
                .join(", ")}
            </span>
          </div>
        </div>

        <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
          View Details
        </Button>
      </div>
    </div>
  )
}

function UndiscoveredCard({ index }) {
  return (
    <div className="bg-blue-700/30 rounded-lg overflow-hidden">
      <div className="h-40 bg-blue-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-700/50 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="h-8 w-8 text-blue-400/70" />
          </div>
          <div className="text-blue-200">Undiscovered Species</div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-white">???</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/50 text-blue-100">Unknown</span>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs">
            <span className="text-blue-300 w-16">Hint:</span>
            <span className="text-white">
              {index === 1
                ? "Try breeding fish with special traits"
                : index === 2
                  ? "Mix different color patterns"
                  : "Combine rare species"}
            </span>
          </div>
        </div>

        <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white">
          Research
        </Button>
      </div>
    </div>
  )
}

