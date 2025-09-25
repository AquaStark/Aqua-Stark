import { stringToFelt } from '@/utils/starknet';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook for managing player-related operations in the AquaStark ecosystem.
 * Provides functions for registering, retrieving, verifying players, and handling usernames.
 *
 * @returns {object} Object containing player management functions.
 *
 * @example
 * ```ts
 * const { registerPlayer, getPlayer, isVerified } = usePlayer();
 *
 * // Register a player
 * await registerPlayer(account, "MyUsername");
 *
 * // Get player info
 * const player = await getPlayer("0x123...");
 *
 * // Check verification
 * const verified = await isVerified("0x123...");
 * ```
 */
export const usePlayer = () => {
  const { client } = useDojoSDK();

  /**
   * Registers a new player with a given username.
   *
   * @param {AccountInterface | undefined} account - StarkNet account instance.
   * @param {string} username - Chosen username for the player.
   * @returns {Promise<any>} Transaction result of registration.
   * @throws {Error} If the username is too long or the transaction fails.
   */
  const registerPlayer = useCallback(
    async (account: AccountInterface | undefined, username: string) => {
      try {
        const usernameFelt = stringToFelt(username);
        if (Array.isArray(usernameFelt)) {
          throw new Error('Username is too long.');
        }
        return await client.AquaStark.register(
          account,
          usernameFelt as BigNumberish
        );
      } catch (error) {
        console.error('Error registering player:', error);
        throw error;
      }
    },
    [client]
  );

  /**
   * Retrieves player data by address.
   *
   * @param {string} address - Player wallet address.
   * @returns {Promise<any>} Player data.
   * @throws {Error} If client is missing or query fails.
   */
  const getPlayer = useCallback(
    async (address: string) => {
      try {
        if (!client || !client.AquaStark) return alert('No client found');
        return await client.AquaStark.getPlayer(address, { blockId: 'latest' });
      } catch (error) {
        console.error('Error getting player:', error);
        throw error;
      }
    },
    [client]
  );

  /**
   * Gets a username from a player's address.
   *
   * @param {string} address - Player wallet address.
   * @returns {Promise<string>} Username associated with the address.
   */
  const getUsernameFromAddress = useCallback(
    async (address: string) => {
      try {
        return await client.AquaStark.getUsernameFromAddress(address);
      } catch (error) {
        console.error('Error getting username from address:', error);
        throw error;
      }
    },
    [client]
  );

  /**
   * Creates a new unique player ID.
   *
   * @param {Account | AccountInterface} account - StarkNet account instance.
   * @returns {Promise<BigNumberish>} Newly created player ID.
   */
  const createNewPlayerId = useCallback(
    async (account: Account | AccountInterface) => {
      try {
        return await client.AquaStark.createNewPlayerId(account);
      } catch (error) {
        console.error('Error creating new player ID:', error);
        throw error;
      }
    },
    [client]
  );

  /**
   * Checks if a player is verified.
   *
   * @param {string} playerAddress - Address of the player.
   * @returns {Promise<boolean>} True if player is verified, false otherwise.
   */
  const isVerified = useCallback(
    async (playerAddress: string): Promise<boolean> => {
      try {
        return await client.AquaStark.isVerified(playerAddress);
      } catch (error) {
        console.error('Error checking verification status:', error);
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
    isVerified,
  };
};
