import { Rarity } from "@/data/mock-game";
import { SortOption } from "@/hooks/use-store-filters";
import { Filter, Search, Tag } from "lucide-react";
import { useState } from "react";

interface StoreSearchFiltersProps {
  rarityOptions: { value: Rarity | "all"; label: string }[];
  sortOptions: { value: SortOption; label: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRarity: Rarity | "all";
  setSelectedRarity: (rarity: Rarity | "all") => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export function StoreSearchFilters({
  rarityOptions,
  sortOptions,
  searchQuery,
  setSearchQuery,
  selectedRarity,
  setSelectedRarity,
  sortOption,
  setSortOption,
}: StoreSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="flex flex-col justify-center gap-3 px-5 mt-4 sm:flex-row">
      <div className="relative flex items-center flex-1">
        <Search
          className="absolute text-white transform -translate-y-1/2 left-3 top-1/2"
          size={16}
        />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full py-2.5 pb-2 pr-4 text-base text-blue-100 bg-blue-700 border rounded-md pl-8 placeholder:text-blue-100 border-blue-400/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2.5 pb-2 text-base font-light text-blue-100 bg-blue-700 border rounded-md border-blue-400/50"
            onClick={() => {
              setShowSort(false);
              setShowFilters(!showFilters);
            }}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>

          {showFilters && (
            <div className="absolute right-0 z-30 w-48 p-4 mt-2 text-blue-100 bg-blue-700 border rounded-md shadow-lg border-blue-400/50">
              <div className="mb-0">
                <h3 className="mb-2 font-medium">Rarity</h3>
                {rarityOptions.map((option) => (
                  <div key={option.value} className="mb-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={
                          selectedRarity.toLowerCase() ===
                          option.value.toLowerCase()
                        }
                        onChange={() => setSelectedRarity(option.value)}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2.5 pb-2 text-base font-light text-blue-100 bg-blue-700 border rounded-md border-blue-400/50"
            onClick={() => {
              setShowFilters(false);
              setShowSort(!showSort);
            }}
          >
            <Tag size={16} />
            <span>Sort</span>
          </button>

          {showSort && (
            <div className="absolute right-0 z-30 w-48 p-4 mt-2 text-blue-100 bg-blue-700 border rounded-md shadow-lg border-blue-400/50">
              {sortOptions.map((option) => (
                <div key={option.value} className="mb-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={sortOption === option.value}
                      onChange={() => setSortOption(option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
