import { useState, useCallback, useMemo } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { fishData } from '@/data/mock-game';
import {
  miscItems,
  decorationItems,
  bundles,
  decorationBundles,
} from '@/data/mock-store';
import { foodData, specialFoodBundles } from '@/constants';
import { ItemType } from '@/data/mock-game';
import {
  ShopItem,
  ShopBundle,
  TransactionResult,
  ShopFilters,
} from '@/types/shop-types';

/**
 * Cache interface for shop data with expiration management
 */
interface ShopCache {
  /** Cached shop items array */
  items: ShopItem[];
  /** Cached shop bundles array */
  bundles: ShopBundle[];
  /** Timestamp when cache was last updated */
  lastUpdated: number;
  /** Cache expiration duration in milliseconds */
  expiresIn: number;
}

/**
 * Unified hook for managing shop data, transactions, and caching.
 *
 * This hook centralizes all shop-related logic to avoid duplication across components.
 * It provides comprehensive functionality for browsing items, managing cart operations,
 * processing transactions, and caching data for improved performance.
 *
 * Features:
 * - Shop item and bundle retrieval by category
 * - Advanced filtering and sorting capabilities
 * - Buy/sell transaction processing
 * - Cart management integration
 * - Data caching with automatic expiration
 * - Comprehensive error handling
 * - Loading state management
 * - Cart summary calculations
 *
 * @returns Object containing shop data methods, transaction functions, and state management
 *
 * @example
 * Basic shop data retrieval:
 * ```tsx
 * const {
 *   getShopItems,
 *   getShopBundles,
 *   filterShopItems,
 *   isLoading,
 *   error
 * } = useShopData();
 *
 * // Get fish items
 * const fishItems = getShopItems('fish');
 *
 * // Get decoration bundles
 * const decoBundle = getShopBundles('decorations');
 *
 * // Filter items by search and price
 * const filteredItems = filterShopItems(fishItems, {
 *   searchQuery: 'goldfish',
 *   priceRange: [0, 100],
 *   categories: ['Fish'],
 *   onSale: false,
 *   sort: 'price'
 * });
 * ```
 *
 * @example
 * Transaction processing:
 * ```tsx
 * const { buyItem, sellItem, processCartCheckout } = useShopData();
 *
 * // Buy single item
 * const handleBuyFish = async (fish: ShopItem) => {
 *   const result = await buyItem(fish, 1);
 *   if (result.success) {
 *     console.log('Purchase successful:', result.message);
 *   } else {
 *     console.error('Purchase failed:', result.error);
 *   }
 * };
 *
 * // Buy multiple items
 * const handleBuyBulk = async (item: ShopItem, quantity: number) => {
 *   const result = await buyItem(item, quantity);
 *   if (result.success) {
 *     console.log('Bulk purchase completed:', result.transactionId);
 *   }
 * };
 *
 * // Sell item back
 * const handleSellItem = async (item: ShopItem) => {
 *   const result = await sellItem(item, 1);
 *   if (result.success) {
 *     console.log('Item sold:', result.message);
 *   }
 * };
 *
 * // Process cart checkout
 * const handleCheckout = async () => {
 *   const result = await processCartCheckout();
 *   if (result.success) {
 *     console.log('Checkout completed:', result.transactionId);
 *   }
 * };
 * ```
 *
 * @example
 * Cart management and summary:
 * ```tsx
 * const {
 *   cartSummary,
 *   removeItem,
 *   updateQuantity,
 *   clearCart
 * } = useShopData();
 *
 * // Display cart summary
 * const CartSummary = () => (
 *   <div className="cart-summary">
 *     <h3>Cart Summary</h3>
 *     <p>Items: {cartSummary.itemCount}</p>
 *     <p>Subtotal: {cartSummary.subtotal} coins</p>
 *     <p>Transaction Fee: {cartSummary.fee} coins</p>
 *     <p><strong>Total: {cartSummary.total} coins</strong></p>
 *     <button onClick={clearCart}>Clear Cart</button>
 *   </div>
 * );
 *
 * // Update item quantity in cart
 * const handleQuantityChange = (itemId: string, newQuantity: number) => {
 *   updateQuantity(itemId, newQuantity);
 * };
 *
 * // Remove item from cart
 * const handleRemoveItem = (itemId: string) => {
 *   removeItem(itemId);
 * };
 * ```
 *
 * @example
 * Advanced filtering and search:
 * ```tsx
 * const { getShopItems, filterShopItems } = useShopData();
 *
 * const ShopFilter = () => {
 *   const [filters, setFilters] = useState<ShopFilters>({
 *     searchQuery: '',
 *     priceRange: [0, 1000],
 *     categories: [],
 *     onSale: false,
 *     sort: 'name'
 *   });
 *
 *   const allItems = [
 *     ...getShopItems('fish'),
 *     ...getShopItems('food'),
 *     ...getShopItems('decorations'),
 *     ...getShopItems('others')
 *   ];
 *
 *   const filteredItems = filterShopItems(allItems, filters);
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         placeholder="Search items..."
 *         value={filters.searchQuery}
 *         onChange={(e) => setFilters({
 *           ...filters,
 *           searchQuery: e.target.value
 *         })}
 *       />
 *
 *       <select
 *         value={filters.sort}
 *         onChange={(e) => setFilters({
 *           ...filters,
 *           sort: e.target.value as ShopFilters['sort']
 *         })}
 *       >
 *         <option value="name">Name</option>
 *         <option value="price">Price</option>
 *         <option value="rating">Rating</option>
 *         <option value="newest">Newest</option>
 *         <option value="popularity">Popularity</option>
 *       </select>
 *
 *       <div className="items-grid">
 *         {filteredItems.map(item => (
 *           <ItemCard key={item.id} item={item} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * Caching and performance optimization:
 * ```tsx
 * const { getCachedShopData, clearCache } = useShopData();
 *
 * const ShopPage = ({ category }: { category: ItemType }) => {
 *   const [shopData, setShopData] = useState<{
 *     items: ShopItem[];
 *     bundles: ShopBundle[];
 *   } | null>(null);
 *
 *   useEffect(() => {
 *     // Get cached data or fetch fresh data
 *     const data = getCachedShopData(category);
 *     setShopData(data);
 *   }, [category]);
 *
 *   const handleRefresh = () => {
 *     clearCache(); // Clear cache to force fresh data
 *     const freshData = getCachedShopData(category);
 *     setShopData(freshData);
 *   };
 *
 *   if (!shopData) return <LoadingSpinner />;
 *
 *   return (
 *     <div>
 *       <button onClick={handleRefresh}>Refresh Data</button>
 *       <ItemGrid items={shopData.items} />
 *       <BundleGrid bundles={shopData.bundles} />
 *     </div>
 *   );
 * };
 * ```
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
   * Get all shop items by category.
   * Transforms raw data from different sources into standardized ShopItem format.
   *
   * @param category - The item category to filter by (fish, food, decorations, others)
   * @returns Array of shop items for the specified category
   *
   * @example
   * ```tsx
   * const fishItems = getShopItems('fish');
   * const foodItems = getShopItems('food');
   * const decorationItems = getShopItems('decorations');
   * const miscItems = getShopItems('others');
   * ```
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
   * Get all shop bundles by category.
   * Transforms bundle data from different sources into standardized ShopBundle format.
   *
   * @param category - The bundle category to filter by (decorations, food, others)
   * @returns Array of shop bundles for the specified category
   *
   * @example
   * ```tsx
   * const decorationBundles = getShopBundles('decorations');
   * const foodBundles = getShopBundles('food');
   * const miscBundles = getShopBundles('others');
   * ```
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
   * Filter shop items based on provided filter criteria.
   * Supports search, price range, category, sale status, and sorting options.
   *
   * @param items - Array of shop items to filter
   * @param filters - Filter criteria object containing search, price, category, sale, and sort options
   * @returns Filtered and sorted array of shop items
   *
   * @example
   * ```tsx
   * const filteredItems = filterShopItems(allItems, {
   *   searchQuery: 'goldfish',
   *   priceRange: [10, 100],
   *   categories: ['Fish', 'Food'],
   *   onSale: true,
   *   sort: 'price'
   * });
   * ```
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
   * Buy an item and add it to the shopping cart.
   * Validates stock availability and item price before processing.
   *
   * @param item - The shop item to purchase
   * @param quantity - Number of items to buy (defaults to 1)
   * @returns Promise resolving to transaction result with success/failure status
   *
   * @example
   * ```tsx
   * const handlePurchase = async (item: ShopItem) => {
   *   const result = await buyItem(item, 2);
   *   if (result.success) {
   *     showSuccessMessage(result.message);
   *   } else {
   *     showErrorMessage(result.error);
   *   }
   * };
   * ```
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
   * Sell an item back to the shop for coins.
   * Calculates sell price as 70% of the original buy price.
   * In a full implementation, this would remove items from inventory and add coins.
   *
   * @param item - The shop item to sell
   * @param quantity - Number of items to sell (defaults to 1)
   * @returns Promise resolving to transaction result with success/failure status
   *
   * @example
   * ```tsx
   * const handleSell = async (item: ShopItem) => {
   *   const result = await sellItem(item, 1);
   *   if (result.success) {
   *     updatePlayerCoins(sellPrice);
   *     removeFromInventory(item.id);
   *   }
   * };
   * ```
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
   * Process checkout for all items currently in the shopping cart.
   * Calculates total cost including transaction fees and processes payment.
   * In a full implementation, this would integrate with blockchain transactions.
   *
   * @returns Promise resolving to transaction result with success/failure status
   *
   * @example
   * ```tsx
   * const handleCheckout = async () => {
   *   const result = await processCartCheckout();
   *   if (result.success) {
   *     navigateToSuccess();
   *     clearCart();
   *   } else {
   *     showCheckoutError(result.error);
   *   }
   * };
   * ```
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
   * Get cached shop data or fetch fresh data if cache is expired.
   * Implements automatic cache management with 5-minute expiration.
   *
   * @param category - The item category to get data for
   * @returns Object containing cached or fresh shop items and bundles
   *
   * @example
   * ```tsx
   * const { items, bundles } = getCachedShopData('fish');
   * // Data will be served from cache if still valid,
   * // otherwise fresh data will be fetched and cached
   * ```
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
   * Clear the shop data cache to force fresh data retrieval on next request.
   * Useful when data needs to be refreshed manually or after certain operations.
   *
   * @example
   * ```tsx
   * const handleRefreshShop = () => {
   *   clearCache();
   *   // Next call to getCachedShopData will fetch fresh data
   * };
   * ```
   */
  const clearCache = useCallback(() => {
    setShopCache(null);
  }, []);

  /**
   * Calculate and return comprehensive cart summary information.
   * Includes subtotal, transaction fees, total cost, item count, and item details.
   * Updates automatically when cart contents change.
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
