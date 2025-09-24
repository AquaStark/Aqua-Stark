import { StoreService } from '../services/storeService.js';

/**
 * Store Controller for handling HTTP requests related to store operations
 *
 * @class StoreController
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export class StoreController {
  /**
   * Get all store items with optional filters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStoreItems(req, res) {
    try {
      const filters = {
        type: req.query.type,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice)
          : undefined,
        search: req.query.search,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const items = await StoreService.getStoreItems(filters);

      res.json({
        success: true,
        data: items,
        count: items.length,
        filters: filters,
      });
    } catch (error) {
      console.error('Error in getStoreItems:', error);

      if (error.code === 'FETCH_FAILED' || error.code === 'FETCH_ERROR') {
        return res.status(500).json({
          error: 'Failed to fetch store items',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get a specific store item by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStoreItem(req, res) {
    try {
      const { id } = req.params;

      const item = await StoreService.getStoreItem(id);

      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error('Error in getStoreItem:', error);

      if (error.code === 'ITEM_NOT_FOUND') {
        return res.status(404).json({
          error: 'Store item not found',
          message: error.message,
        });
      }

      if (error.code === 'FETCH_ERROR') {
        return res.status(500).json({
          error: 'Failed to fetch store item',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Create a new store item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createStoreItem(req, res) {
    try {
      const itemData = req.body;

      const newItem = await StoreService.createStoreItem(itemData);

      res.status(201).json({
        success: true,
        data: newItem,
        message: 'Store item created successfully',
      });
    } catch (error) {
      console.error('Error in createStoreItem:', error);

      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({
          error: 'Validation error',
          message: error.message,
        });
      }

      if (error.code === 'CREATE_FAILED' || error.code === 'CREATE_ERROR') {
        return res.status(500).json({
          error: 'Failed to create store item',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update an existing store item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateStoreItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedItem = await StoreService.updateStoreItem(id, updateData);

      res.json({
        success: true,
        data: updatedItem,
        message: 'Store item updated successfully',
      });
    } catch (error) {
      console.error('Error in updateStoreItem:', error);

      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({
          error: 'Validation error',
          message: error.message,
        });
      }

      if (error.code === 'ITEM_NOT_FOUND') {
        return res.status(404).json({
          error: 'Store item not found',
          message: error.message,
        });
      }

      if (error.code === 'UPDATE_FAILED' || error.code === 'UPDATE_ERROR') {
        return res.status(500).json({
          error: 'Failed to update store item',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete a store item (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteStoreItem(req, res) {
    try {
      const { id } = req.params;

      const deletedItem = await StoreService.deleteStoreItem(id);

      res.json({
        success: true,
        data: deletedItem,
        message: 'Store item deleted successfully',
      });
    } catch (error) {
      console.error('Error in deleteStoreItem:', error);

      if (error.code === 'ITEM_NOT_FOUND') {
        return res.status(404).json({
          error: 'Store item not found',
          message: error.message,
        });
      }

      if (error.code === 'DELETE_FAILED' || error.code === 'DELETE_ERROR') {
        return res.status(500).json({
          error: 'Failed to delete store item',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Update item stock
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateItemStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;

      const updatedItem = await StoreService.updateItemStock(id, stock);

      res.json({
        success: true,
        data: updatedItem,
        message: `Item stock updated to ${stock}`,
      });
    } catch (error) {
      console.error('Error in updateItemStock:', error);

      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({
          error: 'Validation error',
          message: error.message,
        });
      }

      if (error.code === 'ITEM_NOT_FOUND') {
        return res.status(404).json({
          error: 'Store item not found',
          message: error.message,
        });
      }

      if (error.code === 'UPDATE_FAILED' || error.code === 'UPDATE_ERROR') {
        return res.status(500).json({
          error: 'Failed to update item stock',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get store statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStoreStats(req, res) {
    try {
      const stats = await StoreService.getStoreStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error in getStoreStats:', error);

      if (error.code === 'STATS_FETCH_FAILED' || error.code === 'STATS_ERROR') {
        return res.status(500).json({
          error: 'Failed to fetch store statistics',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get store items by type
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getStoreItemsByType(req, res) {
    try {
      const { type } = req.params;

      const items = await StoreService.getStoreItems({ type });

      res.json({
        success: true,
        data: items,
        count: items.length,
        type: type,
      });
    } catch (error) {
      console.error('Error in getStoreItemsByType:', error);

      if (error.code === 'FETCH_FAILED' || error.code === 'FETCH_ERROR') {
        return res.status(500).json({
          error: 'Failed to fetch store items',
          message: error.message,
        });
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
