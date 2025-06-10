// Daily Rewards System - Dojo Contract

#[dojo::contract]
pub mod DailyRewardsSystem {
    use od14contracts::models::player_model::Player;
    use dojo::world::WorldStorage;
    use starknet::{get_block_timestamp};
    use core::traits::Into;
    use core::u256;

    // Reward table for streak days (1-indexed)
    const REWARD_TABLE: [u64; 7] = [10, 20, 30, 40, 50, 75, 100];

    #[abi(embed_v0)]
    impl DailyRewardsImpl of DailyRewardsTrait<ContractState> {
        fn player_login(ref self: ContractState, player_id: u256, current_day: u64) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_id);

            // If never logged in before (last_login_day == 0)
            if player.last_login_day == 0 {
                player.last_login_day = current_day;
                player.streak_counter = 1;
                player.rewards_delivered += get_reward_for_streak(1u64);
                world.write_model(@player);
                return ();
            }

            // Already logged in today
            if player.last_login_day == current_day {
                return ();
            }

            // Consecutive login (yesterday)
            if player.last_login_day + 1 == current_day {
                player.streak_counter += 1u64;
                let reward = get_reward_for_streak(player.streak_counter);
                player.rewards_delivered += reward;
                player.last_login_day = current_day;
                world.write_model(@player);
                return ();
            }

            // Missed a day, reset streak
            player.streak_counter = 1u64;
            player.last_login_day = current_day;
            player.rewards_delivered += get_reward_for_streak(1u64);
            world.write_model(@player);
            return ();
        }

        fn get_player_status(ref self: ContractState, player_id: u256) -> (u64, u64) {
            let mut world = self.world_default();
            let player: Player = world.read_model(player_id);
            return (player.streak_counter, player.rewards_delivered);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@"dojo_starter")
        }
    }

    // Helper: get reward for streak
    fn get_reward_for_streak(streak: u64) -> u64 {
        if streak == 0u64 {
            return 0u64;
        } else if streak > 7u64 {
            return REWARD_TABLE[6];
        } else {
            return REWARD_TABLE[(streak - 1) as usize];
        }
    }
}
