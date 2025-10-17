import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';
import { DojoClient } from '@/types';

/**
 * Validates that the Dojo client is properly initialized and has the required contracts
 */
function validateDojoClient(client: DojoClient, contractName: string): void {
  if (!client || !client[contractName as keyof DojoClient]) {
    throw new Error(`${contractName} contract not found in Dojo client`);
  }
}

/**
 * React hook for ShopCatalog contract interactions.
 * Provides methods for managing shop items and inventory.
 */
export const useShopCatalog = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client, 'ShopCatalog');
  }, [client]);

  const addNewItem = useCallback(
    async (
      price: BigNumberish,
      stock: BigNumberish,
      description: BigNumberish
    ) => {
      ensureClientReady();
      return await client.ShopCatalog.addNewItem(price, stock, description);
    },
    [client, ensureClientReady]
  );

  const getAllItems = useCallback(async () => {
    ensureClientReady();
    return await client.ShopCatalog.getAllItems();
  }, [client, ensureClientReady]);

  const getItem = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.ShopCatalog.getItem(id);
    },
    [client, ensureClientReady]
  );

  const updateItem = useCallback(
    async (
      id: BigNumberish,
      price: BigNumberish,
      stock: BigNumberish,
      description: BigNumberish
    ) => {
      ensureClientReady();
      return await client.ShopCatalog.updateItem(id, price, stock, description);
    },
    [client, ensureClientReady]
  );

  return {
    addNewItem,
    getAllItems,
    getItem,
    updateItem,
  };
};

/**
 * React hook for DailyChallenge contract interactions.
 * Provides methods for managing daily challenges and rewards.
 */
export const useDailyChallenge = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client, 'daily_challenge');
  }, [client]);

  const createChallenge = useCallback(
    async (
      account: Account | AccountInterface,
      day: BigNumberish,
      seed: BigNumberish
    ) => {
      ensureClientReady();
      return await client.daily_challenge.createChallenge(account, day, seed);
    },
    [client, ensureClientReady]
  );

  const joinChallenge = useCallback(
    async (account: Account | AccountInterface, challengeId: BigNumberish) => {
      ensureClientReady();
      return await client.daily_challenge.joinChallenge(account, challengeId);
    },
    [client, ensureClientReady]
  );

  const completeChallenge = useCallback(
    async (account: Account | AccountInterface, challengeId: BigNumberish) => {
      ensureClientReady();
      return await client.daily_challenge.completeChallenge(
        account,
        challengeId
      );
    },
    [client, ensureClientReady]
  );

  const claimReward = useCallback(
    async (account: Account | AccountInterface, challengeId: BigNumberish) => {
      ensureClientReady();
      return await client.daily_challenge.claimReward(account, challengeId);
    },
    [client, ensureClientReady]
  );

  return {
    createChallenge,
    joinChallenge,
    completeChallenge,
    claimReward,
  };
};

/**
 * React hook for Game contract interactions.
 * Provides comprehensive game management functions.
 */
export const useGameEnhanced = () => {
  const { client } = useDojoSDK();

  const ensureClientReady = useCallback(() => {
    validateDojoClient(client, 'Game');
  }, [client]);

  // Game-specific aquarium functions
  const getAquarium = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getAquarium(id);
    },
    [client, ensureClientReady]
  );

  const getAquariumOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getAquariumOwner(id);
    },
    [client, ensureClientReady]
  );

  const getPlayerAquariums = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerAquariums(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerAquariumCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerAquariumCount(player);
    },
    [client, ensureClientReady]
  );

  // Game-specific fish functions
  const getFish = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getFish(id);
    },
    [client, ensureClientReady]
  );

  const getFishOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getFishOwner(id);
    },
    [client, ensureClientReady]
  );

  const getPlayerFishes = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerFishes(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerFishCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerFishCount(player);
    },
    [client, ensureClientReady]
  );

  // Game-specific decoration functions
  const getDecoration = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getDecoration(id);
    },
    [client, ensureClientReady]
  );

  const getDecorationOwner = useCallback(
    async (id: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getDecorationOwner(id);
    },
    [client, ensureClientReady]
  );

  const getPlayerDecorations = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerDecorations(player);
    },
    [client, ensureClientReady]
  );

  const getPlayerDecorationCount = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.getPlayerDecorationCount(player);
    },
    [client, ensureClientReady]
  );

  // Game-specific player functions
  const getPlayer = useCallback(
    async (address: string) => {
      ensureClientReady();
      return await client.Game.getPlayer(address);
    },
    [client, ensureClientReady]
  );

  const isVerified = useCallback(
    async (player: string) => {
      ensureClientReady();
      return await client.Game.isVerified(player);
    },
    [client, ensureClientReady]
  );

  // Game-specific listing functions
  const getListing = useCallback(
    async (listingId: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getListing(listingId);
    },
    [client, ensureClientReady]
  );

  const listFish = useCallback(
    async (fishId: BigNumberish, price: BigNumberish) => {
      ensureClientReady();
      return await client.Game.listFish(fishId, price);
    },
    [client, ensureClientReady]
  );

  // Game-specific genealogy functions
  const getParents = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getParents(fishId);
    },
    [client, ensureClientReady]
  );

  const getFishAncestor = useCallback(
    async (fishId: BigNumberish, generation: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getFishAncestor(fishId, generation);
    },
    [client, ensureClientReady]
  );

  const getFishFamilyTree = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getFishFamilyTree(fishId);
    },
    [client, ensureClientReady]
  );

  const getFishOffspring = useCallback(
    async (fishId: BigNumberish) => {
      ensureClientReady();
      return await client.Game.getFishOffspring(fishId);
    },
    [client, ensureClientReady]
  );

  return {
    // Aquarium functions
    getAquarium,
    getAquariumOwner,
    getPlayerAquariums,
    getPlayerAquariumCount,

    // Fish functions
    getFish,
    getFishOwner,
    getPlayerFishes,
    getPlayerFishCount,

    // Decoration functions
    getDecoration,
    getDecorationOwner,
    getPlayerDecorations,
    getPlayerDecorationCount,

    // Player functions
    getPlayer,
    isVerified,

    // Listing functions
    getListing,
    listFish,

    // Genealogy functions
    getParents,
    getFishAncestor,
    getFishFamilyTree,
    getFishOffspring,
  };
};
