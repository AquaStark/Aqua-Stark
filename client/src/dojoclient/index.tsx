import { useCallback } from "react";
import {
  Account,
  AccountInterface,
  BigNumberish,
  CairoCustomEnum,
} from "starknet";
import { setupWorld } from "../typescript/contracts.gen";
import { Decoration, Fish } from "../typescript/models.gen";

type ClientType = ReturnType<typeof setupWorld>;

interface UseAquaStarkProps {
  client: ClientType;
  account: Account | AccountInterface;
}

export function useAquaStark({ client, account }: UseAquaStarkProps) {
  const addDecorationToAquarium = useCallback(
    (decoration: Decoration, aquariumId: BigNumberish) => {
      return client.AquaStark.addDecorationToAquarium(
        account,
        decoration,
        aquariumId
      );
    },
    [client, account]
  );

  const addFishToAquarium = useCallback(
    (fish: Fish, aquariumId: BigNumberish) => {
      return client.AquaStark.addFishToAquarium(account, fish, aquariumId);
    },
    [client, account]
  );

  const createAquariumId = useCallback(() => {
    return client.AquaStark.createAquariumId(account);
  }, [client, account]);

  const createDecorationId = useCallback(() => {
    return client.AquaStark.createDecorationId(account);
  }, [client, account]);

  const createFishId = useCallback(() => {
    return client.AquaStark.createFishId(account);
  }, [client, account]);

  const createNewPlayerId = useCallback(() => {
    try {
      const res = client.AquaStark.createNewPlayerId(account);
      console.log("res", res);
      console.log("account", account);
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [client, account]);

  const getAquarium = useCallback(
    (id: BigNumberish) => {
      return client.AquaStark.getAquarium(id);
    },
    [client]
  );

  const getDecoration = useCallback(
    (id: BigNumberish) => {
      return client.AquaStark.getDecoration(id);
    },
    [client]
  );

  const getFish = useCallback(
    (id: BigNumberish) => {
      return client.AquaStark.getFish(id);
    },
    [client]
  );

  const getPlayer = useCallback(
    (address: string) => {
      return client.AquaStark.getPlayer(address);
    },
    [client]
  );

  const getUsernameFromAddress = useCallback(
    (address: string) => {
      return client.AquaStark.getUsernameFromAddress(address);
    },
    [client]
  );

  const newAquarium = useCallback(
    (owner: string, maxCapacity: BigNumberish) => {
      return client.AquaStark.newAquarium(account, owner, maxCapacity);
    },
    [client, account]
  );

  const newDecoration = useCallback(
    (
      aquariumId: BigNumberish,
      name: BigNumberish,
      description: BigNumberish,
      price: BigNumberish,
      rarity: BigNumberish
    ) => {
      return client.AquaStark.newDecoration(
        account,
        aquariumId,
        name,
        description,
        price,
        rarity
      );
    },
    [client, account]
  );

  const newFish = useCallback(
    (owner: string, species: CairoCustomEnum) => {
      return client.AquaStark.newFish(account, owner, species);
    },
    [client, account]
  );

  const register = useCallback(
    (username: BigNumberish) => {
      return client.AquaStark.register(account, username);
    },
    [client, account]
  );

  return {
    addDecorationToAquarium,
    addFishToAquarium,
    createAquariumId,
    createDecorationId,
    createFishId,
    createNewPlayerId,
    getAquarium,
    getDecoration,
    getFish,
    getPlayer,
    getUsernameFromAddress,
    newAquarium,
    newDecoration,
    newFish,
    register,
  };
}
