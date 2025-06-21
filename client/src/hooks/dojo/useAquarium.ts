import * as models from "@/typescript/models.gen";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useCallback } from "react";
import { Account, AccountInterface, BigNumberish } from "starknet";

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
      maxCapacity: BigNumberish
    ) => {
      return await client.AquaStark.newAquarium(account, owner, maxCapacity);
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

  return {
    createAquariumId,
    getAquarium,
    newAquarium,
    addFishToAquarium,
    addDecorationToAquarium,
  };
};
