"use client"
import { ArrowUpDown, Check, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SortOption } from "./types"


type Props = {
    sort: SortOption,
    setSort: React.Dispatch<React.SetStateAction<SortOption>>
}
export function Sort({ sort, setSort }: Props) {
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

    // Refs for dropdown positioning and click outside handling
    const sortDropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setIsSortDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    const getSortOptionText = (option: SortOption) => {
        switch (option) {
            case "name-asc":
                return "Name (A-Z)"
            case "name-desc":
                return "Name (Z-A)"
            case "rarity":
                return "Rarity"
            case "newest":
                return "Newest"
            default:
                return "Name (A-Z)"
        }
    }
    return (
        <div className="relative" ref={sortDropdownRef}>
            <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-900/50 border border-blue-700 rounded-md text-white hover:bg-blue-800 transition-colors"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
                <ArrowUpDown size={18} className="mr-1" />
                <span>Sort by: {getSortOptionText(sort)}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isSortDropdownOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isSortDropdownOpen && (
                <div className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-blue-900 border border-blue-700 overflow-hidden">
                    <div className="py-1">
                        {[
                            { value: "name-asc", label: "Name (A-Z)" },
                            { value: "name-desc", label: "Name (Z-A)" },
                            { value: "rarity", label: "Rarity" },
                            { value: "newest", label: "Newest" },
                        ].map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-2 text-sm cursor-pointer flex items-center ${sort === option.value ? "bg-blue-800 text-white" : "text-white hover:bg-blue-800"
                                    }`}
                                onClick={() => {
                                    setSort(option.value as SortOption)
                                    setIsSortDropdownOpen(false)
                                }}
                            >
                                {sort === option.value && <Check size={16} className="mr-2" />}
                                <span className={sort === option.value ? "ml-0" : "ml-6"}>{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}