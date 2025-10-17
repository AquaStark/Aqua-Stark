import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the Transaction client.
 *
 * Exposes functions to initiate/process/confirm transactions and query their status.
 *
 * @returns {Object} An object containing methods for managing transactions:
 * - `initiateTransaction(account, player, eventTypeId, payload)`
 * - `processTransaction(account, transactionId)`
 * - `confirmTransaction(account, transactionId, confirmationHash)`
 * - `getTransactionStatus(transactionId)`
 * - `isTransactionConfirmed(transactionId)`
 *
 * @example
 * const {
 *   initiateTransaction,
 *   getTransactionStatus,
 *   confirmTransaction
 * } = useTransaction();
 *
 * // Initiate a transaction
 * const txId = await initiateTransaction(account, "0xPlayer", 1, ["payload1", "payload2"]);
 *
 * // Check transaction status
 * const status = await getTransactionStatus(txId);
 *
 * // Confirm a transaction
 * await confirmTransaction(account, txId, "0xConfirmationHash");
 */
export const useTransaction = () => {
  const { client } = useDojoSDK();

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
      return await client.Transaction.initiate_transaction(
        account,
        player,
        eventTypeId,
        payload
      );
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
      return await client.Transaction.process_transaction(
        account,
        transactionId
      );
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
      return await client.Transaction.confirm_transaction(
        account,
        transactionId,
        confirmationHash
      );
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
      return await client.Transaction.get_transaction_status(transactionId);
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
      return await client.Transaction.is_transaction_confirmed(transactionId);
    },
    [client]
  );

  return {
    initiateTransaction,
    processTransaction,
    confirmTransaction,
    getTransactionStatus,
    isTransactionConfirmed,
  };
};
