import * as models from '@/typescript/models.gen';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the AquaStark client.
 *
 * Exposes functions to create aquariums, add fish or decorations, move entities between aquariums,
 * and query aquarium or player-related information.
 *
 * @returns {Object} An object containing methods for managing aquariums:
 * - `createAquariumId(account)`
 * - `getAquarium(id)`
 * - `newAquarium(account, owner, maxCapacity, maxDecorations)`
 * - `addFishToAquarium(account, fish, aquariumId)`
 * - `addDecorationToAquarium(account, decoration, aquariumId)`
 * - `getPlayerAquariums(playerAddress)`
 * - `getPlayerAquariumCount(playerAddress)`
 * - `moveFishToAquarium(account, fishId, fromAquariumId, toAquariumId)`
 * - `moveDecorationToAquarium(account, decorationId, fromAquariumId, toAquariumId)`
 * - `getAquariumOwner(aquariumId)`
 *
 * @example
 * const {
 *   newAquarium,
 *   getAquarium,
 *   addFishToAquarium
 * } = useAquarium();
 *
 * // Create a new aquarium
 * await newAquarium(account, "0xOwner", 10, 5);
 *
 * // Fetch an aquarium by ID
 * const aquarium = await getAquarium(1);
 *
 * // Add a fish to an aquarium
 * await addFishToAquarium(account, fishModel, 1);
 */
export const useAquarium = () => {
  const { client } = useDojoSDK();

  /**
   * Creates a new aquarium ID.
   * @param {Account | AccountInterface} account - User account instance.
   * @returns {Promise<any>} The generated aquarium ID.
   */
  const createAquariumId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createAquariumId(account);
    },
    [client]
  );

  /**
   * Retrieves aquarium data by its ID.
   * @param {BigNumberish} id - Aquarium ID.
   * @returns {Promise<any>} Aquarium data.
   */
  const getAquarium = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getAquarium(id);
    },
    [client]
  );

  /**
   * Creates a new aquarium with defined properties.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} owner - Address of the aquarium owner.
   * @param {BigNumberish} maxCapacity - Maximum number of fish.
   * @param {BigNumberish} maxDecorations - Maximum number of decorations.
   * @returns {Promise<any>} The created aquarium data.
   */
  const newAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      owner: string,
      maxCapacity: BigNumberish,
      maxDecorations: BigNumberish
    ) => {
      return await client.AquaStark.newAquarium(
        account,
        owner,
        maxCapacity,
        maxDecorations
      );
    },
    [client]
  );

  /**
   * Adds a fish to an existing aquarium.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {models.Fish} fish - Fish object to add.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const addFishToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      fish: models.Fish,
      aquariumId: BigNumberish
    ) => {
      return await client.AquaStark.addFishToAquarium(
        account,
        fish,
        aquariumId
      );
    },
    [client]
  );

  /**
   * Adds a decoration to an existing aquarium.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {models.Decoration} decoration - Decoration object to add.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const addDecorationToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      decoration: models.Decoration,
      aquariumId: BigNumberish
    ) => {
      return await client.AquaStark.addDecorationToAquarium(
        account,
        decoration,
        aquariumId
      );
    },
    [client]
  );

  /**
   * Retrieves all aquariums owned by a player.
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<any>} List of aquariums.
   */
  const getPlayerAquariums = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerAquariums(playerAddress);
    },
    [client]
  );

  /**
   * Retrieves the total number of aquariums owned by a player.
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<number>} Aquarium count.
   */
  const getPlayerAquariumCount = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerAquariumCount(playerAddress);
    },
    [client]
  );

  /**
   * Moves a fish between aquariums.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} fishId - ID of the fish.
   * @param {BigNumberish} fromAquariumId - Source aquarium ID.
   * @param {BigNumberish} toAquariumId - Destination aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const moveFishToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      fishId: BigNumberish,
      fromAquariumId: BigNumberish,
      toAquariumId: BigNumberish
    ) => {
      return await client.AquaStark.moveFishToAquarium(
        account,
        fishId,
        fromAquariumId,
        toAquariumId
      );
    },
    [client]
  );

  /**
   * Moves a decoration between aquariums.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} decorationId - ID of the decoration.
   * @param {BigNumberish} fromAquariumId - Source aquarium ID.
   * @param {BigNumberish} toAquariumId - Destination aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const moveDecorationToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      decorationId: BigNumberish,
      fromAquariumId: BigNumberish,
      toAquariumId: BigNumberish
    ) => {
      return await client.AquaStark.moveDecorationToAquarium(
        account,
        decorationId,
        fromAquariumId,
        toAquariumId
      );
    },
    [client]
  );

  /**
   * Retrieves the owner of a given aquarium.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<string>} Owner address.
   */
  const getAquariumOwner = useCallback(
    async (aquariumId: BigNumberish) => {
      return await client.AquaStark.getAquariumOwner(aquariumId);
    },
    [client]
  );

  return {
    createAquariumId,
    getAquarium,
    newAquarium,
    addFishToAquarium,
    addDecorationToAquarium,
    getPlayerAquariums,
    getPlayerAquariumCount,
    moveFishToAquarium,
    moveDecorationToAquarium,
    getAquariumOwner,
  };
};
