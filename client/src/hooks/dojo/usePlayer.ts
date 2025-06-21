import { stringToFelt } from "@/utils/starknet";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useCallback } from "react";
import { Account, AccountInterface, BigNumberish } from "starknet";

export const usePlayer = () => {
  const { client } = useDojoSDK();

  const registerPlayer = useCallback(
    async (account: AccountInterface | undefined, username: string) => {
      try {
        const usernameFelt = stringToFelt(username);
        if (Array.isArray(usernameFelt)) {
          throw new Error("Username is too long.");
        }
        return await client.AquaStark.register(
          account,
          usernameFelt as BigNumberish
        );
      } catch (error) {
        console.error("Error registering player:", error);
        throw error;
      }
    },
    [client]
  );

  const getPlayer = useCallback(
    async (address: string) => {
      try {
        if (!client || !client.AquaStark) return alert("No client found");
        return await client.AquaStark.getPlayer(address);
      } catch (error) {
        console.error("Error getting player:", error);
        throw error;
      }
    },
    [client]
  );

  const getUsernameFromAddress = useCallback(
    async (address: string) => {
      try {
        return await client.AquaStark.getUsernameFromAddress(address);
      } catch (error) {
        console.error("Error getting username from address:", error);
        throw error;
      }
    },
    [client]
  );

  const createNewPlayerId = useCallback(
    async (account: Account | AccountInterface) => {
      try {
        return await client.AquaStark.createNewPlayerId(account);
      } catch (error) {
        console.error("Error creating new player ID:", error);
        throw error;
      }
    },
    [client]
  );

  return {
    registerPlayer,
    getPlayer,
    getUsernameFromAddress,
    createNewPlayerId,
  };
};
