import express from 'express';
import { TransactionController } from '../controllers/transactionController.js';

const router = express.Router();

/**
 * Transaction Routes
 * Handles all transaction-related endpoints for Aqua Stark
 *
 * @author Aqua Stark
 * @version 1.0.0
 * @since 2025-01-XX
 */

// POST /transactions - Create a new transaction
router.post('/', TransactionController.createTransaction);

// GET /transactions/:transaction_id - Get a single transaction by ID
router.get('/:transaction_id', TransactionController.getTransaction);

// GET /transactions/player/:player_wallet - Get all transactions for a player
router.get('/player/:player_wallet', TransactionController.getTransactions);

// PUT /transactions/:transaction_id - Update a transaction by ID
router.put('/:transaction_id', TransactionController.updateTransaction);

// DELETE /transactions/:transaction_id - Delete a transaction by ID
router.delete('/:transaction_id', TransactionController.deleteTransaction);

export default router;
