"use client";

import { useState, useMemo } from "react";
import { type Rarity, type ItemType } from "@/data/mock-game";
import { fishData } from "@/data/mock-game";
import { decorationItems, miscItems } from "@/data/mock-store";

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface UseStoreFiltersProps {
  initialTab?: ItemType;
}

export function useStoreFilters({ initialTab }: UseStoreFiltersProps) {
  const [selectedTab, setSelectedTab] = useState<ItemType>(
    initialTab || "fish"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<Rarity | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("price-asc");

  const selectedData = useMemo(() => {
    switch (selectedTab) {
      case "fish":
        return fishData;
      case "food":
        // In a real implementation, these would come from their own data files
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
    filteredItems: sortedItems,
    selectedTab,
    setSelectedTab,
    searchQuery,
    setSearchQuery,
    selectedRarity,
    setSelectedRarity,
    sortOption,
    setSortOption,
  };
}
