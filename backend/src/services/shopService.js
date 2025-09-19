import { purchaseSchema, shopItemSchema } from '../../utils/validators.js';
import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';
import { logger } from '../../utils/logger.js';
import { json } from 'zod';

class ShopService {
  /**
   * Get all available shop items with optional filtering
   *
   * Returns a paginated list of shop items with support for category filtering,
   * price range filtering, and availability checks.
   *
   * @static
   * @async
   * @param {Object} options - Filtering and pagination options
   * @param {string} [options.category] - Filter by item category
   * @param {string} [options.subcategory] - Filter by item subcategory
   * @param {number} [options.min_price] - Minimum price filter
   * @param {number} [options.max_price] - Maximum price filter
   * @param {boolean} [options.available_only=true] - Show only available items
   * @param {number} [options.page=1] - Page number for pagination
   * @param {number} [options.limit=20] - Items per page
   * @returns {Promise<Object>} Paginated shop items with metadata
   * @throws {Error} When database query fails
   */
  static async getShopItems(options = {}) {
    const {
      category,
      subcategory,
      min_price,
      max_price,
      available_only = true,
      page = 1,
      limit = 20,
    } = options;

    try {
      // Checking  cache first
      const cacheKey = `${CACHE_KEYS.SHOP_ITEMS}:${JSON.stringify(options)}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`shopCache hit for shop items: ${cacheKey}`);
        logger.error(`shopCache hit for shop items: ${cacheKey}`);
        return JSON.parse(cached);
      }

      let query = supabase.from(TABLES.SHOP).select('*', { count: 'exact' });

      // filtering
      if (category) query = query.eq('category', category);
      if (subcategory) query = query.eq('subcategory', subcategory);
      if (min_price !== undefined) query = query.gte('price', min_price);
      if (max_price !== undefined) query = query.lte('price', max_price);

      if (available_only) {
        query = query
          .eq('is_active', true)
          .or('available_until.is.null,available_until.gt.now()');
      }

      // Applying  pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error(` Error fetching shop items:`, error);
        logger.error(` Error fetching shop items:`, error);
        throw new Error(`Failed to fetch shop items: ${error.message}`);
      }

      const result = {
        items: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      };

      // Cache the result
      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.SHOP_ITEMS,
        JSON.stringify(result)
      );
      console.log(` Successfully fetched ${data?.length || 0} shop items`);
      logger.info(` Successfully fetched ${data?.length || 0} shop items`);

      return result;
    } catch (error) {
      console.error(`[ShopService] Error in getShopItems:`, error);
      throw error;
    }
  }

  /**
   * Get a specific shop item by ID
   *
   * Retrieves detailed information about a single shop item including
   * availability, requirements, and effects.
   *
   * @static
   * @async
   * @param {string} itemId - The unique identifier of the shop item
   * @returns {Promise<Object|null>} Shop item details or null if not found
   * @throws {Error} When item ID is invalid or database query fails
   *
   * @example
   * ```javascript
   * const item = await ShopService.getShopItem('premium_fish_food_001');
   * if (item) {
   *   console.log(`${item.name} costs ${item.price} ${item.currency_type}`);
   * }
   * ```
   */
  static async getShopItem(itemId) {
    if (!itemId) {
      throw new Error('Invalid item ID provided');
    }

    try {
      const cacheKey = `${CACHE_KEYS.SHOP_ITEM}:${itemId}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`[ShopService] Cache hit for item: ${itemId}`);
        return JSON.parse(cached);
      }

      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('item_id', itemId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`[ShopService] Error fetching item ${itemId}:`, error);
        throw new Error(`Failed to fetch shop item: ${error.message}`);
      }

      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.SHOP_ITEMS,
        JSON.stringify(data)
      );

      if (data) {
        console.log(`[ShopService] Successfully fetched item: ${itemId}`);
      }

      return data;
    } catch (error) {
      console.error(`[ShopService] Error in getShopItem:`, error);
      throw error;
    }
  }

  /**
   * Create a new shop item
   *
   * Adds a new item to the shop inventory with validation and automatic
   * cache invalidation.
   *
   * @static
   * @async
   * @param {Object} itemData - The shop item data
   * @param {string} itemData.item_id - Unique item identifier
   * @param {string} itemData.name - Item name
   * @param {string} itemData.description - Item description
   * @param {string} itemData.category - Item category
   * @param {number} itemData.price - Item price
   * @param {string} itemData.currency_type - Currency type (coins/gems)
   * @returns {Promise<Object>} Created shop item
   * @throws {Error} When validation fails or item already exists
   */
  static async createShopItem(itemData) {
    try {
      const validatedData = shopItemSchema.parse(itemData);

      const existing = await this.getShopItem(validatedData.item_id);
      if (existing) {
        logger.error(
          `Shop item with ID ${validatedData.item_id} already exists`
        );
        throw new Error(
          `Shop item with ID ${validatedData.item_id} already exists`
        );
      }

      const { data, error } = await supabaseAdmin
        .from('shop_items')
        .insert([
          {
            ...validatedData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        logger.error(`[service]:: Error creating shop item:${error}`);
        throw new Error(`Failed to create shop item: ${error.message}`);
      }

      await this.invalidateShopCaches();

      logger.info(
        `[ShopService]:: Successfully created shop item: ${data.item_id}`
      );
      return data;
    } catch (error) {
      logger.error(`[ShopService] Error in createShopItem:${error}`);
      throw error;
    }
  }

  /**
   * Update an existing shop item
   *
   * Updates shop item properties with validation and cache invalidation.
   * Only provided fields will be updated.
   *
   * @static
   * @async
   * @param {string} itemId - The item ID to update
   * @param {Object} updateData - Partial item data to update
   * @returns {Promise<Object>} Updated shop item
   * @throws {Error} When item not found or validation fails
   */
  static async updateShopItem(itemId, updateData) {
    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Invalid item ID provided');
    }

    try {
      const validatedData = shopItemSchema.partial().parse(updateData);

      if (Object.keys(validatedData).length === 0) {
        logger.warn('No valid fields provided for update');
        throw new Error('No valid fields provided for update');
      }

      const existing = await this.getShopItem(itemId);

      if (!existing) {
        logger.error(`Shop item with ID ${itemId} not found`);
        throw new Error(`Shop item with ID ${itemId} not found`);
      }

      const { data, error } = await supabaseAdmin
        .from('shop_items')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('item_id', itemId)
        .select();

      if (error) {
        logger.error(
          `[ShopService] Error updating shop item ${itemId}:`,
          error
        );
        throw new Error(`Failed to update shop item: ${error.message}`);
      }

      if (!data || data.length === 0) {
        logger.error(`[ShopService] No rows were updated for item ${itemId}`);
        throw new Error(`Failed to update item ${itemId} - no rows affected`);
      }

      // Invalidate caches
      await this.invalidateShopCaches();
      await redisClient.del(`${CACHE_KEYS.SHOP_ITEM}:${itemId}`);

      logger.info(`[ShopService] Successfully updated shop item: ${itemId}`);
      return data[0];
    } catch (error) {
      logger.error(`[ShopService] Error in updateShopItem:`, error);
      throw error;
    }
  }

  /**
   * Delete a shop item
   *
   * Removes a shop item from the inventory. This is a soft delete operation
   * that marks the item as inactive rather than removing it completely.
   *
   * @static
   * @async
   * @param {string} itemId - The item ID to delete
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws {Error} When item not found or deletion fails
   */
  static async deleteShopItem(itemId) {
    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Invalid item ID provided');
    }

    try {
      // Check if item exists
      const existing = await this.getShopItem(itemId);
      if (!existing) {
        throw new Error(`Shop item with ID ${itemId} not found`);
      }

      const { error } = await supabaseAdmin
        .from('shop_items')
        .delete()
        .eq('item_id', itemId);

      if (error) {
        logger.error(
          `[ShopService] Error deleting shop item ${itemId}: ${error.message}`
        );
        throw new Error(`Failed to delete shop item: ${error.message}`);
      }

      // Invalidate caches
      await this.invalidateShopCaches();
      await redisClient.del(`${CACHE_KEYS.SHOP_ITEM}:${itemId}`);

      logger.info(`[ShopService] Shop item deleted: ${itemId}`);
      return true;
    } catch (error) {
      logger.error(`[ShopService] Error in deleteShopItem: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process a purchase transaction
   *
   * Handles the complete purchase flow including validation, currency deduction,
   * inventory updates, and item delivery to player inventory.
   *
   * @static
   * @async
   * @param {Object} purchaseData - Purchase transaction data
   * @param {string} purchaseData.player_wallet - Player's wallet address
   * @param {string} purchaseData.item_id - Item to purchase
   * @param {number} [purchaseData.quantity=1] - Quantity to purchase
   * @param {boolean} [purchaseData.use_gems=false] - Use gems instead of coins
   * @returns {Promise<Object>} Purchase result with transaction details
   * @throws {Error} When validation fails or insufficient funds
   */
  static async purchaseItem(purchaseData) {
    try {
      // Validate purchase data
      const validatedData = purchaseSchema.parse(purchaseData);
      const { player_wallet, item_id, quantity, use_gems } = validatedData;

      // Get item details
      const item = await this.getShopItem(item_id);
      if (!item) {
        throw new Error(`Shop item ${item_id} not found`);
      }

      // Check item availability
      if (!item.is_active) {
        throw new Error(`Item ${item_id} is no longer available`);
      }

      if (item.available_until && new Date(item.available_until) < new Date()) {
        throw new Error(`Item ${item_id} is no longer available (expired)`);
      }

      // Check stock
      if (item.stock_quantity !== -1 && item.stock_quantity < quantity) {
        throw new Error(
          `Insufficient stock for item ${item_id}. Available: ${item.stock_quantity}`
        );
      }

      // Calculate total cost
      const totalCost = item.price * quantity;
      const currencyType = use_gems ? 'gems' : item.currency_type;

      // Get player currency
      const playerCurrency = await this.getPlayerCurrency(player_wallet);
      const currentAmount =
        currencyType === 'gems' ? playerCurrency.gems : playerCurrency.coins;

      if (currentAmount < totalCost) {
        throw new Error(
          `Insufficient ${currencyType}. Required: ${totalCost}, Available: ${currentAmount}`
        );
      }

      // Start transaction
      const { data: transaction, error: transactionError } = await supabase.rpc(
        'process_shop_purchase',
        {
          p_player_wallet: player_wallet,
          p_item_id: item_id,
          p_quantity: quantity,
          p_total_cost: totalCost,
          p_currency_type: currencyType,
        }
      );

      if (transactionError) {
        console.error(
          `[ShopService] Purchase transaction failed:`,
          transactionError
        );
        throw new Error(`Purchase failed: ${transactionError.message}`);
      }

      // Invalidate relevant caches
      await redisClient.del(`${CACHE_KEYS.PLAYER_CURRENCY}:${player_wallet}`);
      await redisClient.del(`${CACHE_KEYS.PLAYER_INVENTORY}:${player_wallet}`);

      const result = {
        transaction_id: transaction.transaction_id,
        item,
        quantity,
        total_cost: totalCost,
        currency_type: currencyType,
        purchased_at: new Date().toISOString(),
        success: true,
      };

      console.log(
        `[ShopService] Purchase successful: ${player_wallet} bought ${quantity}x ${item_id}`
      );
      return result;
    } catch (error) {
      console.error(`[ShopService] Error in purchaseItem:`, error);
      throw error;
    }
  }

  /**
   * Get player's current currency balances
   *
   * Retrieves the player's coins and gems from the database with Redis caching.
   *
   * @static
   * @async
   * @param {string} playerWallet - Player's wallet address
   * @returns {Promise<Object>} Player's currency balances
   * @throws {Error} When player not found
   */
  static async getPlayerCurrency(playerWallet) {
    if (!playerWallet || typeof playerWallet !== 'string') {
      logger.error('invalid player  wallert provided!');
      throw new Error('Invalid player wallet provided');
    }

    try {
      const cacheKey = `${CACHE_KEYS.PLAYER_CURRENCY}:${playerWallet}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        logger.info(
          `[ShopService] Cache hit for player currency: ${playerWallet}`
        );
        return JSON.parse(cached);
      }

      const { data, error } = await supabase
        .from('players')
        .select('coins, gems')
        .eq('wallet_address', playerWallet)
        .single();

      if (error) {
        logger.error(`[ShopService] Error fetching player currency:${error}`);
        throw new Error(`Failed to fetch player currency: ${error.message}`);
      }

      const result = {
        coins: data?.coins || 0,
        gems: data?.gems || 0,
      };

      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.PLAYER_DATA,
        JSON.stringify(result)
      );
      return result;
    } catch (error) {
      logger.error(`[ShopService] Error in getPlayerCurrency: ${error}`);
      throw error;
    }
  }

  /**
   * Get shop categories with item counts
   *
   * Returns all available shop categories with the number of active items
   * in each category.
   *
   * @static
   * @async
   * @returns {Promise<Array>} Array of categories with item counts
   * @throws {Error} When database query fails
   */
  static async getShopCategories() {
    try {
      const cacheKey = CACHE_KEYS.SHOP_CATEGORIES;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        logger.info(` Cache hit for shop categories`);
        return JSON.parse(cached);
      }

      const { data, error } = await supabase
        .from('shop_items')
        .select('category')
        .eq('is_active', true);

      if (error) {
        logger.error(`Error fetching categories:${error}`);
        throw new Error(`Failed to fetch shop categories: ${error.message}`);
      }

      // Counting items per category
      const categoryCounts = {};
      data.forEach(item => {
        categoryCounts[item.category] =
          (categoryCounts[item.category] || 0) + 1;
      });

      const result = Object.entries(categoryCounts).map(
        ([category, count]) => ({
          category,
          item_count: count,
        })
      );

      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.CATEGORIES,
        JSON.stringify(result)
      );

      logger.info(
        `[ShopService] :: Successfully fetched ${result.length} categories`
      );

      return result;
    } catch (error) {
      logger.error(`[ShopService]:: Error in getShopCategories:${error}`);
      throw error;
    }
  }

  /**
   * Get limited time offers
   *
   * Returns items that are available for a limited time only, sorted by
   * expiration date.
   *
   * @static
   * @async
   * @returns {Promise<Array>} Array of limited time items
   * @throws {Error} When database query fails
   */
  static async getLimitedTimeOffers() {
    try {
      const cacheKey = CACHE_KEYS.LIMITED_ITEMS;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        logger.info(`[ShopService] Cache hit for limited time offers`);
        return JSON.parse(cached);
      }

      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('is_active', true)
        .eq('is_limited_time', true)
        .gt('available_until', new Date().toISOString())
        .order('available_until', { ascending: true });

      if (error) {
        logger.error(`[ShopService] Error fetching limited offers:`, error);
        throw new Error(
          `Failed to fetch limited time offers: ${error.message}`
        );
      }

      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.LIMITED_ITEMS,
        JSON.stringify(data)
      );
      logger.info(
        `[ShopService]:: Successfully fetched ${data.length} limited time offers`
      );

      return data || [];
    } catch (error) {
      logger.info(`[ShopService]::Error in getLimitedTimeOffers:`, error);
      throw error;
    }
  }

  /**
   * Invalidate all shop-related caches
   *
   * Utility method to clear all shop-related Redis cache entries.
   * Used after item updates or administrative changes.
   *
   * @static
   * @async
   * @private
   * @returns {Promise<void>}
   */
  static async invalidateShopCaches() {
    try {
      const pattern = 'shop:*';
      const keys = await redisClient.keys(pattern);

      if (keys.length > 0) {
        await redis.del(...keys);
        logger.info(`[ShopService] Invalidated ${keys.length} cache entries`);
      }
    } catch (error) {
      logger.error(`[ShopService] Error invalidating caches:`, error);
    }
  }
}

export { ShopService };
