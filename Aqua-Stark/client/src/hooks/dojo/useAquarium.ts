import * as models from '@/typescript/models.gen';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

export const useAquarium = () => {
  const { client } = useDojoSDK();

  const createAquariumId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createAquariumId(account);
    },
    [client]
  );

  const getAquarium = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getAquarium(id);
    },
    [client]
  );

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

  const getPlayerAquariums = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerAquariums(playerAddress);
    },
    [client]
  );

  const getPlayerAquariumCount = useCallback(
    async (playerAddress: string) => {
      return await client.AquaStark.getPlayerAquariumCount(playerAddress);
    },
    [client]
  );

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
