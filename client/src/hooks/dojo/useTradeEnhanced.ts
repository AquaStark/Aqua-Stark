import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
  CairoOption,
} from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client || !client.Trade) {
    throw new Error('Trade contract not found in Dojo client');
  }
}

/**
 * React hook for Trade contract interactions.
 * Provides methods for managing fish trading offers, accepting trades, and querying trade information.
 *
 * @returns Object containing all Trade functions
 */
export const useTradeEnhanced = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);

  // Trade Offer Management
  const createTradeOffer = useCallback(
    async (
      account: Account | AccountInterface,
      offeredFishId: BigNumberish,
      criteria: CairoCustomEnum,
      requestedFishId: CairoOption<BigNumberish>,
      requestedSpecies: CairoOption<BigNumberish>,
      requestedGeneration: CairoOption<BigNumberish>,
      requestedTraits: Array<BigNumberish>,
      durationHours: BigNumberish
    ) => {
      ensureClientReady();
      return await client.Trade.createTradeOffer(
        account,
        offeredFishId,
        criteria,
        requestedFishId,
        requestedSpecies,
        requestedGeneration,
        requestedTraits,
        durationHours
      );
    },
    [client, ensureClientReady]
  );

  const acceptTradeOffer = useCallback(
    async (
      account: Account | AccountInterface,
      offerId: BigNumberish,
      offeredFishId: BigNumberish
    ) => {
      ensureClientReady();
      return await client.Trade.acceptTradeOffer(
        account,
        offerId,
        offeredFishId
      );
    },
    [client, ensureClientReady]
  );

  const cancelTradeOffer = useCallback(
    async (account: Account | AccountInterface, offerId: BigNumberish) => {
      ensureClientReady();
      return await client.Trade.cancelTradeOffer(account, offerId);
    },
    [client, ensureClientReady]
  );

  const cleanupExpiredOffers = useCallback(
    async (account: Account | AccountInterface) => {
      ensureClientReady();
      return await client.Trade.cleanupExpiredOffers(account);
    },
    [client, ensureClientReady]
  );

  // Trade Queries
  const getTradeOffer = useCallback(
    async (offerId: BigNumberish) => {
      ensureClientReady();
      return await client.Trade.getTradeOffer(offerId);
    },
    [client, ensureClientReady]
  );

  const getActiveTradeOffers = useCallback(
    async (creator: string) => {
      ensureClientReady();
      return await client.Trade.getActiveTradeOffers(creator);
    },
    [client, ensureClientReady]
  );

  const getAllActiveOffers = useCallback(async () => {
    ensureClientReady();
    return await client.Trade.getAllActiveOffers();
  }, [client, ensureClientReady]);

  const getOffersForFish = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Trade.getOffersForFish(fishId);
    },
    [client, ensureClientReady]
  );

  // Fish Lock Status
  const isFishLocked = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Trade.isFishLocked(fishId);
    },
    [client, ensureClientReady]
  );

  const getFishLockStatus = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Trade.getFishLockStatus(fishId);
    },
    [client, ensureClientReady]
  );

  // Trade Statistics
  const getTotalTradesCount = useCallback(async () => {
    ensureClientReady();
    return await client.Trade.getTotalTradesCount();
  }, [client, ensureClientReady]);

  const getUserTradeCount = useCallback(
    async (user: string) => {
      ensureClientReady();
      return await client.Trade.getUserTradeCount(user);
    },
    [client, ensureClientReady]
  );

  return {
    // Trade Offer Management
    createTradeOffer,
    acceptTradeOffer,
    cancelTradeOffer,
    cleanupExpiredOffers,

    // Trade Queries
    getTradeOffer,
    getActiveTradeOffers,
    getAllActiveOffers,
    getOffersForFish,

    // Fish Lock Status
    isFishLocked,
    getFishLockStatus,

    // Trade Statistics
    getTotalTradesCount,
    getUserTradeCount,
  };
};
