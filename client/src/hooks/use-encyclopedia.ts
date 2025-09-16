import { useState } from 'react';
import { fishSpecies } from '@/data/encyclopedia-data';
import type { FishSpecies } from '@/data/encyclopedia-data';
import { useDebounce } from './use-debounce';

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
  const { debouncedValue: debouncedSearch } = useDebounce(filters.search, { delay: 300 });

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

  const discoveredSpecies = fishSpecies.filter(fish => fish.discovered).length;
  const totalSpecies = fishSpecies.length;

  const handleFishClick = (fish: FishSpecies) => {
    setSelectedFish(fish);
    setShowFishDetails(true);
  };

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
