import { useDojoSDK } from "@dojoengine/sdk/react";
import { useCallback } from "react";
import { Account, AccountInterface, BigNumberish } from "starknet";

export const useDecoration = () => {
  const { client } = useDojoSDK();

  const createDecorationId = useCallback(
    async (account: Account | AccountInterface) => {
      return await client.AquaStark.createDecorationId(account);
    },
    [client]
  );

  const getDecoration = useCallback(
    async (id: BigNumberish) => {
      return await client.AquaStark.getDecoration(id);
    },
    [client]
  );

  const newDecoration = useCallback(
    async (
      account: Account | AccountInterface,
      aquariumId: BigNumberish,
      name: BigNumberish,
      description: BigNumberish,
      price: BigNumberish,
      rarity: BigNumberish
    ) => {
      return await client.AquaStark.newDecoration(
        account,
        aquariumId,
        name,
        description,
        price,
        rarity
      );
    },
    [client]
  );

  return {
    createDecorationId,
    getDecoration,
    newDecoration,
  };
};
