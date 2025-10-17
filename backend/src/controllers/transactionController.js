import { TransactionService } from '../services/transactionService.js';
import { logger } from '../../utils/logger.js';

/**
 * TransactionController
 * Handles API requests for shop transactions
 *
 * @class TransactionController
 * @author Aqua Stark
 * @version 1.0.2
 * @since 1.0.0
 */
export class TransactionController {
  /**
   * Create a new transaction
   *
   * @async
   * @function createTransaction
   * @param {import('express').Request} req - Express request object containing transaction data in body
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with transaction details or error
   */
  static async createTransaction(req, res) {
    try {
      const result = await TransactionService.CreateTransaction(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: 'Failed to create transaction',
          message: result.error,
        });
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: 'Transaction created successfully',
      });
    } catch (err) {
      logger.error('createTransaction error:', err.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message });
    }
  }

  /**
   * Get a single transaction by ID
   *
   * @async
   * @function getTransaction
   * @param {import('express').Request} req - Express request object containing `transaction_id` in params
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with transaction details or error
   */
  static async getTransaction(req, res) {
    try {
      const { transaction_id } = req.params;
      const result = await TransactionService.GetTransaction(transaction_id);

      if (!result.success) {
        return res.status(404).json({
          error: 'Transaction not found',
          message: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (err) {
      logger.error('getTransaction error:', err.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message });
    }
  }

  /**
   * Get all transactions for a specific player
   *
   * @async
   * @function getTransactions
   * @param {import('express').Request} req - Express request object containing `player_wallet` in params
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with list of transactions and count or error
   */
  static async getTransactions(req, res) {
    try {
      const { player_wallet } = req.params;
      const result = await TransactionService.GetTransactions(player_wallet);

      if (!result.success) {
        return res.status(404).json({
          error: 'Transactions not found',
          message: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
      });
    } catch (err) {
      logger.error('getTransactions error:', err.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message });
    }
  }

  /**
   * Update a transaction
   *
   * @async
   * @function updateTransaction
   * @param {import('express').Request} req - Express request object containing `transaction_id` in params and update fields in body
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response with updated transaction or error
   */
  static async updateTransaction(req, res) {
    try {
      const { transaction_id } = req.params;
      const result = await TransactionService.UpdateTransaction(
        transaction_id,
        req.body
      );

      if (!result.success) {
        return res.status(400).json({
          error: 'Failed to update transaction',
          message: result.error,
        });
      }

      res.json({
        success: true,
        data: result.data,
        message: 'Transaction updated successfully',
      });
    } catch (err) {
      logger.error('updateTransaction error:', err.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message });
    }
  }

  /**
   * Delete a transaction
   *
   * @async
   * @function deleteTransaction
   * @param {import('express').Request} req - Express request object containing `transaction_id` in params
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<void>} Sends JSON response confirming deletion or error
   */
  static async deleteTransaction(req, res) {
    try {
      const { transaction_id } = req.params;
      const result = await TransactionService.DeleteTransaction(transaction_id);

      if (!result.success) {
        return res.status(400).json({
          error: 'Failed to delete transaction',
          message: result.error,
        });
      }

      res.json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (err) {
      logger.error('deleteTransaction error:', err.message);
      res
        .status(500)
        .json({ error: 'Internal server error', message: err.message });
    }
  }
}
