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
 * Provides methods for creating, retrieving, breeding, and managing fish genealogy.
 *
 * @returns {object} Object containing fish management functions.
 *
 * @example
 * ```ts
 * const { newFish, breedFishes, getFishFamilyTree } = useFish();
 *
 * // Create a new fish
 * await newFish(account, aquariumId, species);
 *
 * // Breed two fishes
 * await breedFishes(account, parent1Id, parent2Id);
 *
 * // Get a fish family tree
 * const familyTree = await getFishFamilyTree(fishId);
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
   * @returns {Promise<any>} Fish data.
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
   * @returns {Promise<any>} Result of fish creation.
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
   * @returns {Promise<any[]>} Array of fish data.
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
   * @returns {Promise<any>} Result of fish breeding.
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
   * @returns {Promise<any[]>} Array containing parent fish data.
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
   * @returns {Promise<any[]>} Array of offspring fish data.
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
   * @param {BigNumberish} generations - Number of generations back.
   * @returns {Promise<any>} Ancestor fish data.
   */
  const getFishAncestor = useCallback(
    async (fishId: BigNumberish, generations: BigNumberish) => {
      return await client.AquaStark.getFishAncestor(fishId, generations);
    },
    [client]
  );

  /**
   * Retrieves the entire family tree of a fish.
   *
   * @param {BigNumberish} fishId - Fish ID.
   * @returns {Promise<any>} Full family tree data.
   */
  const getFishFamilyTree = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishFamilyTree(fishId);
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
  };
};
