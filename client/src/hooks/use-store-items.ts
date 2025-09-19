import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';

/**
 * Store Item Types
 */
export type StoreItemType = 'fish' | 'decoration' | 'food' | 'other';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: StoreItemType;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreFilters {
  type?: StoreItemType;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
}

export interface StoreStats {
  totalItems: number;
  activeItems: number;
  totalValue: number;
  typeDistribution: Record<StoreItemType, number>;
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  lowStockItems: number;
}

export interface StoreResponse {
  success: boolean;
  data: StoreItem[];
  count?: number;
  filters?: StoreFilters;
}

export interface StoreItemResponse {
  success: boolean;
  data: StoreItem;
}

export interface StoreStatsResponse {
  success: boolean;
  data: StoreStats;
}

/**
 * Hook for managing store items from the backend API
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export function useStoreItems() {
  const { get, loading, error } = useApi();

  // State for store items
  const [items, setItems] = useState<StoreItem[]>([]);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [lastFilters, setLastFilters] = useState<StoreFilters>({});
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Fetch store items with optional filters
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
   * Fetch a specific store item by ID
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
   * Fetch store items by type
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
   * Fetch store statistics
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
   * Get items by type from current items state
   */
  const getItemsByType = useCallback(
    (type: StoreItemType): StoreItem[] => {
      return items.filter(item => item.type === type);
    },
    [items]
  );

  /**
   * Search items by name or description
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
   * Filter items by price range
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
   * Get items with low stock
   */
  const getLowStockItems = useCallback(
    (threshold: number = 10): StoreItem[] => {
      return items.filter(item => item.stock <= threshold && item.stock > 0);
    },
    [items]
  );

  /**
   * Get out of stock items
   */
  const getOutOfStockItems = useCallback((): StoreItem[] => {
    return items.filter(item => item.stock === 0);
  }, [items]);

  /**
   * Get available items (in stock)
   */
  const getAvailableItems = useCallback((): StoreItem[] => {
    return items.filter(item => item.stock > 0);
  }, [items]);

  /**
   * Get items sorted by price
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
   * Get items sorted by name
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
   * Get items sorted by creation date
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
   * Get total value of all items
   */
  const getTotalValue = useCallback((): number => {
    return items.reduce((total, item) => total + item.price * item.stock, 0);
  }, [items]);

  /**
   * Get type distribution
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
   * Refresh store items with last used filters
   */
  const refreshItems = useCallback(async () => {
    return fetchStoreItems(lastFilters);
  }, [fetchStoreItems, lastFilters]);

  /**
   * Clear all items from state
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
 * Hook for managing a specific store item
 */
export function useStoreItem(itemId: string) {
  const { get, loading, error } = useApi();
  const [item, setItem] = useState<StoreItem | null>(null);

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
