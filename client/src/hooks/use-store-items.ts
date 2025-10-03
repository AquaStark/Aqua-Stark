import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';

/**
 * Represents the type of a store item.
 */
export type StoreItemType = 'fish' | 'decoration' | 'food' | 'other';

/**
 * Represents a store item entity from the backend API.
 */
export interface StoreItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Detailed description of the item */
  description: string;
  /** Price in game currency */
  price: number;
  /** Category of the item */
  type: StoreItemType;
  /** Current inventory count */
  stock: number;
  /** URL to the item's image */
  image_url: string;
  /** Whether the item is currently available for purchase */
  is_active: boolean;
  /** ISO string of when the item was created */
  created_at: string;
  /** ISO string of when the item was last updated */
  updated_at: string;
}

/**
 * Filters that can be applied when fetching store items.
 */
export interface StoreFilters {
  /** Filter by item type */
  type?: StoreItemType;
  /** Minimum price filter (inclusive) */
  minPrice?: number;
  /** Maximum price filter (inclusive) */
  maxPrice?: number;
  /** Text search query (name or description) */
  search?: string;
  /** Maximum number of items to return */
  limit?: number;
}

/**
 * Statistics about the store inventory.
 */
export interface StoreStats {
  /** Total number of items in the store */
  totalItems: number;
  /** Number of items that are currently active */
  activeItems: number;
  /** Total monetary value of all inventory */
  totalValue: number;
  /** Count of items per type */
  typeDistribution: Record<StoreItemType, number>;
  /** Price statistics */
  priceRange: {
    /** Lowest item price */
    min: number;
    /** Highest item price */
    max: number;
    /** Average item price */
    average: number;
  };
  /** Number of items with low stock (≤10 units) */
  lowStockItems: number;
}

/**
 * Standard API response format for store item collections.
 */
export interface StoreResponse {
  /** Whether the request succeeded */
  success: boolean;
  /** Array of store items */
  data: StoreItem[];
  /** Total count of items matching the filters (for pagination) */
  count?: number;
  /** The filters that were applied in this request */
  filters?: StoreFilters;
}

/**
 * Standard API response format for a single store item.
 */
export interface StoreItemResponse {
  /** Whether the request succeeded */
  success: boolean;
  /** The requested store item */
  data: StoreItem;
}

/**
 * Standard API response format for store statistics.
 */
export interface StoreStatsResponse {
  /** Whether the request succeeded */
  success: boolean;
  /** The store statistics */
  data: StoreStats;
}

/**
 * Custom hook for managing store items from the backend API.
 *
 * Provides comprehensive functionality for fetching, filtering, sorting,
 * and analyzing store inventory data. Automatically fetches all items on mount
 * and maintains local state for efficient client-side operations.
 *
 * @returns {{
 *   items: StoreItem[];
 *   stats: StoreStats | null;
 *   lastFilters: StoreFilters;
 *   isInitialized: boolean;
 *   loading: boolean;
 *   error: unknown;
 *   fetchStoreItems: (filters?: StoreFilters) => Promise<StoreItem[]>;
 *   fetchStoreItem: (itemId: string) => Promise<StoreItem>;
 *   fetchStoreItemsByType: (type: StoreItemType) => Promise<StoreItem[]>;
 *   fetchStoreStats: () => Promise<StoreStats>;
 *   getItemsByType: (type: StoreItemType) => StoreItem[];
 *   searchItems: (query: string) => StoreItem[];
 *   filterItemsByPrice: (minPrice: number, maxPrice: number) => StoreItem[];
 *   getLowStockItems: (threshold?: number) => StoreItem[];
 *   getOutOfStockItems: () => StoreItem[];
 *   getAvailableItems: () => StoreItem[];
 *   getItemsSortedByPrice: (ascending?: boolean) => StoreItem[];
 *   getItemsSortedByName: (ascending?: boolean) => StoreItem[];
 *   getItemsSortedByDate: (ascending?: boolean) => StoreItem[];
 *   getTotalValue: () => number;
 *   getTypeDistribution: () => Record<StoreItemType, number>;
 *   refreshItems: () => Promise<StoreItem[]>;
 *   clearItems: () => void;
 * }} An object containing store data, loading states, and utility functions.
 *
 * @example
 * ```tsx
 * const {
 *   items,
 *   loading,
 *   fetchStoreItemsByType,
 *   getItemsSortedByPrice
 * } = useStoreItems();
 *
 * const handleFishTab = async () => {
 *   const fishItems = await fetchStoreItemsByType('fish');
 *   const sortedFish = getItemsSortedByPrice(true);
 * };
 * ```
 */
export function useStoreItems() {
  const { get, loading, error } = useApi();

  // State for store items
  const [items, setItems] = useState<StoreItem[]>([]);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [lastFilters, setLastFilters] = useState<StoreFilters>({});
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Fetches store items from the API with optional filters.
   *
   * @param {StoreFilters} [filters={}] - Filters to apply to the request.
   * @returns {Promise<StoreItem[]>} A promise that resolves to the fetched items.
   * @throws {Error} If the API request fails or returns an unsuccessful response.
   */
  const fetchStoreItems = useCallback(
    async (filters: StoreFilters = {}) => {
      try {
        const params: Record<string, string> = {};

        if (filters.type) params.type = filters.type;
        if (filters.minPrice !== undefined)
          params.minPrice = filters.minPrice.toString();
        if (filters.maxPrice !== undefined)
          params.maxPrice = filters.maxPrice.toString();
        if (filters.search) params.search = filters.search;
        if (filters.limit) params.limit = filters.limit.toString();

        const response = await get<StoreResponse>('/store/items', params);

        if (response.success && response.data) {
          setItems(response.data as unknown as StoreItem[]);
          setLastFilters(filters);
          setIsInitialized(true);
          return response.data as unknown as StoreItem[];
        }

        throw new Error('Failed to fetch store items');
      } catch (err) {
        console.error('Error fetching store items:', err);
        throw err;
      }
    },
    [get]
  );

  /**
   * Fetches a single store item by its ID.
   *
   * @param {string} itemId - The unique identifier of the item to fetch.
   * @returns {Promise<StoreItem>} A promise that resolves to the fetched item.
   * @throws {Error} If the API request fails or returns an unsuccessful response.
   */
  const fetchStoreItem = useCallback(
    async (itemId: string): Promise<StoreItem> => {
      try {
        const response = await get<StoreItemResponse>(`/store/items/${itemId}`);

        if (response.success && response.data) {
          return response.data as unknown as StoreItem;
        }

        throw new Error('Failed to fetch store item');
      } catch (err) {
        console.error('Error fetching store item:', err);
        throw err;
      }
    },
    [get]
  );

  /**
   * Fetches all store items of a specific type.
   *
   * @param {StoreItemType} type - The type of items to fetch.
   * @returns {Promise<StoreItem[]>} A promise that resolves to the fetched items.
   * @throws {Error} If the API request fails or returns an unsuccessful response.
   */
  const fetchStoreItemsByType = useCallback(
    async (type: StoreItemType): Promise<StoreItem[]> => {
      try {
        const response = await get<StoreResponse>(`/store/items/type/${type}`);

        if (response.success && response.data) {
          return response.data as unknown as StoreItem[];
        }

        throw new Error('Failed to fetch store items by type');
      } catch (err) {
        console.error('Error fetching store items by type:', err);
        throw err;
      }
    },
    [get]
  );

  /**
   * Fetches comprehensive statistics about the store inventory.
   *
   * @returns {Promise<StoreStats>} A promise that resolves to the store statistics.
   * @throws {Error} If the API request fails or returns an unsuccessful response.
   */
  const fetchStoreStats = useCallback(async (): Promise<StoreStats> => {
    try {
      const response = await get<StoreStatsResponse>('/store/items/stats');

      if (response.success && response.data) {
        setStats(response.data as unknown as StoreStats);
        return response.data as unknown as StoreStats;
      }

      throw new Error('Failed to fetch store statistics');
    } catch (err) {
      console.error('Error fetching store statistics:', err);
      throw err;
    }
  }, [get]);

  /**
   * Filters the current items by type using client-side data.
   *
   * @param {StoreItemType} type - The type to filter by.
   * @returns {StoreItem[]} Items matching the specified type.
   */
  const getItemsByType = useCallback(
    (type: StoreItemType): StoreItem[] => {
      return items.filter(item => item.type === type);
    },
    [items]
  );

  /**
   * Searches items by name or description using client-side data.
   *
   * @param {string} query - The search query string.
   * @returns {StoreItem[]} Items matching the search query.
   */
  const searchItems = useCallback(
    (query: string): StoreItem[] => {
      if (!query.trim()) return items;

      const lowercaseQuery = query.toLowerCase();
      return items.filter(
        item =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery)
      );
    },
    [items]
  );

  /**
   * Filters items by price range using client-side data.
   *
   * @param {number} minPrice - Minimum price (inclusive).
   * @param {number} maxPrice - Maximum price (inclusive).
   * @returns {StoreItem[]} Items within the specified price range.
   */
  const filterItemsByPrice = useCallback(
    (minPrice: number, maxPrice: number): StoreItem[] => {
      return items.filter(
        item => item.price >= minPrice && item.price <= maxPrice
      );
    },
    [items]
  );

  /**
   * Gets items with low stock (at or below the threshold).
   *
   * @param {number} [threshold=10] - The stock threshold for "low stock".
   * @returns {StoreItem[]} Items with stock at or below the threshold.
   */
  const getLowStockItems = useCallback(
    (threshold: number = 10): StoreItem[] => {
      return items.filter(item => item.stock <= threshold && item.stock > 0);
    },
    [items]
  );

  /**
   * Gets items that are completely out of stock.
   *
   * @returns {StoreItem[]} Items with zero stock.
   */
  const getOutOfStockItems = useCallback((): StoreItem[] => {
    return items.filter(item => item.stock === 0);
  }, [items]);

  /**
   * Gets items that are currently available (in stock).
   *
   * @returns {StoreItem[]} Items with stock greater than zero.
   */
  const getAvailableItems = useCallback((): StoreItem[] => {
    return items.filter(item => item.stock > 0);
  }, [items]);

  /**
   * Sorts items by price.
   *
   * @param {boolean} [ascending=true] - Sort direction (true for ascending).
   * @returns {StoreItem[]} Items sorted by price.
   */
  const getItemsSortedByPrice = useCallback(
    (ascending: boolean = true): StoreItem[] => {
      return [...items].sort((a, b) =>
        ascending ? a.price - b.price : b.price - a.price
      );
    },
    [items]
  );

  /**
   * Sorts items by name alphabetically.
   *
   * @param {boolean} [ascending=true] - Sort direction (true for A-Z).
   * @returns {StoreItem[]} Items sorted by name.
   */
  const getItemsSortedByName = useCallback(
    (ascending: boolean = true): StoreItem[] => {
      return [...items].sort((a, b) =>
        ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    },
    [items]
  );

  /**
   * Sorts items by creation date.
   *
   * @param {boolean} [ascending=true] - Sort direction (true for oldest first).
   * @returns {StoreItem[]} Items sorted by creation date.
   */
  const getItemsSortedByDate = useCallback(
    (ascending: boolean = true): StoreItem[] => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
    },
    [items]
  );

  /**
   * Calculates the total monetary value of all inventory.
   *
   * @returns {number} Total value (sum of price × stock for all items).
   */
  const getTotalValue = useCallback((): number => {
    return items.reduce((total, item) => total + item.price * item.stock, 0);
  }, [items]);

  /**
   * Calculates the distribution of items by type.
   *
   * @returns {Record<StoreItemType, number>} Count of items per type.
   */
  const getTypeDistribution = useCallback((): Record<StoreItemType, number> => {
    return items.reduce(
      (distribution, item) => {
        distribution[item.type] = (distribution[item.type] || 0) + 1;
        return distribution;
      },
      {} as Record<StoreItemType, number>
    );
  }, [items]);

  /**
   * Refreshes the current item list using the last applied filters.
   *
   * @returns {Promise<StoreItem[]>} A promise that resolves to the refreshed items.
   */
  const refreshItems = useCallback(async () => {
    return fetchStoreItems(lastFilters);
  }, [fetchStoreItems, lastFilters]);

  /**
   * Clears all items and statistics from local state.
   */
  const clearItems = useCallback(() => {
    setItems([]);
    setStats(null);
  }, []);

  // Auto-fetch items on mount
  useEffect(() => {
    fetchStoreItems();
  }, [fetchStoreItems]);

  return {
    // Data
    items,
    stats,
    lastFilters,
    isInitialized,

    // Loading and error states
    loading,
    error,

    // Fetch functions
    fetchStoreItems,
    fetchStoreItem,
    fetchStoreItemsByType,
    fetchStoreStats,

    // Utility functions
    getItemsByType,
    searchItems,
    filterItemsByPrice,
    getLowStockItems,
    getOutOfStockItems,
    getAvailableItems,
    getItemsSortedByPrice,
    getItemsSortedByName,
    getItemsSortedByDate,
    getTotalValue,
    getTypeDistribution,

    // State management
    refreshItems,
    clearItems,
  };
}

/**
 * Custom hook for managing a single store item by ID.
 *
 * Automatically fetches the item on mount and provides a refetch function
 * for manual updates. Useful for item detail pages or modals.
 *
 * @param {string} itemId - The unique identifier of the item to manage.
 * @returns {{
 *   item: StoreItem | null;
 *   loading: boolean;
 *   error: unknown;
 *   refetch: () => Promise<StoreItem>;
 * }} An object containing the item data, loading state, error state, and refetch function.
 *
 * @example
 * ```tsx
 * const { item, loading, refetch } = useStoreItem('fish-001');
 *
 * if (loading) return <Spinner />;
 * if (!item) return <div>Item not found</div>;
 *
 * return (
 *   <div>
 *     <h1>{item.name}</h1>
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export function useStoreItem(itemId: string) {
  const { get, loading, error } = useApi();
  const [item, setItem] = useState<StoreItem | null>(null);

  /**
   * Fetches the store item from the API.
   *
   * @returns {Promise<StoreItem>} A promise that resolves to the fetched item.
   * @throws {Error} If the API request fails or returns an unsuccessful response.
   */
  const fetchItem = useCallback(async () => {
    if (!itemId) return;

    try {
      const response = await get<StoreItemResponse>(`/store/items/${itemId}`);

      if (response.success && response.data) {
        setItem(response.data as unknown as StoreItem);
        return response.data as unknown as StoreItem;
      }

      throw new Error('Failed to fetch store item');
    } catch (err) {
      console.error('Error fetching store item:', err);
      throw err;
    }
  }, [get, itemId]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    refetch: fetchItem,
  };
}

export default useStoreItems;
