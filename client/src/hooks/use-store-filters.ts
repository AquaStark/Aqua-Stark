'use client';

import { useState, useMemo } from 'react';
import { type Rarity, type ItemType } from '@/data/mock-game';
import { fishData } from '@/data/mock-game';
import { decorationItems, miscItems } from '@/data/mock-store';
import { foodData } from '@/constants';
import { useDebounce } from './use-debounce';
// import { Category } from "@/types/help-types";
import { FilterCategory } from '@/components/store/filter-panel';

/**
 * Represents the available sorting options for store items.
 */
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

/**
 * Represents a price range as a tuple of minimum and maximum values.
 */
type PriceRange = [number, number];

/**
 * Props for configuring the initial state of the store filters hook.
 */
interface UseStoreFiltersProps {
  /**
   * The initial item tab to display (e.g., 'fish', 'food', 'decorations', 'others').
   */
  initialTab?: ItemType;
}

/**
 * Represents the current sort configuration.
 */
interface SortState {
  /**
   * The field to sort by.
   */
  field: 'price' | 'popularity' | 'newest';
  /**
   * The sort direction.
   */
  direction: 'asc' | 'desc';
}

/**
 * Represents the current filter configuration.
 */
interface FilterState {
  /**
   * The selected price range as [min, max].
   */
  priceRange: PriceRange;
  /**
   * The selected filter categories.
   */
  categories: FilterCategory[];
  /**
   * Whether to show only items on sale.
   */
  onSale: boolean;
}

/**
 * Custom hook to manage filtering, sorting, and searching of in-game store items.
 *
 * This hook centralizes all logic related to store item presentation, including:
 * - Tab selection (fish, food, decorations, others)
 * - Text search with debouncing
 * - Rarity filtering
 * - Price range, category, and sale status filters
 * - Multiple sorting strategies
 *
 * It returns both state values and updater functions for seamless integration
 * with UI components like filter panels and item lists.
 *
 * @param {UseStoreFiltersProps} props - Configuration options for the hook.
 * @param {ItemType} [props.initialTab='fish'] - The initial tab to select.
 *
 * @returns {{
 *   filters: FilterState;
 *   sort: SortState;
 *   searchQuery: string;
 *   debouncedSearch: string;
 *   setSearchQuery: (query: string) => void;
 *   updatePriceRange: (range: PriceRange) => void;
 *   updateCategories: (categories: FilterCategory[]) => void;
 *   toggleOnSale: () => void;
 *   updateSort: (field: 'price' | 'popularity' | 'newest', direction: 'asc' | 'desc') => void;
 *   filteredItems: Array<{ name: string; description: string; price: number; rarity: Rarity }>;
 *   selectedTab: ItemType;
 *   setSelectedTab: (tab: ItemType) => void;
 *   selectedRarity: Rarity | 'all';
 *   setSelectedRarity: (rarity: Rarity | 'all') => void;
 *   sortOption: SortOption;
 *   setSortOption: (option: SortOption) => void;
 *   priceRange: PriceRange;
 *   categories: FilterCategory[];
 *   onSale: boolean;
 * }} An object containing all filter/sort state and control functions.
 *
 * @example
 * ```tsx
 * const {
 *   filteredItems,
 *   searchQuery,
 *   setSearchQuery,
 *   selectedTab,
 *   setSelectedTab,
 *   sortOption,
 *   setSortOption
 * } = useStoreFilters({ initialTab: 'fish' });
 *
 * return (
 *   <div>
 *     <input
 *       value={searchQuery}
 *       onChange={e => setSearchQuery(e.target.value)}
 *       placeholder="Search items..."
 *     />
 *     <StoreItemGrid items={filteredItems} />
 *   </div>
 * );
 * ```
 */
export function useStoreFilters({ initialTab }: UseStoreFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    categories: [],
    onSale: false,
  });

  const [sort, setSort] = useState<SortState>({
    field: 'price',
    direction: 'asc',
  });

  const [selectedTab, setSelectedTab] = useState<ItemType>(
    initialTab || 'fish'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const { debouncedValue: debouncedSearch } = useDebounce(searchQuery, {
    delay: 300,
  });
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  /**
   * Updates the price range filter.
   *
   * @param {PriceRange} range - The new price range as [min, max].
   */
  const updatePriceRange = (range: PriceRange) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  /**
   * Updates the selected filter categories.
   *
   * @param {FilterCategory[]} categories - The new list of selected categories.
   */
  const updateCategories = (categories: FilterCategory[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  /**
   * Toggles the "on sale only" filter.
   */
  const toggleOnSale = () => {
    setFilters(prev => ({ ...prev, onSale: !prev.onSale }));
  };

  /**
   * Updates the sort field and direction.
   *
   * @param {SortState['field']} field - The field to sort by.
   * @param {SortState['direction']} direction - The sort direction.
   */
  const updateSort = (
    field: SortState['field'],
    direction: SortState['direction']
  ) => {
    setSort({ field, direction });
  };

  const selectedData = useMemo(() => {
    switch (selectedTab) {
      case 'fish':
        return fishData;
      case 'food':
        // In a real implementation, these would come from their own data files
        return foodData;
      case 'decorations':
        return decorationItems;
      case 'others':
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
      item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [selectedData, searchQuery]);

  // Apply rarity filter
  const filteredItems = useMemo(() => {
    if (selectedRarity === 'all') return searchedItems;
    return searchedItems.filter(
      item => item.rarity.toLowerCase() === selectedRarity.toLowerCase()
    );
  }, [searchedItems, selectedRarity]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
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
    priceRange: filters.priceRange,
    categories: filters.categories,
    onSale: filters.onSale,
  };
}
