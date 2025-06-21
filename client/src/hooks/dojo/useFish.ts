import { useDojoSDK } from "@dojoengine/sdk/react";
import { useCallback } from "react";
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from "starknet";

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
      owner: string,
      species: CairoCustomEnum
    ) => {
      return await client.AquaStark.newFish(account, owner, species);
    },
    [client]
  );

  return {
    createFishId,
    getFish,
    newFish,
  };
};
