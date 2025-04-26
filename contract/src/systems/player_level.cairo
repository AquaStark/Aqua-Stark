use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::ContractAddress;

#[starknet::interface]
trait IPlayerLevel<TContractState> {
    fn grant_experience(self: @TContractState, player_id: u64, amount: u64) -> u32;
    fn get_player_stats(self: @TContractState, player_id: u64) -> (u64, u32);
}

#[dojo::contract]
mod player_level {
    use super::IPlayerLevel;
    use starknet::{ContractAddress, get_caller_address};
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::super::components::player_level::{PlayerLevel, get_level_threshold};

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ExperienceGained: ExperienceGained,
        LevelUp: LevelUp,
    }

    #[derive(Drop, starknet::Event)]
    struct ExperienceGained {
        player_id: u64,
        amount: u64,
        total_experience: u64
    }

    #[derive(Drop, starknet::Event)]
    struct LevelUp {
        player_id: u64,
        new_level: u32
    }

    #[external(v0)]
    impl PlayerLevelImpl of IPlayerLevel<ContractState> {
        fn grant_experience(
            self: @ContractState, player_id: u64, amount: u64
        ) -> u32 {
            // Get current player level data
            let world = self.world_dispatcher.read();
            let mut player_level = get!(world, player_id, PlayerLevel);

            // Update experience
            let new_experience = player_level.experience + amount;
            player_level.experience = new_experience;

            // Calculate new level based on total experience
            let mut current_level = player_level.level;
            let mut next_level = current_level + 1;
            
            // Check if player can level up
            loop {
                let next_threshold = get_level_threshold(next_level);
                if new_experience >= next_threshold {
                    current_level = next_level;
                    next_level += 1;
                    // Emit level up event
                    emit!(world, LevelUp { player_id, new_level: current_level });
                } else {
                    break;
                }
            };

            player_level.level = current_level;

            // Emit experience gained event
            emit!(world, ExperienceGained { 
                player_id, 
                amount, 
                total_experience: new_experience 
            });

            // Update player level data
            set!(world, (player_level));

            current_level
        }

        fn get_player_stats(self: @ContractState, player_id: u64) -> (u64, u32) {
            let world = self.world_dispatcher.read();
            let player_level = get!(world, player_id, PlayerLevel);
            (player_level.experience, player_level.level)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::player_level;
    use super::IPlayerLevel;
    use dojo::world::IWorldDispatcher;
    use super::super::components::player_level::PlayerLevel;

    #[test]
    fn test_grant_experience() {
        // Initialize world and systems
        let world = setup_world();
        let player_id = 1;

        // Initialize player level
        let initial_player_level = PlayerLevel { 
            player_id, 
            experience: 0, 
            level: 0 
        };
        set!(world, (initial_player_level));

        // Grant experience
        let contract = setup_contract();
        let new_level = contract.grant_experience(player_id, 150);
        
        // Verify level up
        assert(new_level == 2, 'Should be level 2');

        // Check final stats
        let (exp, level) = contract.get_player_stats(player_id);
        assert(exp == 150, 'Experience should be 150');
        assert(level == 2, 'Level should be 2');
    }
}