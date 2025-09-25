import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook for managing decoration-related operations in the AquaStark ecosystem.
 * Provides methods for creating, retrieving, and managing decorations.
 *
 * @returns {object} Object containing decoration management functions.
 *
 * @example
 * ```ts
 * const { newDecoration, getPlayerDecorations } = useDecoration();
 *
 * // Create a new decoration
 * await newDecoration(account, aquariumId, name, description, price, rarity);
 *
 * // Get all decorations owned by a player
 * const decorations = await getPlayerDecorations(playerAddress);
 * ```
 */
export const useDecoration = () => {
  const { client } = useDojoSDK();

  /**
   * Creates a new decoration ID.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @returns {Promise<BigNumberish>} Newly created decoration ID.
   */
  const createDecorationId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createDecorationId(account);
    },
    [client]
  );

  /**
   * Retrieves a decoration by ID.
   *
   * @param {BigNumberish} id - Decoration ID.
   * @returns {Promise<any>} Decoration data.
   */
  const getDecoration = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getDecoration(id);
    },
    [client]
  );

  /**
   * Creates a new decoration and assigns it to an aquarium.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @param {BigNumberish} aquariumId - Target aquarium ID.
   * @param {BigNumberish} name - Decoration name (encoded).
   * @param {BigNumberish} description - Decoration description (encoded).
   * @param {BigNumberish} price - Decoration price.
   * @param {BigNumberish} rarity - Decoration rarity.
   * @returns {Promise<any>} Result of decoration creation.
   */
  const newDecoration = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      name: BigNumberish,
      description: BigNumberish,
      price: BigNumberish,
      rarity: BigNumberish
    ) => {
      return await client.AquaStark.newDecoration(
        account,
        aquariumId,
        name,
        description,
        price,
        rarity
      );
    },
    [client]
  );

  /**
   * Retrieves all decorations owned by a player.
   *
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<any[]>} Array of decorations owned by the player.
   */
  const getPlayerDecorations = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerDecorations(playerAddress);
    },
    [client]
  );

  /**
   * Gets the count of decorations owned by a player.
   *
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<number>} Number of decorations.
   */
  const getPlayerDecorationCount = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerDecorationCount(playerAddress);
    },
    [client]
  );

  /**
   * Retrieves the owner of a decoration by its ID.
   *
   * @param {BigNumberish} decorationId - Decoration ID.
   * @returns {Promise<string>} Owner's address.
   */
  const getDecorationOwner = useCallback(
    async (decorationId: BigNumberish) => {
      return await client.AquaStark.getDecorationOwner(decorationId);
    },
    [client]
  );

  return {
    createDecorationId,
    getDecoration,
    newDecoration,
    getPlayerDecorations,
    getPlayerDecorationCount,
    getDecorationOwner,
  };
};
