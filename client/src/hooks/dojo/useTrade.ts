import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the Trade client.
 *
 * Exposes functions to create/accept/cancel trade offers, query offers, manage fish locks,
 * and retrieve trade statistics.
 *
 * @returns {Object} An object containing methods for managing trades:
 * - `createTradeOffer(account, offeredFishId, criteria, requestedFishId?, requestedSpecies?, requestedGeneration?, requestedTraits?, durationHours)`
 * - `acceptTradeOffer(account, offerId, offeredFishId)`
 * - `cancelTradeOffer(account, offerId)`
 * - `getTradeOffer(offerId)`
 * - `getActiveTradeOffers(creator)`
 * - `getAllActiveOffers()`
 * - `getOffersForFish(fishId)`
 * - `getFishLockStatus(fishId)`
 * - `isFishLocked(fishId)`
 * - `cleanupExpiredOffers(account)`
 * - `getTotalTradesCount()`
 * - `getUserTradeCount(user)`
 *
 * @example
 * const {
 *   createTradeOffer,
 *   acceptTradeOffer,
 *   getActiveTradeOffers
 * } = useTrade();
 *
 * // Create a trade offer
 * await createTradeOffer(account, 1, criteria, null, 2, null, [], 24);
 *
 * // Accept a trade offer
 * await acceptTradeOffer(account, 1, 1);
 *
 * // Fetch active offers for a user
 * const offers = await getActiveTradeOffers("0xCreator");
 */
export const useTrade = () => {
  const { client } = useDojoSDK();

  /**
   * Creates a new trade offer for a fish.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} offeredFishId - ID of the fish being offered.
   * @param {BigNumberish} criteria - Matching criteria for the trade.
   * @param {BigNumberish | null} requestedFishId - Optional requested fish ID.
   * @param {number | null} requestedSpecies - Optional requested species (u8).
   * @param {number | null} requestedGeneration - Optional requested generation (u8).
   * @param {string[]} requestedTraits - Array of requested trait descriptions.
   * @param {BigNumberish} durationHours - Duration of the offer in hours.
   * @returns {Promise<BigNumberish>} The new offer ID.
   */
  const createTradeOffer = useCallback(
    async (
      account: Account | AccountInterface,
      offeredFishId: BigNumberish,
      criteria: BigNumberish,
      requestedFishId: BigNumberish | null,
      requestedSpecies: number | null,
      requestedGeneration: number | null,
      requestedTraits: string[],
      durationHours: BigNumberish
    ) => {
      return await client.Trade.create_trade_offer(
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
    [client]
  );

  /**
   * Accepts a trade offer with the specified offered fish.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} offerId - ID of the offer to accept.
   * @param {BigNumberish} offeredFishId - ID of the fish being offered in acceptance.
   * @returns {Promise<boolean>} Success status.
   */
  const acceptTradeOffer = useCallback(
    async (
      account: Account | AccountInterface,
      offerId: BigNumberish,
      offeredFishId: BigNumberish
    ) => {
      return await client.Trade.accept_trade_offer(
        account,
        offerId,
        offeredFishId
      );
    },
    [client]
  );

  /**
   * Cancels an active trade offer.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} offerId - ID of the offer to cancel.
   * @returns {Promise<boolean>} Success status.
   */
  const cancelTradeOffer = useCallback(
    async (account: Account | AccountInterface, offerId: BigNumberish) => {
      return await client.Trade.cancel_trade_offer(account, offerId);
    },
    [client]
  );

  /**
   * Retrieves a specific trade offer by ID.
   * @param {BigNumberish} offerId - Offer ID.
   * @returns {Promise<Object>} Trade offer data.
   */
  const getTradeOffer = useCallback(
    async (offerId: BigNumberish) => {
      return await client.Trade.get_trade_offer(offerId);
    },
    [client]
  );

  /**
   * Retrieves all active trade offers created by a user.
   * @param {string} creator - Address of the offer creator.
   * @returns {Promise<Object[]>} Array of active offers.
   */
  const getActiveTradeOffers = useCallback(
    async (creator: string) => {
      return await client.Trade.get_active_trade_offers(creator);
    },
    [client]
  );

  /**
   * Retrieves all active trade offers globally.
   * @returns {Promise<Object[]>} Array of all active offers.
   */
  const getAllActiveOffers = useCallback(async () => {
    return await client.Trade.get_all_active_offers();
  }, [client]);

  /**
   * Retrieves all active offers related to a specific fish.
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<Object[]>} Array of related offers.
   */
  const getOffersForFish = useCallback(
    async (fishId: BigNumberish) => {
      return await client.Trade.get_offers_for_fish(fishId);
    },
    [client]
  );

  /**
   * Retrieves the lock status for a fish.
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<Object>} Fish lock data.
   */
  const getFishLockStatus = useCallback(
    async (fishId: BigNumberish) => {
      return await client.Trade.get_fish_lock_status(fishId);
    },
    [client]
  );

  /**
   * Checks if a fish is currently locked for trading.
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<boolean>} Lock status.
   */
  const isFishLocked = useCallback(
    async (fishId: BigNumberish) => {
      return await client.Trade.is_fish_locked(fishId);
    },
    [client]
  );

  /**
   * Cleans up expired trade offers.
   * @param {Account | AccountInterface} account - User account instance.
   * @returns {Promise<BigNumberish>} Number of cleaned up offers.
   */
  const cleanupExpiredOffers = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.Trade.cleanup_expired_offers(account);
    },
    [client]
  );

  /**
   * Retrieves the total count of all trades ever made.
   * @returns {Promise<BigNumberish>} Total trades count.
   */
  const getTotalTradesCount = useCallback(async () => {
    return await client.Trade.get_total_trades_count();
  }, [client]);

  /**
   * Retrieves the total number of trades made by a user.
   * @param {string} user - User address.
   * @returns {Promise<BigNumberish>} User trade count.
   */
  const getUserTradeCount = useCallback(
    async (user: string) => {
      return await client.Trade.get_user_trade_count(user);
    },
    [client]
  );

  return {
    createTradeOffer,
    acceptTradeOffer,
    cancelTradeOffer,
    getTradeOffer,
    getActiveTradeOffers,
    getAllActiveOffers,
    getOffersForFish,
    getFishLockStatus,
    isFishLocked,
    cleanupExpiredOffers,
    getTotalTradesCount,
    getUserTradeCount,
  };
};
