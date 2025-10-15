import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from 'starknet';

/**
 * Custom React hook for managing fish-related operations in the AquaStark ecosystem.
 * Provides methods for creating, retrieving, breeding, managing fish genealogy, and marketplace interactions.
 *
 * @returns {object} Object containing fish management functions.
 *
 * @example
 * ```ts
 * const { newFish, breedFishes, listFish, purchaseFish } = useFish();
 *
 * // Create a new fish
 * await newFish(account, aquariumId, species);
 *
 * // Breed two fishes
 * await breedFishes(account, parent1Id, parent2Id);
 *
 * // List a fish for sale
 * await listFish(account, fishId, price);
 *
 * // Purchase a listed fish
 * await purchaseFish(account, listingId);
 * ```
 */
export const useFish = () => {
  const { client } = useDojoSDK();

  /**
   * Creates a new fish ID.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @returns {Promise<BigNumberish>} Newly created fish ID.
   */
  const createFishId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createFishId(account);
    },
    [client]
  );

  /**
   * Retrieves fish data by ID.
   *
   * @param {BigNumberish} id - Fish ID.
   * @returns {Promise<models.Fish>} Fish data.
   */
  const getFish = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getFish(id);
    },
    [client]
  );

  /**
   * Creates a new fish and assigns it to an aquarium.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @param {BigNumberish} aquariumId - Target aquarium ID.
   * @param {CairoCustomEnum} species - Fish species (Cairo enum).
   * @returns {Promise<models.Fish>} Result of fish creation.
   */
  const newFish = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      species: CairoCustomEnum
    ) => {
      return await client.AquaStark.newFish(account, aquariumId, species);
    },
    [client]
  );

  /**
   * Retrieves all fishes owned by a player.
   *
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<models.Fish[]>} Array of fish data.
   */
  const getPlayerFishes = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerFishes(playerAddress);
    },
    [client]
  );

  /**
   * Gets the number of fishes owned by a player.
   *
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<number>} Number of fishes.
   */
  const getPlayerFishCount = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerFishCount(playerAddress);
    },
    [client]
  );

  /**
   * Breeds two fishes and creates offspring.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @param {BigNumberish} parent1Id - First parent fish ID.
   * @param {BigNumberish} parent2Id - Second parent fish ID.
   * @returns {Promise<BigNumberish>} Offspring fish ID.
   */
  const breedFishes = useCallback(
    async (
      account: Account | AccountInterface,
      parent1Id: BigNumberish,
      parent2Id: BigNumberish
    ) => {
      return await client.AquaStark.breedFishes(account, parent1Id, parent2Id);
    },
    [client]
  );

  /**
   * Retrieves the owner of a fish.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<string>} Owner address.
   */
  const getFishOwner = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishOwner(fishId);
    },
    [client]
  );

  /**
   * Retrieves the parents of a fish.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<[BigNumberish, BigNumberish]>} Tuple of parent fish IDs.
   */
  const getFishParents = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getParents(fishId);
    },
    [client]
  );

  /**
   * Retrieves the offspring of a fish.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<models.Fish[]>} Array of offspring fish data.
   */
  const getFishOffspring = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishOffspring(fishId);
    },
    [client]
  );

  /**
   * Retrieves a specific ancestor of a fish by generation.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @param {BigNumberish} generation - Number of generations back.
   * @returns {Promise<models.FishParents>} Ancestor fish data.
   */
  const getFishAncestor = useCallback(
    async (fishId: BigNumberish, generation: BigNumberish) => {
      return await client.AquaStark.getFishAncestor(fishId, generation);
    },
    [client]
  );

  /**
   * Retrieves the entire family tree of a fish.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<models.FishParents[]>} Full family tree data.
   */
  const getFishFamilyTree = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishFamilyTree(fishId);
    },
    [client]
  );

  /**
   * Lists a fish for sale on the marketplace.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @param {BigNumberish} fishId - Fish ID to list.
   * @param {BigNumberish} price - Listing price.
   * @returns {Promise<models.Listing>} Listing data.
   */
  const listFish = useCallback(
    async (
      account: Account | AccountInterface,
      fishId: BigNumberish,
      price: BigNumberish
    ) => {
      return await client.AquaStark.listFish(account, fishId, price);
    },
    [client]
  );

  /**
   * Purchases a listed fish from the marketplace.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @param {BigNumberish} listingId - ID of the listing to purchase.
   * @returns {Promise<any>} Result of the purchase transaction.
   */
  const purchaseFish = useCallback(
    async (account: Account | AccountInterface, listingId: BigNumberish) => {
      return await client.AquaStark.purchaseFish(account, listingId);
    },
    [client]
  );

  return {
    createFishId,
    getFish,
    newFish,
    getPlayerFishes,
    getPlayerFishCount,
    breedFishes,
    getFishOwner,
    getFishParents,
    getFishOffspring,
    getFishAncestor,
    getFishFamilyTree,
    listFish,
    purchaseFish,
  };
};
