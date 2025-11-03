use aqua_stark::models::trade_model::MatchCriteria;
use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PlayerCreated {
    #[key]
    pub username: felt252,
    #[key]
    pub player: ContractAddress,
    pub player_id: u256,
    pub aquarium_id: u256,
    pub decoration_id: u256,
    pub fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationCreated {
    #[key]
    pub id: u256,
    #[key]
    pub aquarium_id: u256,
    pub owner: ContractAddress,
    pub name: felt252,
    pub rarity: felt252,
    pub price: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishCreated {
    #[key]
    pub fish_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub aquarium_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishBred {
    #[key]
    pub offspring_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub parent1_id: u256,
    pub parent2_id: u256,
    pub aquarium_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishMoved {
    #[key]
    pub fish_id: u256,
    pub from: u256,
    pub to: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationMoved {
    #[key]
    pub decoration_id: u256,
    pub from: u256,
    pub to: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishAddedToAquarium {
    #[key]
    pub fish_id: u256,
    #[key]
    pub aquarium_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationAddedToAquarium {
    #[key]
    pub decoration_id: u256,
    #[key]
    pub aquarium_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PlayerEventLogged {
    #[key]
    pub id: u256,
    #[key]
    pub event_type_id: u256,
    pub player: ContractAddress,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct EventTypeRegistered {
    #[key]
    pub event_type_id: u256,
    pub timestamp: u64,
}

// Transaction lifecycle events
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TransactionInitiated {
    #[key]
    pub transaction_id: u256,
    #[key]
    pub player: ContractAddress,
    pub event_type_id: u256,
    pub payload_size: u32,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TransactionProcessed {
    #[key]
    pub transaction_id: u256,
    #[key]
    pub player: ContractAddress,
    pub event_type_id: u256,
    pub processing_time: u64,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TransactionConfirmed {
    #[key]
    pub transaction_id: u256,
    #[key]
    pub player: ContractAddress,
    pub event_type_id: u256,
    pub confirmation_hash: felt252,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishPurchased {
    #[key]
    pub buyer: ContractAddress,
    pub seller: ContractAddress,
    pub price: u256,
    pub fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct AuctionStarted {
    #[key]
    pub auction_id: u256,
    #[key]
    pub seller: ContractAddress,
    pub fish_id: u256,
    pub start_time: u64,
    pub end_time: u64,
    pub reserve_price: u256,
}


#[derive(Drop, Serde)]
#[dojo::event]
pub struct BidPlaced {
    #[key]
    pub auction_id: u256,
    pub bidder: ContractAddress,
    pub amount: u256,
}


#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionEnded {
    #[key]
    pub auction_id: u256,
    pub winner: Option<ContractAddress>,
    pub final_price: u256,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferCreated {
    #[key]
    pub offer_id: u256,
    #[key]
    pub creator: ContractAddress,
    pub offered_fish_id: u256,
    pub criteria: felt252,
    pub requested_fish_id: Option<u256>,
    pub requested_species: Option<u8>,
    pub requested_generation: Option<u8>,
    pub expires_at: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferAccepted {
    #[key]
    pub offer_id: u256,
    #[key]
    pub acceptor: ContractAddress,
    #[key]
    pub creator: ContractAddress,
    pub creator_fish_id: u256,
    pub acceptor_fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferCancelled {
    #[key]
    pub offer_id: u256,
    #[key]
    pub creator: ContractAddress,
    pub offered_fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishLocked {
    #[key]
    pub fish_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub locked_by_offer: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishUnlocked {
    #[key]
    pub fish_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct TradeOfferExpired {
    #[key]
    pub offer_id: u256,
    #[key]
    pub creator: ContractAddress,
    pub offered_fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ExperienceEarned {
    #[key]
    pub player: ContractAddress,
    pub amount: u64,
    pub total_experience: u64,
}

// Aquarium-specific events
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct AquariumCreated {
    #[key]
    pub aquarium_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub max_capacity: u32,
    pub max_decorations: u32,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct LevelUp {
    #[key]
    pub player: ContractAddress,
    pub old_level: u32,
    pub new_level: u32,
    pub total_experience: u64,
}

pub struct AquariumUpdated {
    #[key]
    pub aquarium_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub old_max_capacity: u32,
    pub new_max_capacity: u32,
    pub old_max_decorations: u32,
    pub new_max_decorations: u32,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct AquariumCleaned {
    #[key]
    pub aquarium_id: u256,
    #[key]
    pub owner: ContractAddress,
    pub amount_cleaned: u32,
    pub old_cleanliness: u32,
    pub new_cleanliness: u32,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct RewardClaimed {
    #[key]
    pub player: ContractAddress,
    pub level: u32,
    pub reward_type: felt252,
}

pub struct AquariumCleanlinessDecayed {
    #[key]
    pub aquarium_id: u256,
    pub hours_passed: u32,
    pub old_cleanliness: u32,
    pub new_cleanliness: u32,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ExperienceConfigUpdated {
    #[key]
    pub base_experience: u64,
    pub experience_multiplier: u64,
    pub max_level: u32,
}

pub struct FishRemovedFromAquarium {
    #[key]
    pub aquarium_id: u256,
    #[key]
    pub fish_id: u256,
    pub timestamp: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct DecorationRemovedFromAq {
    #[key]
    pub aquarium_id: u256,
    #[key]
    pub decoration_id: u256,
    pub timestamp: u64,
}
