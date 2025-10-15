import * as models from '@/typescript/models.gen';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback, useEffect } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client) {
    throw new Error('Dojo SDK client is not initialized');
  }

  console.log('Available contracts:', Object.keys(client));

  if (!client.AquaStark) {
    throw new Error(
      `AquaStark contract not found. Available contracts: ${Object.keys(client).join(', ')}`
    );
  }

  const requiredMethods = ['getAquarium', 'newAquarium', 'getAquariumOwner'];
  const availableMethods = Object.keys(client.AquaStark);

  requiredMethods.forEach(method => {
    if (!(method in client.AquaStark)) {
      throw new Error(
        `Required method '${method}' not found in AquaStark contract. Available methods: ${availableMethods.join(', ')}`
      );
    }
  });
}

/**
 * Custom React hook that provides methods to interact with the AquaStark client.
 *
 * Exposes functions to create aquariums, add fish or decorations, move entities between aquariums,
 * and query aquarium or player-related information.
 *
 * Note: Methods are routed to the appropriate contract namespaces:
 * - AquaStark: Basic aquarium and player queries
 * - Game: Game-specific operations (add/move entities)
 * - FishSystem: Fish-specific operations
 *
 * @returns {Object} An object containing methods for managing aquariums:
 * - `createAquariumId(account)` - Creates a new aquarium (via Game contract)
 * - `getAquarium(id)` - Gets aquarium data
 * - `newAquarium(account, owner, maxCapacity, maxDecorations)` - Creates new aquarium
 * - `addFishToAquarium(account, fish, aquariumId)` - Adds fish via Game contract
 * - `addDecorationToAquarium(account, decoration, aquariumId)` - Adds decoration via Game contract
 * - `getPlayerAquariums(playerAddress)` - Gets player's aquariums
 * - `getPlayerAquariumCount(playerAddress)` - Gets aquarium count
 * - `moveFishToAquarium(account, fishId, fromAquariumId, toAquariumId)` - Moves fish via Game contract
 * - `moveDecorationToAquarium(account, decorationId, fromAquariumId, toAquariumId)` - Moves decoration via Game contract
 * - `getAquariumOwner(aquariumId)` - Gets aquarium owner
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

  // Validate client on each render and when client changes
  useEffect(() => {
    if (client) {
      try {
        validateDojoClient(client);
        console.log('Dojo client validation successful');
      } catch (error) {
        console.error('Dojo client validation failed:', error);
      }
    }
  }, [client]);

  // Validate client before any operation
  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);
  /**
   * This method doesn't exist in the contracts. Use newAquarium instead.
   * Keeping for backwards compatibility but will throw an error.
   * @param {Account | AccountInterface} account - User account instance.
   * @returns {Promise<any>} Throws error indicating method doesn't exist.
   */
  const createAquariumId = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_account: Account | AccountInterface) => {
      throw new Error(
        'createAquariumId method does not exist. Use newAquarium method instead.'
      );
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
      ensureClientReady();

      console.log('getAquarium called with id:', id);

      try {
        const result = await client.AquaStark.getAquarium(id);
        console.log('getAquarium result:', result);
        return result;
      } catch (error) {
        console.error('getAquarium error:', error);
        return error;
      }
    },
    [client, ensureClientReady]
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
  // console.log('client: ', client);
  /**
   * Adds a fish to an existing aquarium via Game contract.
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
      return await client.Game.addFishToAquarium(account, fish, aquariumId);
    },
    [client]
  );

  /**
   * Adds a decoration to an existing aquarium via Game contract.
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
      return await client.Game.addDecorationToAquarium(
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
   * Moves a fish between aquariums via Game contract.
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
      return await client.Game.moveFishToAquarium(
        account,
        fishId,
        fromAquariumId,
        toAquariumId
      );
    },
    [client]
  );

  /**
   * Moves a decoration between aquariums via Game contract.
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
      return await client.Game.moveDecorationToAquarium(
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
