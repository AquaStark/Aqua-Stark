import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish, CairoOption } from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client || !client.AquaStark) {
    throw new Error('AquaStark contract not found in Dojo client');
  }
}

/**
 * Enhanced React hook for AquaStark contract interactions.
 * Provides comprehensive methods for managing transactions, events, players, and system-level operations.
 *
 * @returns Object containing all AquaStark functions
 */
export const useAquaStarkEnhanced = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);

  // Transaction Management
  const confirmTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      transactionId: BigNumberish,
      confirmationHash: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaStark.confirmTransaction(
        account,
        transactionId,
        confirmationHash
      );
    },
    [client, ensureClientReady]
  );

  const initiateTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      player: string,
      eventTypeId: BigNumberish,
      payload: Array<BigNumberish>
    ) => {
      ensureClientReady();
      return await client.AquaStark.initiateTransaction(
        account,
        player,
        eventTypeId,
        payload
      );
    },
    [client, ensureClientReady]
  );

  const processTransaction = useCallback(
    async (
      account: Account | AccountInterface,
      transactionId: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaStark.processTransaction(account, transactionId);
    },
    [client, ensureClientReady]
  );

  const getTransactionStatus = useCallback(
    async (transactionId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getTransactionStatus(transactionId);
    },
    [client, ensureClientReady]
  );

  const isTransactionConfirmed = useCallback(
    async (transactionId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.isTransactionConfirmed(transactionId);
    },
    [client, ensureClientReady]
  );

  const getTransactionCount = useCallback(async () => {
    ensureClientReady();
    return await client.AquaStark.getTransactionCount();
  }, [client, ensureClientReady]);

  const getTransactionHistory = useCallback(
    async (
      player: CairoOption<string>,
      eventTypeId: CairoOption<string>,
      start: CairoOption<string>,
      limit: CairoOption<string>,
      startTimestamp: CairoOption<string>,
      endTimestamp: CairoOption<string>
    ) => {
      ensureClientReady();
      return await client.AquaStark.getTransactionHistory(
        player,
        eventTypeId,
        start,
        limit,
        startTimestamp,
        endTimestamp
      );
    },
    [client, ensureClientReady]
  );

  // Event Management
  const getAllEventTypes = useCallback(async () => {
    ensureClientReady();
    return await client.AquaStark.getAllEventTypes();
  }, [client, ensureClientReady]);

  const getEventTypesCount = useCallback(async () => {
    ensureClientReady();
    return await client.AquaStark.getEventTypesCount();
  }, [client, ensureClientReady]);

  const getEventTypeDetails = useCallback(
    async (eventTypeId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getEventTypeDetails(eventTypeId);
    },
    [client, ensureClientReady]
  );

  const registerEventType = useCallback(
    async (account: Account | AccountInterface, eventName: string) => {
      ensureClientReady();
      return await client.AquaStark.registerEventType(account, eventName);
    },
    [client, ensureClientReady]
  );

  const logEvent = useCallback(
    async (
      account: Account | AccountInterface,
      eventTypeId: BigNumberish,
      player: string,
      payload: Array<BigNumberish>
    ) => {
      ensureClientReady();
      return await client.AquaStark.logEvent(
        account,
        eventTypeId,
        player,
        payload
      );
    },
    [client, ensureClientReady]
  );

  // Player Management
  const register = useCallback(
    async (account: Account | AccountInterface, username: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.register(account, username);
    },
    [client, ensureClientReady]
  );

  const getPlayer = useCallback(
    async (address: string) => {
      ensureClientReady();
      return await client.AquaStark.getPlayer(address);
    },
    [client, ensureClientReady]
  );

  const isVerified = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.AquaStark.isVerified(player);
    },
    [client, ensureClientReady]
  );

  const getUsernameFromAddress = useCallback(
    async (address: string) => {
      ensureClientReady();
      return await client.AquaStark.getUsernameFromAddress(address);
    },
    [client, ensureClientReady]
  );

  // Aquarium Management
  const getAquarium = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getAquarium(id);
    },
    [client, ensureClientReady]
  );

  const newAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      owner: string,
      maxCapacity: BigNumberish,
      maxDecorations: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaStark.newAquarium(
        account,
        owner,
        maxCapacity,
        maxDecorations
      );
    },
    [client, ensureClientReady]
  );

  const getAquariumOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getAquariumOwner(id);
    },
    [client, ensureClientReady]
  );

  const getPlayerAquariums = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.AquaStark.getPlayerAquariums(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerAquariumCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.AquaStark.getPlayerAquariumCount(player);
    },
    [client, ensureClientReady]
  );

  // Decoration Management
  const newDecoration = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      name: BigNumberish,
      description: BigNumberish,
      price: BigNumberish,
      rarity: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaStark.newDecoration(
        account,
        aquariumId,
        name,
        description,
        price,
        rarity
      );
    },
    [client, ensureClientReady]
  );

  const getDecoration = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getDecoration(id);
    },
    [client, ensureClientReady]
  );

  const getDecorationOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getDecorationOwner(id);
    },
    [client, ensureClientReady]
  );

  const getPlayerDecorations = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.AquaStark.getPlayerDecorations(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerDecorationCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.AquaStark.getPlayerDecorationCount(player);
    },
    [client, ensureClientReady]
  );

  // Fish Management
  const getFishOwnerForAuction = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaStark.getFishOwnerForAuction(fishId);
    },
    [client, ensureClientReady]
  );

  return {
    // Transaction Management
    confirmTransaction,
    initiateTransaction,
    processTransaction,
    getTransactionStatus,
    isTransactionConfirmed,
    getTransactionCount,
    getTransactionHistory,

    // Event Management
    getAllEventTypes,
    getEventTypesCount,
    getEventTypeDetails,
    registerEventType,
    logEvent,

    // Player Management
    register,
    getPlayer,
    isVerified,
    getUsernameFromAddress,

    // Aquarium Management
    getAquarium,
    newAquarium,
    getAquariumOwner,
    getPlayerAquariums,
    getPlayerAquariumCount,

    // Decoration Management
    newDecoration,
    getDecoration,
    getDecorationOwner,
    getPlayerDecorations,
    getPlayerDecorationCount,

    // Fish Management
    getFishOwnerForAuction,
  };
};
