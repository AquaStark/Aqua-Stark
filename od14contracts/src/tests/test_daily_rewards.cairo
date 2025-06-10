#[cfg(test)]
mod tests {
    use super::*;
    use dojo::test_utils::{deploy_contract, call_contract};
    use od14contracts::systems::daily_rewards_system::DailyRewardsSystem;
    use core::u256;

    #[test]
    fn test_first_login() {
        let contract = deploy_contract::<DailyRewardsSystem>();
        let player_id = u256::from_u64(1u64);
        let day1 = 1u64;
        contract.player_login(player_id, day1);
        let (streak, rewards) = contract.get_player_status(player_id);
        assert(streak == 1u64, 'Streak should be 1 after first login');
        assert(rewards == 10u64, 'Reward should be 10 after first login');
    }

    #[test]
    fn test_consecutive_login() {
        let contract = deploy_contract::<DailyRewardsSystem>();
        let player_id = u256::from_u64(2u64);
        let day1 = 1u64;
        let day2 = 2u64;
        contract.player_login(player_id, day1);
        contract.player_login(player_id, day2);
        let (streak, rewards) = contract.get_player_status(player_id);
        assert(streak == 2u64, 'Streak should be 2 after consecutive login');
        assert(rewards == 30u64, 'Reward should be 30 after two consecutive logins');
    }

    #[test]
    fn test_duplicate_login_same_day() {
        let contract = deploy_contract::<DailyRewardsSystem>();
        let player_id = u256::from_u64(3u64);
        let day1 = 1u64;
        contract.player_login(player_id, day1);
        contract.player_login(player_id, day1);
        let (streak, rewards) = contract.get_player_status(player_id);
        assert(streak == 1u64, 'Streak should remain 1 after duplicate login');
        assert(rewards == 10u64, 'Reward should remain 10 after duplicate login');
    }

    #[test]
    fn test_streak_reset() {
        let contract = deploy_contract::<DailyRewardsSystem>();
        let player_id = u256::from_u64(4u64);
        let day1 = 1u64;
        let day2 = 2u64;
        let day4 = 4u64; // skip day 3
        contract.player_login(player_id, day1);
        contract.player_login(player_id, day2);
        contract.player_login(player_id, day4);
        let (streak, rewards) = contract.get_player_status(player_id);
        assert(streak == 1u64, 'Streak should reset to 1 after missing a day');
        assert(rewards == 40u64, 'Rewards should accumulate correctly after reset');
    }
}
