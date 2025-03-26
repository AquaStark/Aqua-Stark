"use cleint"
import { fishData } from "@/data/mock-fish-encyclopedia"
import { Check, ChevronDown, FilterIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { FilterCategory, FilterOptions } from "./types"


type Props = {
    filters: FilterOptions,
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>
}
export function Filter({ filters, setFilters }: Props) {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

    // Refs for dropdown positioning and click outside handling
    const filterDropdownRef = useRef<HTMLDivElement>(null);
    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setIsFilterDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    const filterOptions = useMemo(() => {
        const options: FilterOptions = {
            habitat: [],
            diet: [],
            temperament: [],
            careLevel: [],
        }

        fishData.forEach((fish) => {
            if (fish.unlocked) {
                if (fish.habitat && !options.habitat.includes(fish.habitat)) {
                    options.habitat.push(fish.habitat)
                }
                if (fish.diet && !options.diet.includes(fish.diet)) {
                    options.diet.push(fish.diet)
                }
                if (fish.temperament && !options.temperament.includes(fish.temperament)) {
                    options.temperament.push(fish.temperament)
                }
                if (fish.careLevel && !options.careLevel.includes(fish.careLevel)) {
                    options.careLevel.push(fish.careLevel)
                }
            }
        })

        return options
    }, [])

    // Count active filters
    const activeFilterCount = useMemo(() => {
        return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0)
    }, [filters])

    // Handle filter changes
    const handleFilterChange = (category: FilterCategory, value: string) => {
        setFilters((prev) => {
            const newFilters = { ...prev }
            if (newFilters[category].includes(value)) {
                newFilters[category] = newFilters[category].filter((item) => item !== value)
            } else {
                newFilters[category] = [...newFilters[category], value]
            }
            return newFilters
        })
    }

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            habitat: [],
            diet: [],
            temperament: [],
            careLevel: [],
        })
    }

    // Clear a specific filter category
    const clearFilterCategory = (category: FilterCategory) => {
        setFilters((prev) => ({
            ...prev,
            [category]: [],
        }))
    }

    return (
        <div className="relative" ref={filterDropdownRef}>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white hover:bg-blue-800 transition-colors"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
                <FilterIcon size={18} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-xs font-medium">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isFilterDropdownOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isFilterDropdownOpen && (
                <div className="absolute z-50 mt-2 w-80 rounded-md shadow-lg bg-blue-900 border border-blue-700 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-white">Filter Fish</h3>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="text-sm text-blue-300 hover:text-white">
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Habitat Filter */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-200">Habitat</h4>
                                {filters.habitat.length > 0 && (
                                    <button
                                        onClick={() => clearFilterCategory("habitat")}
                                        className="text-xs text-blue-300 hover:text-white"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {filterOptions.habitat.map((habitat) => (
                                    <div key={habitat} className="flex items-center space-x-2">
                                        <div
                                            className={`w-4 h-4 rounded border ${filters.habitat.includes(habitat)
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-blue-400 bg-transparent"
                                                } flex items-center justify-center cursor-pointer`}
                                            onClick={() => handleFilterChange("habitat", habitat)}
                                        >
                                            {filters.habitat.includes(habitat) && <Check size={12} className="text-white" />}
                                        </div>
                                        <label
                                            className="text-sm text-white cursor-pointer"
                                            onClick={() => handleFilterChange("habitat", habitat)}
                                        >
                                            {habitat}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-blue-700 my-3"></div>

                        {/* Diet Filter */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-200">Diet</h4>
                                {filters.diet.length > 0 && (
                                    <button
                                        onClick={() => clearFilterCategory("diet")}
                                        className="text-xs text-blue-300 hover:text-white"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {filterOptions.diet.map((diet) => (
                                    <div key={diet} className="flex items-center space-x-2">
                                        <div
                                            className={`w-4 h-4 rounded border ${filters.diet.includes(diet)
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-blue-400 bg-transparent"
                                                } flex items-center justify-center cursor-pointer`}
                                            onClick={() => handleFilterChange("diet", diet)}
                                        >
                                            {filters.diet.includes(diet) && <Check size={12} className="text-white" />}
                                        </div>
                                        <label
                                            className="text-sm text-white cursor-pointer"
                                            onClick={() => handleFilterChange("diet", diet)}
                                        >
                                            {diet}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-blue-700 my-3"></div>

                        {/* Temperament Filter */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-200">Temperament</h4>
                                {filters.temperament.length > 0 && (
                                    <button
                                        onClick={() => clearFilterCategory("temperament")}
                                        className="text-xs text-blue-300 hover:text-white"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {filterOptions.temperament.map((temperament) => (
                                    <div key={temperament} className="flex items-center space-x-2">
                                        <div
                                            className={`w-4 h-4 rounded border ${filters.temperament.includes(temperament)
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-blue-400 bg-transparent"
                                                } flex items-center justify-center cursor-pointer`}
                                            onClick={() => handleFilterChange("temperament", temperament)}
                                        >
                                            {filters.temperament.includes(temperament) && <Check size={12} className="text-white" />}
                                        </div>
                                        <label
                                            className="text-sm text-white cursor-pointer"
                                            onClick={() => handleFilterChange("temperament", temperament)}
                                        >
                                            {temperament}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-blue-700 my-3"></div>

                        {/* Care Level Filter */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-200">Care Level</h4>
                                {filters.careLevel.length > 0 && (
                                    <button
                                        onClick={() => clearFilterCategory("careLevel")}
                                        className="text-xs text-blue-300 hover:text-white"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {filterOptions.careLevel.map((careLevel) => (
                                    <div key={careLevel} className="flex items-center space-x-2">
                                        <div
                                            className={`w-4 h-4 rounded border ${filters.careLevel.includes(careLevel)
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-blue-400 bg-transparent"
                                                } flex items-center justify-center cursor-pointer`}
                                            onClick={() => handleFilterChange("careLevel", careLevel)}
                                        >
                                            {filters.careLevel.includes(careLevel) && <Check size={12} className="text-white" />}
                                        </div>
                                        <label
                                            className="text-sm text-white cursor-pointer"
                                            onClick={() => handleFilterChange("careLevel", careLevel)}
                                        >
                                            {careLevel}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}