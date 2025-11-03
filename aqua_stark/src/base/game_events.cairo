use starknet::ContractAddress;

// Game-specific fish events (with experience tracking)
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishGameCreated {
    #[key]
    pub fish_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub aquarium_id: u256,
    pub species: felt252,
    pub experience_earned: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishGameMoved {
    #[key]
    pub fish_id: u256,
    pub from_aquarium: u256,
    pub to_aquarium: u256,
    pub owner: ContractAddress,
    pub experience_earned: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishGameBred {
    #[key]
    pub offspring_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub parent1_id: u256,
    pub parent2_id: u256,
    pub aquarium_id: u256,
    pub experience_earned: u256,
    pub timestamp: u64,
}

// Game-specific decoration events (with experience tracking)
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationGameMoved {
    #[key]
    pub decoration_id: u256,
    pub from_aquarium: u256,
    pub to_aquarium: u256,
    pub owner: ContractAddress,
    pub experience_earned: u256,
    pub timestamp: u64,
}

// Game-specific marketplace events (with experience tracking)
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishGameListed {
    #[key]
    pub fish_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub price: u256,
    pub experience_earned: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishGamePurchased {
    #[key]
    pub fish_id: u256,
    pub buyer: ContractAddress,
    pub seller: ContractAddress,
    pub price: u256,
    pub experience_earned: u256,
    pub timestamp: u64,
}

// Experience and leveling events
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct GameExperienceEarned {
    #[key]
    pub player: ContractAddress,
    pub amount: u256,
    pub total_experience: u256,
    pub action_type: felt252, // "fish_creation", "fish_movement", "breeding", etc.
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct GameLevelUp {
    #[key]
    pub player: ContractAddress,
    pub old_level: u32,
    pub new_level: u32,
    pub total_experience: u256,
    pub timestamp: u64,
}

// Game state change events
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct GameStateChanged {
    #[key]
    pub player: ContractAddress,
    pub state_type: felt252, // "fish_created", "fish_moved", "fish_bred", etc.
    pub state_value: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct GameOperationCompleted {
    #[key]
    pub player: ContractAddress,
    pub operation_type: felt252,
    pub success: bool,
    pub timestamp: u64,
}
