"use client";

import { useState, useMemo } from "react";
import { type Rarity, type ItemType } from "@/data/mock-game";
import { fishData } from "@/data/mock-game";
import { decorationItems, miscItems } from "@/data/mock-store";
import { foodData } from "@/data/market-data";
import { useDebounce } from "./use-debounce";
// import { Category } from "@/types/help-types";
import { FilterCategory } from "@/components/store/filter-panel";

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

// Define the PriceRange type that's expected by FilterPanel
type PriceRange = [number, number];

interface UseStoreFiltersProps {
  initialTab?: ItemType;
}

// Define types for sort state
interface SortState {
  field: "price" | "popularity" | "newest";
  direction: "asc" | "desc";
}

// Define types for filter state
interface FilterState {
  priceRange: PriceRange;
  categories: FilterCategory[];
  onSale: boolean;
}

export function useStoreFilters({ initialTab }: UseStoreFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    categories: [],
    onSale: false,
  });

  const [sort, setSort] = useState<SortState>({
    field: "price",
    direction: "asc",
  });

  const [selectedTab, setSelectedTab] = useState<ItemType>(
    initialTab || "fish"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("price-asc");

  const updatePriceRange = (range: PriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  const updateCategories = (categories: FilterCategory[]) => {
    setFilters((prev) => ({ ...prev, categories }));
  };

  const toggleOnSale = () => {
    setFilters((prev) => ({ ...prev, onSale: !prev.onSale }));
  };

  const updateSort = (
    field: SortState["field"],
    direction: SortState["direction"]
  ) => {
    setSort({ field, direction });
  };

  const selectedData = useMemo(() => {
    switch (selectedTab) {
      case "fish":
        return fishData;
      case "food":
        // In a real implementation, these would come from their own data files
        return foodData;
        return [];
      case "decorations":
        return decorationItems;
      case "others":
        return miscItems;
      default:
        return fishData;
    }
  }, [selectedTab]);

  // Apply search filter
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return selectedData;
    const query = searchQuery.toLowerCase();
    return selectedData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [selectedData, searchQuery]);

  // Apply rarity filter
  const filteredItems = useMemo(() => {
    if (selectedRarity === "all") return searchedItems;
    return searchedItems.filter(
      (item) => item.rarity.toLowerCase() === selectedRarity.toLowerCase()
    );
  }, [searchedItems, selectedRarity]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;

      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [filteredItems, sortOption]);

  return {
    filters,
    sort,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    updatePriceRange,
    updateCategories,
    toggleOnSale,
    updateSort,
    filteredItems: sortedItems,
    selectedTab,
    setSelectedTab,
    selectedRarity,
    setSelectedRarity,
    sortOption,
    setSortOption,
  };
}
