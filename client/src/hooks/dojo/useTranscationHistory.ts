import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the TransactionHistory client.
 *
 * Exposes functions to register event types, log events, query event types and transaction history,
 * and manage transaction lifecycles.
 *
 * @returns {Object} An object containing methods for managing transaction history:
 * - `registerEventType(account, eventName)`
 * - `logEvent(account, eventTypeId, player, payload)`
 * - `getEventTypesCount()`
 * - `getAllEventTypes()`
 * - `getEventTypeDetails(eventTypeId)`
 * - `getTransactionCount()`
 * - `getTransactionHistory(player?, eventTypeId?, start?, limit?, startTimestamp?, endTimestamp?)`
 * - `initiateTransaction(account, player, eventTypeId, payload)`
 * - `processTransaction(account, transactionId)`
 * - `confirmTransaction(account, transactionId, confirmationHash)`
 * - `getTransactionStatus(transactionId)`
 * - `isTransactionConfirmed(transactionId)`
 *
 * @example
 * const {
 *   registerEventType,
 *   logEvent,
 *   getTransactionHistory,
 *   initiateTransaction
 * } = useTransactionHistory();
 *
 * // Register a new event type
 * const typeId = await registerEventType(account, "FishBred");
 *
 * // Log an event
 * await logEvent(account, typeId, "0xPlayer", ["fish_id:1", "parent1:2"]);
 *
 * // Fetch transaction history
 * const history = await getTransactionHistory("0xPlayer", null, null, 0, 10);
 *
 * // Initiate a transaction
 * const txId = await initiateTransaction(account, "0xPlayer", typeId, ["payload1"]);
 */
export const useTransactionHistory = () => {
  const { client } = useDojoSDK();

  /**
   * Registers a new event type.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} eventName - Name of the event type (ByteArray as string).
   * @returns {Promise<BigNumberish>} The new event type ID.
   */
  const registerEventType = useCallback(
    async (
      account: Account | AccountInterface,
      eventName: string
    ) => {
      return await client.TransactionHistory.register_event_type(account, eventName);
    },
    [client]
  );

  /**
   * Logs an event for a player.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} eventTypeId - Event type ID.
   * @param {string} player - Address of the player.
   * @param {string[]} payload - Array of payload strings.
   * @returns {Promise<models.TransactionLog>} The logged transaction log.
   */
  const logEvent = useCallback(
    async (
      account: Account | AccountInterface,
      eventTypeId: BigNumberish,
      player: string,
      payload: string[]
    ) => {
      return await client.TransactionHistory.log_event(account, eventTypeId, player, payload);
    },
    [client]
  );

  /**
   * Retrieves the total count of event types.
   * @returns {Promise<BigNumberish>} Event types count.
   */
  const getEventTypesCount = useCallback(async () => {
    return await client.TransactionHistory.get_event_types_count();
  }, [client]);

  /**
   * Retrieves all registered event types.
   * @returns {Promise<models.EventTypeDetails[]>} Array of event type details.
   */
  const getAllEventTypes = useCallback(async () => {
    return await client.TransactionHistory.get_all_event_types();
  }, [client]);

  /**
   * Retrieves details for a specific event type.
   * @param {BigNumberish} eventTypeId - Event type ID.
   * @returns {Promise<models.EventTypeDetails>} Event type details.
   */
  const getEventTypeDetails = useCallback(
    async (eventTypeId: BigNumberish) => {
      return await client.TransactionHistory.get_event_type_details(eventTypeId);
    },
    [client]
  );

  /**
   * Retrieves the total count of transactions.
   * @returns {Promise<BigNumberish>} Transaction count.
   */
  const getTransactionCount = useCallback(async () => {
    return await client.TransactionHistory.get_transaction_count();
  }, [client]);

  /**
   * Retrieves transaction history with optional filters.
   * @param {string | null} player - Optional player address.
   * @param {BigNumberish | null} eventTypeId - Optional event type ID.
   * @param {number | null} start - Optional starting index.
   * @param {number | null} limit - Optional limit.
   * @param {BigNumberish | null} startTimestamp - Optional start timestamp.
   * @param {BigNumberish | null} endTimestamp - Optional end timestamp.
   * @returns {Promise<models.TransactionLog[]>} Array of transaction logs.
   */
  const getTransactionHistory = useCallback(
    async (
      player: string | null,
      eventTypeId: BigNumberish | null,
      start: number | null,
      limit: number | null,
      startTimestamp: BigNumberish | null,
      endTimestamp: BigNumberish | null
    ) => {
      return await client.TransactionHistory.get_transaction_history(
        player,
        eventTypeId,
        start,
        limit,
        startTimestamp,
        endTimestamp
      );
    },
    [client]
  );

  /**
   * Initiates a new transaction for a player.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} player - Address of the player.
   * @param {BigNumberish} eventTypeId - Type ID of the event.
   * @param {string[]} payload - Array of payload strings.
   * @returns {Promise<BigNumberish>} The transaction ID.
   */
  const initiateTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      player: string,
      eventTypeId: BigNumberish,
      payload: string[]
    ) => {
      return await client.TransactionHistory.initiate_transaction(account, player, eventTypeId, payload);
    },
    [client]
  );

  /**
   * Processes a pending transaction.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} transactionId - ID of the transaction to process.
   * @returns {Promise<boolean>} Success status.
   */
  const processTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      transactionId: BigNumberish
    ) => {
      return await client.TransactionHistory.process_transaction(account, transactionId);
    },
    [client]
  );

  /**
   * Confirms a transaction with a hash.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} transactionId - ID of the transaction to confirm.
   * @param {string} confirmationHash - Confirmation hash.
   * @returns {Promise<boolean>} Success status.
   */
  const confirmTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      transactionId: BigNumberish,
      confirmationHash: string
    ) => {
      return await client.TransactionHistory.confirm_transaction(account, transactionId, confirmationHash);
    },
    [client]
  );

  /**
   * Retrieves the status of a transaction.
   * @param {BigNumberish} transactionId - Transaction ID.
   * @returns {Promise<string>} Transaction status.
   */
  const getTransactionStatus = useCallback(
    async (transactionId: BigNumberish) => {
      return await client.TransactionHistory.get_transaction_status(transactionId);
    },
    [client]
  );

  /**
   * Checks if a transaction is confirmed.
   * @param {BigNumberish} transactionId - Transaction ID.
   * @returns {Promise<boolean>} Confirmation status.
   */
  const isTransactionConfirmed = useCallback(
    async (transactionId: BigNumberish) => {
      return await client.TransactionHistory.is_transaction_confirmed(transactionId);
    },
    [client]
  );

  return {
    registerEventType,
    logEvent,
    getEventTypesCount,
    getAllEventTypes,
    getEventTypeDetails,
    getTransactionCount,
    getTransactionHistory,
    initiateTransaction,
    processTransaction,
    confirmTransaction,
    getTransactionStatus,
    isTransactionConfirmed,
  };
};