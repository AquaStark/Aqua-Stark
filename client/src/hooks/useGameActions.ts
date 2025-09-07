import { GameActionParams, GameActionResult } from '@/types/player-types';

const GAME_CONTRACT =
  '0x0000000000000000000000000000000000000000000000000000000000000001';
const REWARDS_CONTRACT =
  '0x0000000000000000000000000000000000000000000000000000000000000004';

export function useGameActions() {
  const executeAction = async ({
    calls,
  }: GameActionParams): Promise<GameActionResult> => {
    // Simulate processing the calls
    console.debug('Processing calls:', calls.length);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { hash: '0x123...' };
  };

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
