import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from 'starknet';
import { DojoClient } from '@/types';
import * as models from '@/typescript/models.gen';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient): void {
  if (!client || !client.FishSystem) {
    throw new Error('FishSystem contract not found in Dojo client');
  }
}

/**
 * Enhanced React hook for FishSystem contract interactions.
 * Provides comprehensive methods for managing fish including creation, breeding, trading, and querying.
 *
 * @returns Object containing all FishSystem functions
 */
export const useFishSystemEnhanced = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client);
  }, [client]);

  // Fish Creation and Management
  const newFish = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      species: CairoCustomEnum
    ) => {
      ensureClientReady();
      return await client.FishSystem.newFish(account, aquariumId, species);
    },
    [client, ensureClientReady]
  );

  const addFishToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      fish: models.Fish,
      aquariumId: BigNumberish
    ) => {
      ensureClientReady();
      return await client.FishSystem.addFishToAquarium(
        account,
        fish,
        aquariumId
      );
    },
    [client, ensureClientReady]
  );

  const moveFishToAquarium = useCallback(
    async (
      account: Account | AccountInterface,
      fishId: BigNumberish,
      from: BigNumberish,
      to: BigNumberish
    ) => {
      ensureClientReady();
      return await client.FishSystem.moveFishToAquarium(
        account,
        fishId,
        from,
        to
      );
    },
    [client, ensureClientReady]
  );

  // Fish Breeding
  const breedFishes = useCallback(
    async (
      account: Account | AccountInterface,
      parent1Id: BigNumberish,
      parent2Id: BigNumberish
    ) => {
      ensureClientReady();
      return await client.FishSystem.breedFishes(account, parent1Id, parent2Id);
    },
    [client, ensureClientReady]
  );

  // Fish Querying
  const getFish = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getFish(id);
    },
    [client, ensureClientReady]
  );

  const getFishOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getFishOwner(id);
    },
    [client, ensureClientReady]
  );

  // Player Fish Management
  const getPlayerFishes = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.FishSystem.getPlayerFishes(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerFishCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.FishSystem.getPlayerFishCount(player);
    },
    [client, ensureClientReady]
  );

  // Fish Genealogy
  const getParents = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getParents(fishId);
    },
    [client, ensureClientReady]
  );

  const getFishOffspring = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getFishOffspring(fishId);
    },
    [client, ensureClientReady]
  );

  const getFishAncestor = useCallback(
    async (fishId: BigNumberish, generation: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getFishAncestor(fishId, generation);
    },
    [client, ensureClientReady]
  );

  const getFishFamilyTree = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.getFishFamilyTree(fishId);
    },
    [client, ensureClientReady]
  );

  // Fish Trading
  const listFish = useCallback(
    async (fishId: BigNumberish, price: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.listFish(fishId, price);
    },
    [client, ensureClientReady]
  );

  const purchaseFish = useCallback(
    async (account: Account | AccountInterface, listingId: BigNumberish) => {
      ensureClientReady();
      return await client.FishSystem.purchaseFish(account, listingId);
    },
    [client, ensureClientReady]
  );

  return {
    // Fish Creation and Management
    newFish,
    addFishToAquarium,
    moveFishToAquarium,

    // Fish Breeding
    breedFishes,

    // Fish Querying
    getFish,
    getFishOwner,

    // Player Fish Management
    getPlayerFishes,
    getPlayerFishCount,

    // Fish Genealogy
    getParents,
    getFishOffspring,
    getFishAncestor,
    getFishFamilyTree,

    // Fish Trading
    listFish,
    purchaseFish,
  };
};
