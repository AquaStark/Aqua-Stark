import { GameActionParams, GameActionResult } from '@/types';

const GAME_CONTRACT =
  '0x0000000000000000000000000000000000000000000000000000000000000001';
const REWARDS_CONTRACT =
  '0x0000000000000000000000000000000000000000000000000000000000000004';

/**
 * Custom hook that provides functions to execute in-game actions on the blockchain.
 *
 * This hook encapsulates all game-related contract interactions, such as feeding fish,
 * cleaning the aquarium, collecting rewards, and performing upgrades. Each action
 * simulates a Starknet transaction by returning a mock transaction hash after a delay.
 *
 * @returns {{
 *   feedFish: (fishId: string) => Promise<GameActionResult>;
 *   cleanAquarium: () => Promise<GameActionResult>;
 *   collectRewards: () => Promise<GameActionResult>;
 *   upgradeAquarium: (upgradeType: string) => Promise<GameActionResult>;
 *   dailyMaintenance: (fishIds: string[]) => Promise<GameActionResult>;
 * }} An object containing functions to perform various game actions.
 *
 * @example
 * ```tsx
 * const { feedFish, cleanAquarium } = useGameActions();
 *
 * const handleFeed = async () => {
 *   const result = await feedFish('fish-001');
 *   console.log('Transaction hash:', result.hash);
 * };
 *
 * const handleClean = async () => {
 *   await cleanAquarium();
 * };
 * ```
 */
export function useGameActions() {
  /**
   * Executes a batch of game actions by simulating a blockchain transaction.
   *
   * @param {GameActionParams} params - The parameters for the action execution.
   * @param {Array<{ contractAddress: string; entrypoint: string; calldata: string[] }>} params.calls - Array of contract calls to execute.
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const executeAction = async ({
    calls,
  }: GameActionParams): Promise<GameActionResult> => {
    // Simulate processing the calls
    console.debug('Processing calls:', calls.length);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { hash: '0x123...' };
  };

  /**
   * Feeds a specific fish by executing the corresponding contract call.
   *
   * @param {string} fishId - The unique identifier of the fish to feed.
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const feedFish = async (fishId: string) => {
    return await executeAction({
      calls: [
        {
          contractAddress: GAME_CONTRACT,
          entrypoint: 'feed_fish',
          calldata: [fishId],
        },
      ],
    });
  };

  /**
   * Cleans the entire aquarium by executing the corresponding contract call.
   *
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const cleanAquarium = async () => {
    return await executeAction({
      calls: [
        {
          contractAddress: GAME_CONTRACT,
          entrypoint: 'clean_aquarium',
          calldata: [],
        },
      ],
    });
  };

  /**
   * Collects available rewards by executing the corresponding contract call.
   *
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const collectRewards = async () => {
    return await executeAction({
      calls: [
        {
          contractAddress: GAME_CONTRACT,
          entrypoint: 'collect_rewards',
          calldata: [],
        },
      ],
    });
  };

  /**
   * Upgrades the aquarium with the specified upgrade type.
   *
   * @param {string} upgradeType - The type of upgrade to apply (e.g., 'filter', 'lighting').
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const upgradeAquarium = async (upgradeType: string) => {
    return await executeAction({
      calls: [
        {
          contractAddress: GAME_CONTRACT,
          entrypoint: 'upgrade_aquarium',
          calldata: [upgradeType],
        },
      ],
    });
  };

  /**
   * Performs daily maintenance by combining multiple actions into a single transaction:
   * cleaning the aquarium, feeding all specified fish, collecting rewards, and claiming daily rewards.
   *
   * @param {string[]} fishIds - Array of fish IDs to feed during maintenance.
   * @returns {Promise<GameActionResult>} A promise that resolves to the transaction result.
   */
  const dailyMaintenance = async (fishIds: string[]) => {
    const calls = [
      {
        contractAddress: GAME_CONTRACT,
        entrypoint: 'clean_aquarium',
        calldata: [],
      },
      ...fishIds.map(id => ({
        contractAddress: GAME_CONTRACT,
        entrypoint: 'feed_fish',
        calldata: [id],
      })),
      {
        contractAddress: GAME_CONTRACT,
        entrypoint: 'collect_rewards',
        calldata: [],
      },
      {
        contractAddress: REWARDS_CONTRACT,
        entrypoint: 'collect_daily',
        calldata: [],
      },
    ];

    return await executeAction({ calls });
  };

  return {
    feedFish,
    cleanAquarium,
    collectRewards,
    upgradeAquarium,
    dailyMaintenance,
  };
}
