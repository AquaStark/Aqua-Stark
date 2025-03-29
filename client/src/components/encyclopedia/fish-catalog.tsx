import { fishData, type Fish } from "@/data/mock-fish-encyclopedia";
import { Bookmark, X } from "lucide-react"
import { useMemo, useState } from "react";
import FishModal from "./fish-modal";
import { FilterCategory, FilterOptions, SortOption } from "./types";



type Props = {
    query: string;
    filters: FilterOptions;
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
    sortBy: SortOption

}

export function FishCatalog({ query, filters, setFilters, sortBy }: Props) {
    const filteredFish = useMemo(() => {
        return fishData
            .filter((fish) => {
                // Search filter
                if (
                    query &&
                    !fish.name.toLowerCase().includes(query.toLowerCase()) &&
                    !fish.scientificName.toLowerCase().includes(query.toLowerCase())
                ) {
                    return false
                }

                // Skip other filters for locked fish
                if (!fish.unlocked) return true

                // Apply category filters
                if (filters.habitat.length > 0 && !filters.habitat.includes(fish.habitat || "")) {
                    return false
                }
                if (filters.diet.length > 0 && !filters.diet.includes(fish.diet || "")) {
                    return false
                }
                if (filters.temperament.length > 0 && !filters.temperament.includes(fish.temperament || "")) {
                    return false
                }
                if (filters.careLevel.length > 0 && !filters.careLevel.includes(fish.careLevel || "")) {
                    return false
                }

                return true
            })
            .sort((a, b) => {
                // Handle locked fish
                if (!a.unlocked && !b.unlocked) return 0
                if (!a.unlocked) return 1
                if (!b.unlocked) return -1

                // Apply sorting
                switch (sortBy) {
                    case "name-asc":
                        return a.name.localeCompare(b.name)
                    case "name-desc":
                        return b.name.localeCompare(a.name)
                    case "rarity":
                        const rarityOrder = { new: 0, rare: 1, common: 2, undefined: 3 }
                        return (
                            (rarityOrder[a.rarity as keyof typeof rarityOrder] || 3) -
                            (rarityOrder[b.rarity as keyof typeof rarityOrder] || 3)
                        )
                    case "newest":
                        // This would ideally use a date field, but we'll simulate with the id for now
                        return b.id.localeCompare(a.id)
                    default:
                        return a.name.localeCompare(b.name)
                }
            })
    }, [query, filters, sortBy]);

    const activeFilterCount = useMemo(() => {
        return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0)
    }, [filters])


    const clearFilters = () => {
        setFilters({
            habitat: [],
            diet: [],
            temperament: [],
            careLevel: [],
        })
    }

    const removeFilter = (category: FilterCategory, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].filter((item) => item !== value),
        }))
    }
    return (
        <div>
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(filters).map(([category, values]) =>
                        values.map((value) => (
                            <div
                                key={`${category}-${value}`}
                                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700 hover:bg-blue-600 text-sm text-white"
                            >
                                {value}
                                <button
                                    className="ml-1.5 hover:text-blue-300"
                                    onClick={() => removeFilter(category as FilterCategory, value)}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )),
                    )}
                    <button onClick={clearFilters} className="text-xs text-blue-300 hover:text-white px-2 py-1">
                        Clear All
                    </button>
                </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm text-blue-300">
                Showing {filteredFish.length} {filteredFish.length === 1 ? "fish" : "fishes"}
            </div>
            {
                filteredFish.length > 1 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFish.map((fish) => (
                        <FishCard key={fish.id} fish={fish} />
                    ))}
                </div>) : (
                    <div className="bg-blue-900/50 rounded-lg p-8 text-center">
                        <div className="text-lg font-medium mb-2">No fish found</div>
                        <p className="text-blue-300">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )
            }
        </div>
    )
}



interface FishCardProps {
    fish: Fish
}

export default function FishCard({ fish }: FishCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        if (fish.unlocked) {
            setIsModalOpen(true)
        }
    }

    return (
        <>
            <div
                className={`bg-blue-900 rounded-lg overflow-hidden ${fish.unlocked ? "cursor-pointer hover:bg-blue-800 hover:scale-[1.03] transition-all" : ""}`}
                onClick={openModal}
            >
                <div className="relative">
                    <div className="aspect-video bg-blue-950 flex items-center justify-center">
                        {fish.unlocked ? (
                            <div className="relative w-32 h-32 rounded-full bg-blue-800/50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={fish.image || "/placeholder.svg?height=128&width=128"}
                                    alt={fish.name}

                                    className="object-contain"
                                />
                                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30"></div>
                            </div>
                        ) : (
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Bookmark size={32} className="text-blue-400/50" />
                            </div>
                        )}
                    </div>
                    {fish.rarity && (
                        <div
                            className={`absolute top-2 right-2  px-2 py-1 rounded text-xs font-medium ${fish.rarity === "common"
                                ? "bg-green-500"
                                : fish.rarity === "rare"
                                    ? "bg-purple-500"
                                    : fish.rarity === "new"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                }`}
                        >
                            {fish.rarity.charAt(0).toUpperCase() + fish.rarity.slice(1)}
                        </div>
                    )}
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-800/50 rounded-full flex items-center justify-center">
                        <Bookmark size={16} className="text-blue-300" />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold">{fish.unlocked ? fish.name : "Unknown Species"}</h3>
                    <p className="text-sm text-blue-300">
                        {fish.unlocked ? fish.scientificName : "Discover this fish to learn more"}
                    </p>

                    {fish.unlocked && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {fish.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded bg-blue-800/50 text-blue-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FishModal fish={fish} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

