import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the Aquarium client.
 *
 * Exposes functions to create/update/clean aquariums, add/remove/move entities,
 * and query aquarium details and status.
 *
 * @returns {Object} An object containing methods for managing aquariums:
 * - `createAquariumId(account)`
 * - `getAquarium(id)`
 * - `newAquarium(account, owner, maxCapacity, maxDecorations)`
 * - `updateAquariumSettings(account, aquariumId, maxCapacity, maxDecorations)`
 * - `cleanAquarium(account, aquariumId, amount)`
 * - `updateAquariumCleanliness(account, aquariumId, hoursPassed)`
 * - `addFishToAquarium(account, fishId, aquariumId)`
 * - `removeFishFromAquarium(account, aquariumId, fishId)`
 * - `addDecorationToAquarium(account, decorationId, aquariumId)`
 * - `removeDecorationFromAquarium(account, aquariumId, decorationId)`
 * - `moveFishToAquarium(account, fishId, fromAquariumId, toAquariumId)`
 * - `moveDecorationToAquarium(account, decorationId, fromAquariumId, toAquariumId)`
 * - `getPlayerAquariums(playerAddress)`
 * - `getPlayerAquariumCount(playerAddress)`
 * - `getAquariumCleanliness(aquariumId)`
 * - `getAquariumCapacity(aquariumId)`
 * - `getAquariumFishCount(aquariumId)`
 * - `isAquariumFull(aquariumId)`
 * - `getAquariumOwner(aquariumId)`
 *
 * @example
 * const {
 *   newAquarium,
 *   getAquarium,
 *   addFishToAquarium,
 *   cleanAquarium
 * } = useAquarium();
 *
 * // Create a new aquarium
 * await newAquarium(account, "0xOwner", 10, 5);
 *
 * // Fetch an aquarium by ID
 * const aquarium = await getAquarium(1);
 *
 * // Add a fish to an aquarium
 * await addFishToAquarium(account, 1, 1);
 *
 * // Clean an aquarium
 * await cleanAquarium(account, 1, 5);
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
      return await client.Aquarium.createAquariumId(account);
    },
    [client]
  );

  /**
   * Retrieves aquarium data by its ID.
   * @param {BigNumberish} id - Aquarium ID.
   * @returns {Promise<models.Aquarium>} Aquarium data.
   */
  const getAquarium = useCallback(
    async (id: BigNumberish) => {
      return await client.Aquarium.get_aquarium(id);
    },
    [client]
  );

  /**
   * Creates a new aquarium with defined properties.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} owner - Address of the aquarium owner.
   * @param {BigNumberish} maxCapacity - Maximum number of fish.
   * @param {BigNumberish} maxDecorations - Maximum number of decorations.
   * @returns {Promise<BigNumberish>} The created aquarium ID.
   */
  const newAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      owner: string,
      maxCapacity: BigNumberish,
      maxDecorations: BigNumberish
    ) => {
      return await client.Aquarium.create_aquarium(
        account,
        owner,
        maxCapacity,
        maxDecorations
      );
    },
    [client]
  );

  /**
   * Updates settings for an existing aquarium.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @param {BigNumberish} maxCapacity - New maximum number of fish.
   * @param {BigNumberish} maxDecorations - New maximum number of decorations.
   * @returns {Promise<any>} Result of the transaction.
   */
  const updateAquariumSettings = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      maxCapacity: BigNumberish,
      maxDecorations: BigNumberish
    ) => {
      return await client.Aquarium.update_aquarium_settings(
        account,
        aquariumId,
        maxCapacity,
        maxDecorations
      );
    },
    [client]
  );

  /**
   * Cleans an aquarium by a specified amount.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @param {BigNumberish} amount - Cleaning amount.
   * @returns {Promise<any>} Result of the transaction.
   */
  const cleanAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      amount: BigNumberish
    ) => {
      return await client.Aquarium.clean_aquarium(account, aquariumId, amount);
    },
    [client]
  );

  /**
   * Updates the cleanliness of an aquarium based on hours passed.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @param {BigNumberish} hoursPassed - Hours passed since last update.
   * @returns {Promise<any>} Result of the transaction.
   */
  const updateAquariumCleanliness = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      hoursPassed: BigNumberish
    ) => {
      return await client.Aquarium.update_aquarium_cleanliness(account, aquariumId, hoursPassed);
    },
    [client]
  );

  /**
   * Adds a fish to an existing aquarium by ID.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} fishId - Fish ID to add.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const addFishToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      fishId: BigNumberish,
      aquariumId: BigNumberish
    ) => {
      return await client.Aquarium.add_fish_to_aquarium(
        account,
        aquariumId,
        fishId
      );
    },
    [client]
  );

  /**
   * Removes a fish from an existing aquarium.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @param {BigNumberish} fishId - Fish ID to remove.
   * @returns {Promise<any>} Result of the transaction.
   */
  const removeFishFromAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      fishId: BigNumberish
    ) => {
      return await client.Aquarium.remove_fish_from_aquarium(
        account,
        aquariumId,
        fishId
      );
    },
    [client]
  );

  /**
   * Adds a decoration to an existing aquarium by ID.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} decorationId - Decoration ID to add.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<any>} Result of the transaction.
   */
  const addDecorationToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      decorationId: BigNumberish,
      aquariumId: BigNumberish
    ) => {
      return await client.Aquarium.add_decoration_to_aquarium(
        account,
        aquariumId,
        decorationId
      );
    },
    [client]
  );

  /**
   * Removes a decoration from an existing aquarium.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @param {BigNumberish} decorationId - Decoration ID to remove.
   * @returns {Promise<any>} Result of the transaction.
   */
  const removeDecorationFromAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      decorationId: BigNumberish
    ) => {
      return await client.Aquarium.remove_decoration_from_aquarium(
        account,
        aquariumId,
        decorationId
      );
    },
    [client]
  );

  /**
   * Retrieves all aquariums owned by a player.
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<models.Aquarium[]>} List of aquariums.
   */
  const getPlayerAquariums = useCallback(
    async (playerAddress: string) => {
      return await client.Aquarium.getPlayerAquariums(playerAddress);
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
      return await client.Aquarium.getPlayerAquariumCount(playerAddress);
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
      return await client.Aquarium.moveFishToAquarium(
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
      return await client.Aquarium.moveDecorationToAquarium(
        account,
        decorationId,
        fromAquariumId,
        toAquariumId
      );
    },
    [client]
  );

  /**
   * Retrieves the cleanliness level of an aquarium.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<number>} Cleanliness level.
   */
  const getAquariumCleanliness = useCallback(
    async (aquariumId: BigNumberish) => {
      return await client.Aquarium.get_aquarium_cleanliness(aquariumId);
    },
    [client]
  );

  /**
   * Retrieves the capacity of an aquarium.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<number>} Capacity.
   */
  const getAquariumCapacity = useCallback(
    async (aquariumId: BigNumberish) => {
      return await client.Aquarium.get_aquarium_capacity(aquariumId);
    },
    [client]
  );

  /**
   * Retrieves the number of fish in an aquarium.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<number>} Fish count.
   */
  const getAquariumFishCount = useCallback(
    async (aquariumId: BigNumberish) => {
      return await client.Aquarium.get_aquarium_fish_count(aquariumId);
    },
    [client]
  );

  /**
   * Checks if an aquarium is full.
   * @param {BigNumberish} aquariumId - Aquarium ID.
   * @returns {Promise<boolean>} Full status.
   */
  const isAquariumFull = useCallback(
    async (aquariumId: BigNumberish) => {
      return await client.Aquarium.is_aquarium_full(aquariumId);
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
      return await client.Aquarium.get_aquarium_owner(aquariumId);
    },
    [client]
  );

  return {
    createAquariumId,
    getAquarium,
    newAquarium,
    updateAquariumSettings,
    cleanAquarium,
    updateAquariumCleanliness,
    addFishToAquarium,
    removeFishFromAquarium,
    addDecorationToAquarium,
    removeDecorationFromAquarium,
    getPlayerAquariums,
    getPlayerAquariumCount,
    moveFishToAquarium,
    moveDecorationToAquarium,
    getAquariumCleanliness,
    getAquariumCapacity,
    getAquariumFishCount,
    isAquariumFull,
    getAquariumOwner,
  };
};