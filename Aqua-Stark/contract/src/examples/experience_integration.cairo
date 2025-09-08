use aqua_stark::components::experience::{
    IPlayerExperienceDispatcher, IPlayerExperienceDispatcherTrait,
};
/// Example demonstrating how external contracts can integrate with the experience system
use starknet::ContractAddress;

// Example: Fish breeding system that rewards experience
#[starknet::contract]
mod FishBreedingSystem {
    use starknet::{get_caller_address, get_contract_address};
    use super::*;

    #[storage]
    struct Storage {
        experience_contract: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, experience_contract: ContractAddress) {
        self.experience_contract.write(experience_contract);
    }

    #[external(v0)]
    fn breed_fish(ref self: ContractState, player: ContractAddress) {
        // Breeding logic here...

        // Reward experience for successful breeding
        let exp_system = IPlayerExperienceDispatcher {
            contract_address: self.experience_contract.read(),
        };

        exp_system.grant_experience(player, 100); // 100 XP for breeding
    }
}

// Example: Achievement system that rewards experience
#[starknet::contract]
mod AchievementSystem {
    use super::*;

    #[storage]
    struct Storage {
        experience_contract: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, experience_contract: ContractAddress) {
        self.experience_contract.write(experience_contract);
    }

    #[external(v0)]
    fn unlock_achievement(ref self: ContractState, player: ContractAddress, achievement_id: u32) {
        // Achievement unlock logic here...

        // Reward experience based on achievement rarity
        let exp_reward = match achievement_id {
            1 => 50, // Common achievement
            2 => 100, // Uncommon achievement
            3 => 250, // Rare achievement
            4 => 500, // Epic achievement
            _ => 1000 // Legendary achievement
        };

        let exp_system = IPlayerExperienceDispatcher {
            contract_address: self.experience_contract.read(),
        };

        exp_system.grant_experience(player, exp_reward);
    }
}

// Example: Quest system that rewards experience
#[starknet::contract]
mod QuestSystem {
    use super::*;

    #[storage]
    struct Storage {
        experience_contract: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, experience_contract: ContractAddress) {
        self.experience_contract.write(experience_contract);
    }

    #[external(v0)]
    fn complete_quest(ref self: ContractState, player: ContractAddress, quest_difficulty: u32) {
        // Quest completion logic here...

        // Reward experience based on quest difficulty
        let base_reward = 75_u64;
        let difficulty_multiplier = quest_difficulty.into();
        let total_reward = base_reward * difficulty_multiplier;

        let exp_system = IPlayerExperienceDispatcher {
            contract_address: self.experience_contract.read(),
        };

        exp_system.grant_experience(player, total_reward);
    }
}
