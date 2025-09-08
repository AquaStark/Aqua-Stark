import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from 'starknet';

export const useFish = () => {
  const { client } = useDojoSDK();

  const createFishId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createFishId(account);
    },
    [client]
  );

  const getFish = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getFish(id);
    },
    [client]
  );

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
  const getPlayerFishes = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerFishes(playerAddress);
    },
    [client]
  );

  const getPlayerFishCount = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerFishCount(playerAddress);
    },
    [client]
  );

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

  const getFishOwner = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishOwner(fishId);
    },
    [client]
  );

  const getFishParents = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getParents(fishId);
    },
    [client]
  );
  const getFishOffspring = useCallback(
    async (fishId: BigNumberish) => {
      return await client.AquaStark.getFishOffspring(fishId);
    },
    [client]
  );

  const getFishAncestor = useCallback(
    async (fishId: BigNumberish, generations: BigNumberish) => {
      return await client.AquaStark.getFishAncestor(fishId, generations);
    },
    [client]
  );
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
