import { supabase, supabaseAdmin, TABLES } from '../config/supabase.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';
import { logger } from '../../utils/logger.js';
import { ServiceError } from '../../utils/errors.js';

/**
 * Store Service for managing store items and operations
 *
 * @class StoreService
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export class StoreService {
  /**
   * Get all active store items with stock
   * @param {Object} filters - Optional filters for items
   * @returns {Promise<Array>} Array of store items
   */
  static async getStoreItems(filters = {}) {
    try {
      logger.info({ filters }, 'Fetching store items');

      // Check cache first
      const cacheKey = CACHE_KEYS.STORE_ITEMS(JSON.stringify(filters));
      const cachedItems = await redisClient.get(cacheKey);

      if (cachedItems) {
        logger.debug('Cache hit for store items');
        return JSON.parse(cachedItems);
      }

      let query = supabase
        .from(TABLES.STORE_ITEMS)
        .select('*')
        .eq('is_active', true)
        .gt('stock', 0)
        .order('type', { ascending: true })
        .order('price', { ascending: true });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error({ filters, error }, 'Error fetching store items');
        throw new ServiceError(
          'FETCH_FAILED',
          'Failed to fetch store items',
          500
        );
      }

      // Cache the results
      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.STORE_ITEMS,
        JSON.stringify(data)
      );

      logger.debug({ count: data.length }, 'Store items fetched successfully');
      return data;
    } catch (error) {
      logger.error({ filters, error }, 'Error getting store items');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('FETCH_ERROR', 'Failed to get store items', 500);
    }
  }

  /**
   * Get a specific store item by ID
   * @param {string} itemId - The item ID
   * @returns {Promise<Object>} Store item data
   */
  static async getStoreItem(itemId) {
    try {
      logger.info({ itemId }, 'Fetching store item');

      const { data, error } = await supabase
        .from(TABLES.STORE_ITEMS)
        .select('*')
        .eq('id', itemId)
        .eq('is_active', true)
        .single();

      if (error) {
        logger.error({ itemId, error }, 'Error fetching store item');
        throw new ServiceError('ITEM_NOT_FOUND', 'Store item not found', 404);
      }

      logger.debug({ itemId }, 'Store item fetched successfully');
      return data;
    } catch (error) {
      logger.error({ itemId, error }, 'Error getting store item');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError('FETCH_ERROR', 'Failed to get store item', 500);
    }
  }

  /**
   * Create a new store item
   * @param {Object} itemData - Item data
   * @returns {Promise<Object>} Created item data
   */
  static async createStoreItem(itemData) {
    try {
      logger.info({ itemData }, 'Creating store item');

      // Validate required fields
      const requiredFields = [
        'name',
        'description',
        'price',
        'type',
        'image_url',
      ];
      for (const field of requiredFields) {
        if (!itemData[field]) {
          throw new ServiceError(
            'VALIDATION_ERROR',
            `${field} is required`,
            400
          );
        }
      }

      // Validate price
      if (itemData.price < 0) {
        throw new ServiceError(
          'VALIDATION_ERROR',
          'Price must be non-negative',
          400
        );
      }

      // Validate type
      const validTypes = ['fish', 'decoration', 'food', 'other'];
      if (!validTypes.includes(itemData.type)) {
        throw new ServiceError('VALIDATION_ERROR', 'Invalid item type', 400);
      }

      const { data, error } = await supabaseAdmin
        .from(TABLES.STORE_ITEMS)
        .insert({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          type: itemData.type,
          stock: itemData.stock || 0,
          image_url: itemData.image_url,
          is_active:
            itemData.is_active !== undefined ? itemData.is_active : true,
        })
        .select()
        .single();

      if (error) {
        logger.error({ itemData, error }, 'Error creating store item');
        throw new ServiceError(
          'CREATE_FAILED',
          'Failed to create store item',
          500
        );
      }

      // Clear cache
      await this.clearStoreItemsCache();

      logger.info({ itemId: data.id }, 'Store item created successfully');
      return data;
    } catch (error) {
      logger.error({ itemData, error }, 'Error creating store item');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'CREATE_ERROR',
        'Failed to create store item',
        500
      );
    }
  }

  /**
   * Update an existing store item
   * @param {string} itemId - The item ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated item data
   */
  static async updateStoreItem(itemId, updateData) {
    try {
      logger.info({ itemId, updateData }, 'Updating store item');

      // Validate price if provided
      if (updateData.price !== undefined && updateData.price < 0) {
        throw new ServiceError(
          'VALIDATION_ERROR',
          'Price must be non-negative',
          400
        );
      }

      // Validate type if provided
      if (updateData.type) {
        const validTypes = ['fish', 'decoration', 'food', 'other'];
        if (!validTypes.includes(updateData.type)) {
          throw new ServiceError('VALIDATION_ERROR', 'Invalid item type', 400);
        }
      }

      const { data, error } = await supabaseAdmin
        .from(TABLES.STORE_ITEMS)
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        logger.error(
          { itemId, updateData, error },
          'Error updating store item'
        );
        throw new ServiceError(
          'UPDATE_FAILED',
          'Failed to update store item',
          500
        );
      }

      if (!data) {
        throw new ServiceError('ITEM_NOT_FOUND', 'Store item not found', 404);
      }

      // Clear cache
      await this.clearStoreItemsCache();

      logger.info({ itemId }, 'Store item updated successfully');
      return data;
    } catch (error) {
      logger.error({ itemId, updateData, error }, 'Error updating store item');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'UPDATE_ERROR',
        'Failed to update store item',
        500
      );
    }
  }

  /**
   * Delete a store item (soft delete by setting is_active to false)
   * @param {string} itemId - The item ID
   * @returns {Promise<Object>} Deleted item data
   */
  static async deleteStoreItem(itemId) {
    try {
      logger.info({ itemId }, 'Deleting store item');

      const { data, error } = await supabaseAdmin
        .from(TABLES.STORE_ITEMS)
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        logger.error({ itemId, error }, 'Error deleting store item');
        throw new ServiceError(
          'DELETE_FAILED',
          'Failed to delete store item',
          500
        );
      }

      if (!data) {
        throw new ServiceError('ITEM_NOT_FOUND', 'Store item not found', 404);
      }

      // Clear cache
      await this.clearStoreItemsCache();

      logger.info({ itemId }, 'Store item deleted successfully');
      return data;
    } catch (error) {
      logger.error({ itemId, error }, 'Error deleting store item');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'DELETE_ERROR',
        'Failed to delete store item',
        500
      );
    }
  }

  /**
   * Update item stock
   * @param {string} itemId - The item ID
   * @param {number} newStock - New stock amount
   * @returns {Promise<Object>} Updated item data
   */
  static async updateItemStock(itemId, newStock) {
    try {
      logger.info({ itemId, newStock }, 'Updating item stock');

      if (newStock < 0) {
        throw new ServiceError(
          'VALIDATION_ERROR',
          'Stock cannot be negative',
          400
        );
      }

      const { data, error } = await supabaseAdmin
        .from(TABLES.STORE_ITEMS)
        .update({
          stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        logger.error({ itemId, newStock, error }, 'Error updating item stock');
        throw new ServiceError(
          'UPDATE_FAILED',
          'Failed to update item stock',
          500
        );
      }

      if (!data) {
        throw new ServiceError('ITEM_NOT_FOUND', 'Store item not found', 404);
      }

      // Clear cache
      await this.clearStoreItemsCache();

      logger.info({ itemId, newStock }, 'Item stock updated successfully');
      return data;
    } catch (error) {
      logger.error({ itemId, newStock, error }, 'Error updating item stock');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'UPDATE_ERROR',
        'Failed to update item stock',
        500
      );
    }
  }

  /**
   * Get store statistics
   * @returns {Promise<Object>} Store statistics
   */
  static async getStoreStats() {
    try {
      logger.info('Getting store statistics');

      const { data, error } = await supabase
        .from(TABLES.STORE_ITEMS)
        .select('type, price, stock, is_active');

      if (error) {
        logger.error({ error }, 'Error fetching store statistics');
        throw new ServiceError(
          'STATS_FETCH_FAILED',
          'Failed to fetch store statistics',
          500
        );
      }

      const stats = {
        totalItems: data.length,
        activeItems: data.filter(item => item.is_active).length,
        totalValue: data.reduce(
          (sum, item) => sum + item.price * item.stock,
          0
        ),
        typeDistribution: data.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {}),
        priceRange: {
          min: Math.min(...data.map(item => item.price)),
          max: Math.max(...data.map(item => item.price)),
          average:
            data.reduce((sum, item) => sum + item.price, 0) / data.length || 0,
        },
        lowStockItems: data.filter(item => item.stock < 10 && item.is_active)
          .length,
      };

      logger.debug({ stats }, 'Store statistics calculated');
      return stats;
    } catch (error) {
      logger.error({ error }, 'Error getting store statistics');
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        'STATS_ERROR',
        'Failed to get store statistics',
        500
      );
    }
  }

  /**
   * Clear store items cache
   * @private
   */
  static async clearStoreItemsCache() {
    try {
      const pattern = CACHE_KEYS.STORE_ITEMS('*');
      const keys = await redisClient.keys(pattern);

      if (keys.length > 0) {
        await redisClient.del(...keys);
        logger.debug({ keysCount: keys.length }, 'Store items cache cleared');
      }
    } catch (error) {
      logger.error({ error }, 'Error clearing store items cache');
    }
  }
}
