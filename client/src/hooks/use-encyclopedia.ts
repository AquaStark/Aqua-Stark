/**
 * @file use-encyclopedia.ts
 * @description Custom hook for managing the state and logic of a fish encyclopedia.
 * It handles filtering, sorting, and displaying fish species data.
 * @category Hooks
 */

import { useState } from 'react';
import { fishSpecies } from '@/data/encyclopedia-data';
import type { FishSpecies } from '@/data/encyclopedia-data';
import { useDebounce } from './use-debounce';

/**
 * @typedef {object} EncyclopediaFilters
 * @property {string} search - The search query string for filtering by name or scientific name.
 * @property {string[]} rarity - An array of rarity levels to filter by.
 * @property {string[]} habitat - An array of habitats to filter by.
 * @property {string[]} diet - An array of diets to filter by.
 * @property {string[]} temperament - An array of temperaments to filter by.
 * @property {string[]} careLevel - An array of care levels to filter by.
 * @property {'all' | 'discovered' | 'undiscovered'} discovered - The discovery status to filter by.
 * @property {'name' | 'rarity' | 'recent'} sort - The criteria for sorting the fish list.
 */
export interface EncyclopediaFilters {
  search: string;
  rarity: string[];
  habitat: string[];
  diet: string[];
  temperament: string[];
  careLevel: string[];
  discovered: 'all' | 'discovered' | 'undiscovered';
  sort: 'name' | 'rarity' | 'recent';
}

/**
 * @function useEncyclopedia
 * @description
 * A custom hook for managing the state and logic of an interactive encyclopedia
 * of fish species. It provides functionalities for filtering, sorting,
 * and viewing details of different fish.
 *
 * @returns {{
 * activeTab: string,
 * setActiveTab: (tab: string) => void,
 * selectedFish: FishSpecies | null,
 * setSelectedFish: (fish: FishSpecies | null) => void,
 * showFishDetails: boolean,
 * setShowFishDetails: (show: boolean) => void,
 * showFilters: boolean,
 * setShowFilters: (show: boolean) => void,
 * filters: EncyclopediaFilters,
 * setFilters: (filters: EncyclopediaFilters) => void,
 * filteredFish: FishSpecies[],
 * sortedFish: FishSpecies[],
 * discoveredSpecies: number,
 * totalSpecies: number,
 * handleFishClick: (fish: FishSpecies) => void,
 * resetFilters: () => void,
 * }} An object containing the encyclopedia's state and functions to interact with it.
 */
export const useEncyclopedia = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedFish, setSelectedFish] = useState<FishSpecies | null>(null);
  const [showFishDetails, setShowFishDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EncyclopediaFilters>({
    search: '',
    rarity: [],
    habitat: [],
    diet: [],
    temperament: [],
    careLevel: [],
    discovered: 'all',
    sort: 'name',
  });

  // Debounce search query for better performance
  const { debouncedValue: debouncedSearch } = useDebounce(filters.search, {
    delay: 300,
  });

  /**
   * @function filteredFish
   * @description
   * Filters the main `fishSpecies` array based on the current filters state.
   * The search filter is debounced for performance.
   *
   * @returns {FishSpecies[]} An array of fish species that match all active filters.
   */
  const filteredFish = fishSpecies.filter(fish => {
    if (
      debouncedSearch &&
      !fish.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      !fish.scientificName.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) {
      return false;
    }
    if (filters.rarity.length > 0 && !filters.rarity.includes(fish.rarity))
      return false;
    if (filters.habitat.length > 0 && !filters.habitat.includes(fish.habitat))
      return false;
    if (filters.diet.length > 0 && !filters.diet.includes(fish.diet))
      return false;
    if (
      filters.temperament.length > 0 &&
      !filters.temperament.includes(fish.temperament)
    )
      return false;
    if (
      filters.careLevel.length > 0 &&
      !filters.careLevel.includes(fish.careLevel)
    )
      return false;
    if (filters.discovered === 'discovered' && !fish.discovered) return false;
    if (filters.discovered === 'undiscovered' && fish.discovered) return false;
    return true;
  });

  /**
   * @function sortedFish
   * @description
   * Sorts the `filteredFish` array based on the current sorting criteria.
   *
   * @returns {FishSpecies[]} A sorted array of fish species.
   */
  const sortedFish = [...filteredFish].sort((a, b) => {
    switch (filters.sort) {
      case 'name': {
        return a.name.localeCompare(b.name);
      }
      case 'rarity': {
        const rarityOrder = {
          Common: 1,
          Uncommon: 2,
          Rare: 3,
          Epic: 4,
          Legendary: 5,
        };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      }
      case 'recent': {
        if (!a.discovered) return 1;
        if (!b.discovered) return -1;
        if (!a.discoveryDate) return 1;
        if (!b.discoveryDate) return -1;
        return (
          new Date(b.discoveryDate).getTime() -
          new Date(a.discoveryDate).getTime()
        );
      }
      default:
        return 0;
    }
  });

  /**
   * @function discoveredSpecies
   * @description
   * Calculates the number of discovered fish species.
   *
   * @returns {number} The count of discovered species.
   */
  const discoveredSpecies = fishSpecies.filter(fish => fish.discovered).length;

  /**
   * @function totalSpecies
   * @description
   * Gets the total number of fish species available.
   *
   * @returns {number} The total count of fish species.
   */
  const totalSpecies = fishSpecies.length;

  /**
   * @function handleFishClick
   * @description
   * Sets the selected fish and shows the details panel.
   *
   * @param {FishSpecies} fish - The fish species to display details for.
   */
  const handleFishClick = (fish: FishSpecies) => {
    setSelectedFish(fish);
    setShowFishDetails(true);
  };

  /**
   * @function resetFilters
   * @description
   * Resets all filters to their default state.
   */
  const resetFilters = () => {
    setFilters({
      search: '',
      rarity: [],
      habitat: [],
      diet: [],
      temperament: [],
      careLevel: [],
      discovered: 'all',
      sort: 'name',
    });
  };

  return {
    activeTab,
    setActiveTab,
    selectedFish,
    setSelectedFish,
    showFishDetails,
    setShowFishDetails,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredFish,
    sortedFish,
    discoveredSpecies,
    totalSpecies,
    handleFishClick,
    resetFilters,
  };
};
