import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client || !client.session) {
    throw new Error('session contract not found in Dojo client');
  }
}

/**
 * React hook for Session contract interactions.
 * Provides methods for managing user sessions including creation, validation, renewal, and revocation.
 * 
 * @returns Object containing all session management functions
 */
export const useSessionEnhanced = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);

  // Session Management
  const createSessionKey = useCallback(
    async (account: Account | AccountInterface, duration: BigNumberish, maxTransactions: BigNumberish, sessionType: BigNumberish) => {
      ensureClientReady();
      return await client.session.createSessionKey(account, duration, maxTransactions, sessionType);
    },
    [client, ensureClientReady]
  );

  const renewSession = useCallback(
    async (account: Account | AccountInterface, sessionId: BigNumberish, newDuration: BigNumberish, newMaxTx: BigNumberish) => {
      ensureClientReady();
      return await client.session.renewSession(account, sessionId, newDuration, newMaxTx);
    },
    [client, ensureClientReady]
  );

  const revokeSession = useCallback(
    async (account: Account | AccountInterface, sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.revokeSession(account, sessionId);
    },
    [client, ensureClientReady]
  );

  const validateSession = useCallback(
    async (account: Account | AccountInterface, sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.validateSession(account, sessionId);
    },
    [client, ensureClientReady]
  );

  // Session Queries
  const getSessionInfo = useCallback(
    async (sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.getSessionInfo(sessionId);
    },
    [client, ensureClientReady]
  );

  const calculateRemainingTransactions = useCallback(
    async (sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.calculateRemainingTransactions(sessionId);
    },
    [client, ensureClientReady]
  );

  const calculateSessionTimeRemaining = useCallback(
    async (sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.calculateSessionTimeRemaining(sessionId);
    },
    [client, ensureClientReady]
  );

  const checkSessionNeedsRenewal = useCallback(
    async (sessionId: BigNumberish) => {
      ensureClientReady();
      return await client.session.checkSessionNeedsRenewal(sessionId);
    },
    [client, ensureClientReady]
  );

  return {
    // Session Management
    createSessionKey,
    renewSession,
    revokeSession,
    validateSession,
    
    // Session Queries
    getSessionInfo,
    calculateRemainingTransactions,
    calculateSessionTimeRemaining,
    checkSessionNeedsRenewal,
  };
};