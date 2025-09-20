import { supabaseAdmin, TABLES } from '../config/supabase.js';
import { logger } from '../../utils/logger.js';
import { TransactionSchema } from '../../utils/validators.js';
import { redisClient, CACHE_KEYS, CACHE_TTL } from '../config/redis.js';
import { z } from 'zod';
import e from 'express';

const transactionIdSchema = z.string().min(1, 'transaction_id is required');
const playerWalletSchema = z.string().min(1, 'player_wallet is required');
const TransactionUpdateSchema = TransactionSchema.partial();

export class TransactionService {
  /**
   * Create a new transaction
   * @param {object} payload - Transaction data to insert
   * @returns {Promise<object>} Result object with success flag and inserted transaction or error
   */
  static async CreateTransaction(payload) {
    try {
      const validated = TransactionSchema.parse(payload);

      const { data: inserted, error } = await supabaseAdmin
        .from(TABLES.TRANSACTIONS)
        .insert(validated)
        .select()
        .single();

      if (error) {
        logger.error(
          `[TnxService]:: Failed to insert payload to DB: ${error.message}`
        );
        throw new Error(error.message);
      }

      logger.info(
        `[TnxService]::Transaction created for wallet ${validated.player_wallet}, item ${validated.item_id}`
      );

      // Invalidate cache for player transactions
      await redisClient.del(
        CACHE_KEYS.PLAYER_TRANSACTIONS(validated.player_wallet)
      );

      return { success: true, data: inserted };
    } catch (err) {
      logger.error('[TrnxService]::CreateTransaction failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Get a single transaction by ID (with Redis cache fallback)
   * @param {string} transaction_id - Transaction identifier
   * @returns {Promise<object>} Result object with success flag and transaction data or error
   */
  static async GetTransaction(transaction_id) {
    try {
      const validatedId = transactionIdSchema.parse(transaction_id);
      const cacheKey = CACHE_KEYS.TRANSACTION(validatedId);

      // Check Redis cache first
      logger.info(
        `[TrnxService]:: Checking Tnx : ${validatedId} exist in Cache !`
      );
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`[TrnxService]::Cache hit Transaction ${validatedId}`);
        return { success: true, data: JSON.parse(cached) };
      }

      // Query database if not in cache
      logger.info(
        `[TrnxService]:: Checking Tnx : ${validatedId} exist in Database !`
      );
      const { data, error } = await supabaseAdmin
        .from(TABLES.TRANSACTIONS)
        .select('*')
        .eq('transaction_id', validatedId);

      if (error) {
        logger.error(
          `[TrnxService]::Failed to fetch Tnx :: ${JSON.stringify(error)}`
        );
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        logger.info(`[TrnxService]::Transaction ${validatedId} not found`);
        return { success: false, error: 'Transaction not found' };
      }

      // Cache result for future lookups
      logger.info('[TrnxService]::Storing Tnx into Cache !');
      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.TRANSACTION,
        JSON.stringify(data[0])
      );

      return { success: true, data: data[0] };
    } catch (err) {
      logger.error(`[TrnxService]::GetTransaction failed:${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Get all transactions for a specific player (with Redis cache fallback)
   * @param {string} player_wallet - Wallet address of the player
   * @returns {Promise<object>} Result object with success flag and array of transactions or error
   */
  static async GetTransactions(player_wallet) {
    try {
      const validatedWallet = playerWalletSchema.parse(player_wallet);
      const cacheKey = CACHE_KEYS.PLAYER_TRANSACTIONS(validatedWallet);

      // Check Redis cache first
      logger.info(
        `[TrnxService]:: Checking Cache, Is ${validatedWallet} Transactions exist in Cache !`
      );
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(
          `[TrnxService]:: Cache Found ${validatedWallet} transactions !`
        );
        return { success: true, data: JSON.parse(cached) };
      }

      // Query database if not in cache
      logger.info(
        `[TrnxService]:: Checking DB ,Is ${validatedWallet} Transactions exist in DB !`
      );
      const { data, error } = await supabaseAdmin
        .from(TABLES.TRANSACTIONS)
        .select('*')
        .eq('player_wallet', validatedWallet)
        .order('transaction_date', { ascending: false });

      if (error) {
        logger.error(
          `[TrnxService]:: Failed to fetch player transactions in DB :: ${error.message}`
        );
        throw new Error(error.message);
      }

      // Cache result for future lookups
      logger.info(`[TrnxService]:: Storing Player Trnx in Cache !`);
      await redisClient.setEx(
        cacheKey,
        CACHE_TTL.PLAYER_TRANSACTIONS,
        JSON.stringify(data)
      );

      return { success: true, data };
    } catch (err) {
      logger.error(`[TrnxService]:: GetTransactions failed:${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Update a transaction (Admin only)
   * @param {string} transaction_id - Transaction identifier
   * @param {object} updates - Fields to update in the transaction
   * @returns {Promise<object>} Result object with success flag and updated transaction or error
   */
  static async UpdateTransaction(transaction_id, updates) {
    try {
      const validatedId = transactionIdSchema.parse(transaction_id);
      const validatedUpdates = TransactionUpdateSchema.parse(updates);

      const { data, error } = await supabaseAdmin
        .from(TABLES.TRANSACTIONS)
        .update({
          ...validatedUpdates,
        })
        .eq('transaction_id', validatedId)
        .select()
        .single();

      if (error) {
        logger.error(
          `[trnxService]:: Failed to update transaction : ${error.message}`
        );
        throw new Error(error.message);
      }

      logger.info(`Transaction ${validatedId} updated`);

      // Invalidate cache for this transaction and player transactions
      await redisClient.del(CACHE_KEYS.TRANSACTION(validatedId));
      if (data?.player_wallet) {
        await redisClient.del(
          CACHE_KEYS.PLAYER_TRANSACTIONS(data.player_wallet)
        );
      }

      return { success: true, data };
    } catch (err) {
      logger.error(`UpdateTransaction failed :: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Delete a transaction (Admin only)
   * @param {string} transaction_id - Transaction identifier
   * @returns {Promise<object>} Result object with success flag or error
   */
  static async DeleteTransaction(transaction_id) {
    try {
      const validatedId = transactionIdSchema.parse(transaction_id);

      // Fetch existing transaction (to clear player cache later)
      logger.info('[Trnx]:: Fetch existing transaction ');
      const existing = await this.GetTransaction(validatedId);

      if (existing?.error) {
        logger.warn('Transaction already deleted from DB or not exist');
        throw new Error('Transaction not exist in DB');
      }

      logger.info('[Trnx]:: Start deleting Trnx From DB');
      const { error } = await supabaseAdmin
        .from(TABLES.TRANSACTIONS)
        .delete()
        .eq('transaction_id', validatedId);

      if (error) {
        logger.error(`[Trnx]:: Failed to Delete transaction from DB ${error}`);
        throw new Error(error.message);
      }

      logger.info(`[Trnx]:: Transaction ${validatedId} successfully deleted`);

      // Invalidate cache for transaction and player transactions
      logger.info('[Trnx]:: Remmove data form Cache memory');
      await redisClient.del(CACHE_KEYS.TRANSACTION(validatedId));
      if (existing?.data?.player_wallet) {
        await redisClient.del(
          CACHE_KEYS.PLAYER_TRANSACTIONS(existing.data.player_wallet)
        );
      }

      return { success: true };
    } catch (err) {
      logger.error('DeleteTransaction failed:', err.message);
      return { success: false, error: err.message };
    }
  }
}
