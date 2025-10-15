import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the Session client.
 *
 * Exposes functions to create/validate/renew/revoke sessions and query session details.
 *
 * @returns {Object} An object containing methods for managing sessions:
 * - `createSessionKey(account, duration, maxTransactions, sessionType)`
 * - `validateSession(sessionId)`
 * - `renewSession(account, sessionId, newDuration, newMaxTx)`
 * - `revokeSession(account, sessionId)`
 * - `getSessionInfo(sessionId)`
 * - `calculateSessionTimeRemaining(sessionId)`
 * - `checkSessionNeedsRenewal(sessionId)`
 * - `calculateRemainingTransactions(sessionId)`
 *
 * @example
 * const {
 *   createSessionKey,
 *   validateSession,
 *   renewSession
 * } = useSession();
 *
 * // Create a new session key
 * const sessionId = await createSessionKey(account, 3600, 100, 1);
 *
 * // Validate a session
 * const isValid = await validateSession(sessionId);
 *
 * // Renew a session
 * await renewSession(account, sessionId, 7200, 50);
 */
export const useSession = () => {
  const { client } = useDojoSDK();

  /**
   * Creates a new session key with specified parameters.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} duration - Session duration in seconds.
   * @param {BigNumberish} maxTransactions - Maximum number of transactions allowed.
   * @param {number} sessionType - Type of session (u8).
   * @returns {Promise<string>} The session ID.
   */
  const createSessionKey = useCallback(
    async (
      account: Account | AccountInterface,
      duration: BigNumberish,
      maxTransactions: BigNumberish,
      sessionType: number
    ) => {
      return await client.Session.create_session_key(account, duration, maxTransactions, sessionType);
    },
    [client]
  );

  /**
   * Validates an existing session.
   * @param {string} sessionId - Session ID to validate.
   * @returns {Promise<boolean>} Validation status.
   */
  const validateSession = useCallback(
    async (sessionId: string) => {
      return await client.Session.validate_session(sessionId);
    },
    [client]
  );

  /**
   * Renews an existing session with new parameters.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} sessionId - Session ID to renew.
   * @param {BigNumberish} newDuration - New duration in seconds.
   * @param {BigNumberish} newMaxTx - New maximum transactions.
   * @returns {Promise<boolean>} Success status.
   */
  const renewSession = useCallback(
    async (
      account: Account | AccountInterface,
      sessionId: string,
      newDuration: BigNumberish,
      newMaxTx: BigNumberish
    ) => {
      return await client.Session.renew_session(account, sessionId, newDuration, newMaxTx);
    },
    [client]
  );

  /**
   * Revokes an existing session.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} sessionId - Session ID to revoke.
   * @returns {Promise<boolean>} Success status.
   */
  const revokeSession = useCallback(
    async (
      account: Account | AccountInterface,
      sessionId: string
    ) => {
      return await client.Session.revoke_session(account, sessionId);
    },
    [client]
  );

  /**
   * Retrieves detailed information about a session.
   * @param {string} sessionId - Session ID.
   * @returns {Promise<models.SessionKey>} Session info.
   */
  const getSessionInfo = useCallback(
    async (sessionId: string) => {
      return await client.Session.get_session_info(sessionId);
    },
    [client]
  );

  /**
   * Calculates the remaining time for a session.
   * @param {string} sessionId - Session ID.
   * @returns {Promise<BigNumberish>} Remaining time in seconds.
   */
  const calculateSessionTimeRemaining = useCallback(
    async (sessionId: string) => {
      return await client.Session.calculate_session_time_remaining(sessionId);
    },
    [client]
  );

  /**
   * Checks if a session needs renewal.
   * @param {string} sessionId - Session ID.
   * @returns {Promise<boolean>} Renewal needed status.
   */
  const checkSessionNeedsRenewal = useCallback(
    async (sessionId: string) => {
      return await client.Session.check_session_needs_renewal(sessionId);
    },
    [client]
  );

  /**
   * Calculates the remaining transactions allowed for a session.
   * @param {string} sessionId - Session ID.
   * @returns {Promise<number>} Remaining transactions.
   */
  const calculateRemainingTransactions = useCallback(
    async (sessionId: string) => {
      return await client.Session.calculate_remaining_transactions(sessionId);
    },
    [client]
  );

  return {
    createSessionKey,
    validateSession,
    renewSession,
    revokeSession,
    getSessionInfo,
    calculateSessionTimeRemaining,
    checkSessionNeedsRenewal,
    calculateRemainingTransactions,
  };
};