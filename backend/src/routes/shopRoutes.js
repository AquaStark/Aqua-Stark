import express from 'express';
import { ShopController } from '../controllers/shopController.js';
import { simpleAuth, validateOwnership } from '../middleware/auth.js';
import { rateLimitPresets } from '../middleware/rateLimiting.js';

const router = express.Router();
router.use(rateLimitPresets.authenticated);

/**
 * Public Routes
 */
router.get('/items', ShopController.getShopItems);

router.get('/items/:itemId', ShopController.getShopItem);

router.get('/categories', ShopController.getShopCategories);

router.get('/limited-offers', ShopController.getLimitedTimeOffers);

/**
 * Authenticated Player Routes
 */
router.get(
  '/currency',
  simpleAuth,
  validateOwnership('player'),
  ShopController.getPlayerCurrency
);

router.post(
  '/purchase',
  simpleAuth,
  validateOwnership('player'),
  ShopController.purchaseItem
);

/**
 * Admin
 */

router.post('/items', simpleAuth, ShopController.createShopItem);

router.put('/items/:itemId', simpleAuth, ShopController.updateShopItem);

router.delete('/items/:itemId', simpleAuth, ShopController.deleteShopItem);

export default router;
