import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client || !client.AquaAuction) {
    throw new Error('AquaAuction contract not found in Dojo client');
  }
}

/**
 * Custom React hook for AquaAuction contract interactions.
 * Provides methods for managing fish auctions including starting, bidding, and ending auctions.
 *
 * @returns Object containing auction-related functions
 */
export const useAquaAuction = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);

  /**
   * Ends an active auction
   * @param account - User account instance
   * @param auctionId - ID of the auction to end
   * @returns Promise with transaction result
   */
  const endAuction = useCallback(
    async (account: Account | AccountInterface, auctionId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaAuction.endAuction(account, auctionId);
    },
    [client, ensureClientReady]
  );

  /**
   * Gets all currently active auctions
   * @returns Promise with array of active auctions
   */
  const getActiveAuctions = useCallback(async () => {
    ensureClientReady();
    return await client.AquaAuction.getActiveAuctions();
  }, [client, ensureClientReady]);

  /**
   * Gets auction details by ID
   * @param auctionId - ID of the auction to retrieve
   * @returns Promise with auction data
   */
  const getAuctionById = useCallback(
    async (auctionId: BigNumberish) => {
      ensureClientReady();
      return await client.AquaAuction.getAuctionById(auctionId);
    },
    [client, ensureClientReady]
  );

  /**
   * Places a bid on an auction
   * @param account - User account instance
   * @param auctionId - ID of the auction to bid on
   * @param amount - Bid amount
   * @returns Promise with transaction result
   */
  const placeBid = useCallback(
    async (
      account: Account | AccountInterface,
      auctionId: BigNumberish,
      amount: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaAuction.placeBid(account, auctionId, amount);
    },
    [client, ensureClientReady]
  );

  /**
   * Starts a new auction for a fish
   * @param account - User account instance
   * @param fishId - ID of the fish to auction
   * @param durationSecs - Duration of the auction in seconds
   * @param reservePrice - Minimum bid price
   * @returns Promise with transaction result
   */
  const startAuction = useCallback(
    async (
      account: Account | AccountInterface,
      fishId: BigNumberish,
      durationSecs: BigNumberish,
      reservePrice: BigNumberish
    ) => {
      ensureClientReady();
      return await client.AquaAuction.startAuction(
        account,
        fishId,
        durationSecs,
        reservePrice
      );
    },
    [client, ensureClientReady]
  );

  return {
    endAuction,
    getActiveAuctions,
    getAuctionById,
    placeBid,
    startAuction,
  };
};
