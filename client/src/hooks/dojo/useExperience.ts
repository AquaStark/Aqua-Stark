import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the Experience client.
 *
 * Exposes functions to grant experience, retrieve player experience, update configs,
 * initialize player experience, and query level-related information.
 *
 * @returns {Object} An object containing methods for managing experience:
 * - `grantExperience(account, player, amount)`
 * - `getPlayerExperience(player)`
 * - `getExperienceConfig()`
 * - `updateExperienceConfig(account, baseExperience, experienceMultiplier, maxLevel)`
 * - `initializePlayerExperience(account, player)`
 * - `getLevelProgress(player)`
 * - `getExperienceForNextLevel(player)`
 * - `claimLevelReward(account, level)`
 * - `getTotalExperienceGranted()`
 *
 * @example
 * const {
 *   grantExperience,
 *   getPlayerExperience,
 *   claimLevelReward
 * } = useExperience();
 *
 * // Grant experience to a player
 * await grantExperience(account, "0xPlayer", 100);
 *
 * // Fetch player experience
 * const experience = await getPlayerExperience("0xPlayer");
 *
 * // Claim a level reward
 * await claimLevelReward(account, 5);
 */
export const useExperience = () => {
  const { client } = useDojoSDK();

  /**
   * Grants experience to a player.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} player - Address of the player.
   * @param {BigNumberish} amount - Amount of experience to grant.
   * @returns {Promise<any>} Result of the transaction.
   */
  const grantExperience = useCallback(
    async (
      account: Account | AccountInterface,
      player: string,
      amount: BigNumberish
    ) => {
      return await client.Experience.grant_experience(account, player, amount);
    },
    [client]
  );

  /**
   * Retrieves the experience data for a player.
   * @param {string} player - Address of the player.
   * @returns {Promise<models.Experience>} Player experience data.
   */
  const getPlayerExperience = useCallback(
    async (player: string) => {
      return await client.Experience.get_player_experience(player);
    },
    [client]
  );

  /**
   * Retrieves the global experience configuration.
   * @returns {Promise<models.ExperienceConfig>} Experience config data.
   */
  const getExperienceConfig = useCallback(async () => {
    return await client.Experience.get_experience_config();
  }, [client]);

  /**
   * Updates the global experience configuration.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} baseExperience - Base experience value.
   * @param {BigNumberish} experienceMultiplier - Experience multiplier.
   * @param {BigNumberish} maxLevel - Maximum level.
   * @returns {Promise<any>} Result of the transaction.
   */
  const updateExperienceConfig = useCallback(
    async (
      account: Account | AccountInterface,
      baseExperience: BigNumberish,
      experienceMultiplier: BigNumberish,
      maxLevel: BigNumberish
    ) => {
      return await client.Experience.update_experience_config(
        account,
        baseExperience,
        experienceMultiplier,
        maxLevel
      );
    },
    [client]
  );

  /**
   * Initializes experience for a new player.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {string} player - Address of the player.
   * @returns {Promise<any>} Result of the transaction.
   */
  const initializePlayerExperience = useCallback(
    async (
      account: Account | AccountInterface,
      player: string
    ) => {
      return await client.Experience.initialize_player_experience(account, player);
    },
    [client]
  );

  /**
   * Retrieves the level progress for a player (current XP, required XP).
   * @param {string} player - Address of the player.
   * @returns {Promise<[number, number]>} Tuple of (current XP, required XP for next level).
   */
  const getLevelProgress = useCallback(
    async (player: string) => {
      return await client.Experience.get_level_progress(player);
    },
    [client]
  );

  /**
   * Retrieves the experience required for the next level for a player.
   * @param {string} player - Address of the player.
   * @returns {Promise<number>} Experience needed for next level.
   */
  const getExperienceForNextLevel = useCallback(
    async (player: string) => {
      return await client.Experience.get_experience_for_next_level(player);
    },
    [client]
  );

  /**
   * Claims a level reward for the specified level.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} level - Level to claim reward for.
   * @returns {Promise<any>} Result of the transaction.
   */
  const claimLevelReward = useCallback(
    async (
      account: Account | AccountInterface,
      level: BigNumberish
    ) => {
      return await client.Experience.claim_level_reward(account, level);
    },
    [client]
  );

  /**
   * Retrieves the total experience granted globally.
   * @returns {Promise<any>} Total experience granted.
   */
  const getTotalExperienceGranted = useCallback(async () => {
    return await client.Experience.get_total_experience_granted();
  }, [client]);

  return {
    grantExperience,
    getPlayerExperience,
    getExperienceConfig,
    updateExperienceConfig,
    initializePlayerExperience,
    getLevelProgress,
    getExperienceForNextLevel,
    claimLevelReward,
    getTotalExperienceGranted,
  };
};