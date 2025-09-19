import express from 'express';
import { StoreController } from '../controllers/storeController.js';

const router = express.Router();

/**
 * Store Routes
 * Handles all store-related endpoints for Aqua Stark
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */

// GET /store/items - Get all store items with optional filters
router.get('/items', StoreController.getStoreItems);

// GET /store/items/stats - Get store statistics
router.get('/items/stats', StoreController.getStoreStats);

// GET /store/items/type/:type - Get store items by type
router.get('/items/type/:type', StoreController.getStoreItemsByType);

// GET /store/items/:id - Get a specific store item
router.get('/items/:id', StoreController.getStoreItem);

// POST /store/items - Create a new store item
router.post('/items', StoreController.createStoreItem);

// PUT /store/items/:id - Update an existing store item
router.put('/items/:id', StoreController.updateStoreItem);

// PATCH /store/items/:id/stock - Update item stock
router.patch('/items/:id/stock', StoreController.updateItemStock);

// DELETE /store/items/:id - Delete a store item (soft delete)
router.delete('/items/:id', StoreController.deleteStoreItem);

export default router;
