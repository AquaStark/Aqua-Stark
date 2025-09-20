import { useState, useCallback, useMemo } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { fishData } from '@/data/mock-game';
import {
  miscItems,
  decorationItems,
  bundles,
  decorationBundles,
} from '@/data/mock-store';
import { foodData, specialFoodBundles } from '@/data/market-data';
import { ItemType } from '@/data/mock-game';
import {
  ShopItem,
  ShopBundle,
  TransactionResult,
  ShopFilters,
} from '@/types/shop-types';

// Cache interface for shop data
interface ShopCache {
  items: ShopItem[];
  bundles: ShopBundle[];
  lastUpdated: number;
  expiresIn: number; // milliseconds
}

/**
 * Unified hook for managing shop data, transactions, and caching
 * Centralizes all shop-related logic to avoid duplication across components
 */
export function useShopData() {
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    processCheckout,
  } = useCartStore();

  // State for shop data cache
  const [shopCache, setShopCache] = useState<ShopCache | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache configuration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all shop items by category
   * @param category - The item category to filter by
   * @returns Array of shop items for the specified category
   */
  const getShopItems = useCallback((category: ItemType): ShopItem[] => {
    switch (category) {
      case 'fish':
        return fishData.map((fish, index) => ({
          id: `fish-${index}`,
          name: fish.name,
          image: fish.image,
          price: fish.price,
          originalPrice: fish.originalPrice,
          rarity: fish.rarity,
          category: 'Fish',
          description: fish.description,
          rating: fish.rating,
          isNew: false,
          stock: 100,
          isLimited: false,
          discounted: false,
          popularity: 0,
          createdAt: new Date(),
        }));
      case 'food':
        return foodData.map(food => ({
          id: food.id,
          name: food.name,
          image: food.image,
          price: food.price,
          originalPrice: food.originalPrice,
          rarity: food.rarity as ShopItem['rarity'],
          category: 'Food',
          description: food.description,
          rating: food.rating,
          isNew: food.isNew,
          stock: food.stock,
          isLimited: food.isLimited,
          discounted: (food as any).discounted || false,
          popularity: (food as any).popularity || 0,
          createdAt: (food as any).createdAt || new Date(),
        }));
      case 'decorations':
        return decorationItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: (item as any).originalPrice,
          rarity: item.rarity as ShopItem['rarity'],
          category: item.category,
          description: item.description,
          rating: item.rating,
          isNew: item.isNew,
          stock: item.stock,
          isLimited: item.isLimited,
          discounted: (item as any).discounted || false,
          popularity: (item as any).popularity || 0,
          createdAt: (item as any).createdAt || new Date(),
        }));
      case 'others':
        return miscItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: (item as any).originalPrice,
          rarity: item.rarity as ShopItem['rarity'],
          category: item.category,
          description: item.description,
          rating: item.rating,
          isNew: item.isNew,
          stock: item.stock,
          isLimited: item.isLimited,
          discounted: (item as any).discounted || false,
          popularity: (item as any).popularity || 0,
          createdAt: (item as any).createdAt || new Date(),
        }));
      default:
        return [];
    }
  }, []);

  /**
   * Get all shop bundles by category
   * @param category - The bundle category to filter by
   * @returns Array of shop bundles for the specified category
   */
  const getShopBundles = useCallback((category: ItemType): ShopBundle[] => {
    switch (category) {
      case 'decorations':
        return decorationBundles.map(bundle => ({
          id: bundle.id,
          name: bundle.name,
          image: bundle.image,
          price: bundle.price,
          originalPrice: bundle.originalPrice,
          discount: `${bundle.savingsPercentage}% OFF`,
          tag: 'Special',
          rarity: 'Special',
          items: bundle.items,
          description: bundle.description,
          savingsPercentage: bundle.savingsPercentage,
          type: bundle.type,
        }));
      case 'food':
        return specialFoodBundles.map(bundle => ({
          id: bundle.id,
          name: bundle.name,
          image: bundle.image,
          price: bundle.price,
          originalPrice: bundle.originalPrice,
          discount: `${bundle.savingsPercentage}% OFF`,
          tag: 'Special',
          rarity: 'Special',
          items: bundle.items,
          description: bundle.description,
          savingsPercentage: bundle.savingsPercentage,
        }));
      case 'others':
        return bundles.map(bundle => ({
          id: bundle.id,
          name: bundle.name,
          image: bundle.image,
          price: bundle.price,
          originalPrice: bundle.originalPrice,
          discount: bundle.discount,
          tag: bundle.tag,
          rarity: bundle.rarity as ShopBundle['rarity'],
          items: bundle.items,
          description: bundle.description,
        }));
      default:
        return [];
    }
  }, []);

  /**
   * Filter shop items based on provided filters
   * @param items - Array of shop items to filter
   * @param filters - Filter criteria
   * @returns Filtered array of shop items
   */
  const filterShopItems = useCallback(
    (items: ShopItem[], filters: ShopFilters): ShopItem[] => {
      let filtered = [...items];

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query)
        );
      }

      // Price range filter
      filtered = filtered.filter(
        item =>
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]
      );

      // Category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter(item =>
          filters.categories.includes(item.category || '')
        );
      }

      // On sale filter
      if (filters.onSale) {
        filtered = filtered.filter(
          item =>
            item.discounted ||
            (item.originalPrice && item.originalPrice > item.price)
        );
      }

      // Sort items
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price - b.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (
              (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
            );
          case 'popularity':
            return (b.popularity || 0) - (a.popularity || 0);
          default:
            return 0;
        }
      });

      return filtered;
    },
    []
  );

  /**
   * Buy an item and add it to cart
   * @param item - The item to buy
   * @param quantity - Quantity to buy (default: 1)
   * @returns Transaction result
   */
  const buyItem = useCallback(
    async (
      item: ShopItem,
      quantity: number = 1
    ): Promise<TransactionResult> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate item availability
        if (item.stock && item.stock < quantity) {
          return {
            success: false,
            message: 'Insufficient stock',
            error: `Only ${item.stock} items available`,
          };
        }

        // Validate item price
        if (item.price <= 0) {
          return {
            success: false,
            message: 'Invalid item price',
            error: 'Item price must be greater than 0',
          };
        }

        // Add item to cart
        for (let i = 0; i < quantity; i++) {
          addItem(item);
        }

        return {
          success: true,
          message: `Successfully added ${quantity} ${item.name}(s) to cart`,
          transactionId: `buy_${item.id}_${Date.now()}`,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          message: 'Failed to buy item',
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [addItem]
  );

  /**
   * Sell an item (remove from inventory and add coins)
   * @param item - The item to sell
   * @param quantity - Quantity to sell (default: 1)
   * @returns Transaction result
   */
  const sellItem = useCallback(
    async (
      item: ShopItem,
      quantity: number = 1
    ): Promise<TransactionResult> => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate item price
        if (item.price <= 0) {
          return {
            success: false,
            message: 'Invalid item price',
            error: 'Item price must be greater than 0',
          };
        }

        // Calculate sell price (typically 70% of buy price)
        const sellPrice = Math.floor(item.price * 0.7);

        // In a real implementation, this would:
        // 1. Remove item from player inventory
        // 2. Add coins to player wallet
        // 3. Update transaction history

        return {
          success: true,
          message: `Successfully sold ${quantity} ${item.name}(s) for ${sellPrice} coins each`,
          transactionId: `sell_${item.id}_${Date.now()}`,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          message: 'Failed to sell item',
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Process checkout for all items in cart
   * @returns Transaction result
   */
  const processCartCheckout =
    useCallback(async (): Promise<TransactionResult> => {
      try {
        setIsLoading(true);
        setError(null);

        if (cartItems.length === 0) {
          return {
            success: false,
            message: 'Cart is empty',
            error: 'No items to checkout',
          };
        }

        // Calculate total cost
        const totalCost = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const fee = Math.floor(totalCost * 0.01);
        const finalTotal = totalCost + fee;

        // In a real implementation, this would:
        // 1. Validate player has enough coins
        // 2. Process blockchain transaction
        // 3. Update player inventory
        // 4. Clear cart

        // Simulate transaction processing
        await processCheckout();

        return {
          success: true,
          message: `Checkout successful! Total: ${finalTotal} coins`,
          transactionId: `checkout_${Date.now()}`,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          message: 'Checkout failed',
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    }, [cartItems, processCheckout]);

  /**
   * Get cached shop data or fetch fresh data
   * @param category - The category to get data for
   * @returns Cached or fresh shop data
   */
  const getCachedShopData = useCallback(
    (category: ItemType) => {
      const now = Date.now();

      // Check if cache is valid
      if (shopCache && now - shopCache.lastUpdated < shopCache.expiresIn) {
        return {
          items: shopCache.items,
          bundles: shopCache.bundles,
        };
      }

      // Fetch fresh data
      const items = getShopItems(category);
      const bundles = getShopBundles(category);

      // Update cache
      setShopCache({
        items,
        bundles,
        lastUpdated: now,
        expiresIn: CACHE_DURATION,
      });

      return { items, bundles };
    },
    [shopCache, getShopItems, getShopBundles, CACHE_DURATION]
  );

  /**
   * Clear shop data cache
   */
  const clearCache = useCallback(() => {
    setShopCache(null);
  }, []);

  /**
   * Get cart summary information
   */
  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const fee = Math.floor(subtotal * 0.01);
    const total = subtotal + fee;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      fee,
      total,
      itemCount,
      items: cartItems,
    };
  }, [cartItems]);

  return {
    // Data getters
    getShopItems,
    getShopBundles,
    getCachedShopData,
    filterShopItems,

    // Transaction functions
    buyItem,
    sellItem,
    processCartCheckout,

    // Cart management
    cartSummary,
    clearCart,
    removeItem,
    updateQuantity,

    // Cache management
    clearCache,

    // State
    isLoading,
    error,
    setError,
  };
}
