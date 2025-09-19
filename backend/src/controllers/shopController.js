import { ShopService } from '../services/shopService.js';
import { logger } from '../../utils/logger.js';

export class ShopController {
  /**
   * Get all shop items with filtering and pagination
   *
   * GET /api/v1/shop/items
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getShopItems(req, res) {
    try {
      const {
        category,
        subcategory,
        min_price,
        max_price,
        available_only,
        page = 1,
        limit = 20,
      } = req.query;

      const options = {
        category,
        subcategory,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined,
        available_only: available_only !== 'false',
        page: parseInt(page),
        limit: parseInt(limit),
      };

      const result = await ShopService.getShopItems(options);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in getShopItems:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shop items',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get a specific shop item by ID
   *
   * GET /api/v1/shop/items/:itemId
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getShopItem(req, res) {
    try {
      const { itemId } = req.params;

      const item = await ShopService.getShopItem(itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Shop item not found',
          timestamp: new Date().toISOString(),
        });
      }

      res.status(200).json({
        success: true,
        data: item,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in getShopItem:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shop item',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Purchase an item from the shop
   *
   * POST /api/v1/shop/purchase
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async purchaseItem(req, res) {
    try {
      // Get player wallet from JWT token
      const playerWallet = req.user?.wallet_address || '0xTESTWALLET123';
      if (!playerWallet) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
      }

      const { item_id, quantity, use_gems = false } = req.body;

      if (!item_id) {
        return res.status(400).json({
          success: false,
          error: 'Item ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      const purchaseData = {
        player_wallet: playerWallet,
        item_id,
        quantity: parseInt(quantity),
        use_gems: Boolean(use_gems),
      };

      const result = await ShopService.purchaseItem(purchaseData);

      res.status(201).json({
        success: true,
        data: result,
        message: `Successfully purchased ${quantity}x ${result.item.name}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in purchaseItem:', error);

      // Handle specific purchase errors
      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;
      else if (error.message.includes('Insufficient')) statusCode = 400;
      else if (error.message.includes('not available')) statusCode = 410;

      res.status(statusCode).json({
        success: false,
        error: 'Purchase failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get player's currency balances
   *
   * GET /api/v1/shop/currency
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getPlayerCurrency(req, res) {
    try {
      const currency = await ShopService.getPlayerCurrency(
        req.body.playerWallet
      );

      res.status(200).json({
        success: true,
        data: currency,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in getPlayerCurrency:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch player currency',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get shop categories with item counts
   *
   * GET /api/v1/shop/categories
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getShopCategories(req, res) {
    try {
      const categories = await ShopService.getShopCategories();

      res.status(200).json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in getShopCategories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch shop categories',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get limited time offers
   *
   * GET /api/v1/shop/limited-offers
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async getLimitedTimeOffers(req, res) {
    try {
      const offers = await ShopService.getLimitedTimeOffers();

      res.status(200).json({
        success: true,
        data: offers,
        count: offers.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('[ShopController]::Error in getLimitedTimeOffers:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to fetch limited time offers',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Create a new shop item
   *
   * POST /api/v1/shop/items
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async createShopItem(req, res) {
    try {
      const item = await ShopService.createShopItem(req.body);

      res.status(201).json({
        success: true,
        data: item,
        message: `Shop item '${item.name}' created successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`[ShopController]::Error in createShopItem:${error}`);

      let statusCode = 500;
      if (error.message.includes('already exists')) statusCode = 409;
      else if (error.message.includes('validation')) statusCode = 400;

      res.status(500).json({
        success: false,
        error: 'Failed to create shop item',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update a shop item
   *
   * PUT /api/v1/shop/items/:itemId
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async updateShopItem(req, res) {
    try {
      const { itemId } = req.params;
      const item = await ShopService.updateShopItem(itemId, req.body);

      res.status(200).json({
        success: true,
        data: item,
        message: `Shop item '${itemId}' updated successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`[ShopController] Error in updateShopItem:${error}`);

      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;
      else if (error.message.includes('validation')) statusCode = 400;

      res.status(statusCode).json({
        success: false,
        error: 'Failed to update shop item',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Admin: Delete a shop item (soft delete)
   *
   * DELETE /api/v1/shop/items/:itemId
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<void>}
   */
  static async deleteShopItem(req, res) {
    try {
      const { itemId } = req.params;
      await ShopService.deleteShopItem(itemId);

      res.status(200).json({
        success: true,
        message: `Shop item ${itemId} deleted successfully`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[ShopController] Error in deleteShopItem:', error);

      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;

      res.status(statusCode).json({
        success: false,
        error: 'Failed to delete shop item',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
