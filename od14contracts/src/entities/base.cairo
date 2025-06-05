use starknet::ContractAddress;

// Structs
#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Id {
    #[key]
    pub target: felt252,
    pub nonce: u64,
}

#[derive(Copy, Drop, Serde, Debug, PartialEq, Introspect)]
pub struct Bid {
    pub id: u32,
    pub bid_amount: u256,
    pub bidder: ContractAddress,
}


// Events
#[derive(Drop, Serde)]
#[dojo::event]
pub struct AquariumCreated {
    #[key]
    pub id: u64,
    pub owner: ContractAddress,
    pub max_capacity: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct AquariumCleaned {
    #[key]
    pub aquarium_id: u64,
    pub amount: u32,
    pub new_cleanliness: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct CleanlinessUpdated {
    #[key]
    pub aquarium_id: u64,
    pub hours_passed: u32,
    pub new_cleanliness: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishAdded {
    #[key]
    pub aquarium_id: u64,
    pub fish_id: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishRemoved {
    #[key]
    pub aquarium_id: u64,
    pub fish_id: u64,
}

// Fish Events
#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishCreated {
    #[key]
    pub id: u64,
    pub owner: ContractAddress,
    pub fish_type: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishFed {
    #[key]
    pub fish_id: u64,
    pub amount: u32,
    pub new_hunger: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishGrown {
    #[key]
    pub fish_id: u64,
    pub amount: u32,
    pub new_growth: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishDamaged {
    #[key]
    pub fish_id: u64,
    pub damage_amount: u32,
    pub new_health: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishHealed {
    #[key]
    pub fish_id: u64,
    pub amount: u32,
    pub new_health: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishHungerUpdated {
    #[key]
    pub fish_id: u64,
    pub hours_passed: u32,
    pub new_hunger: u32,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct FishAgeUpdated {
    #[key]
    pub fish_id: u64,
    pub days_passed: u32,
    pub new_age: u32,
}

// Auction Events
#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionCreated {
    #[key]
    pub id: u64,
    pub fish_id: u64,
    pub creator: ContractAddress,
    pub start_price: u256,
    pub end_date: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct NewBid {
    #[key]
    pub auction_id: u64,
    pub bidder: ContractAddress,
    pub bid_amount: u256,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionCanceled {
    #[key]
    pub auction_id: u64,
    pub creator: ContractAddress,
    pub timestamp: u64,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionCompleted {
    #[key]
    pub auction_id: u64,
    pub winner: ContractAddress,
    pub final_price: u256,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FriendRequestSent {
    #[key]
    pub request_id: u64,
    #[key]
    pub player: u64,
    pub sender: u64,
}
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FriendRequestAccepted {
    #[key]
    pub request_id: u64,
    #[key]
    pub player: u64,
    pub sender: u64,
}
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FriendRequestRejected {
    #[key]
    pub request_id: u64,
    #[key]
    pub player: u64,
    pub sender: u64,
}
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FriendRequestDeleted {
    #[key]
    pub request_id: u64,
    #[key]
    pub player: u64,
    pub sender: u64,
}


// Custom Errors
pub mod CustomErrors {
    pub const NOT_OWNER: felt252 = 'CALLER NOT OWNER';
    pub const AQUARIUM_EMPTY: felt252 = 'AQUARIUM IS EMPTY';
    pub const AQUARIUM_FULL: felt252 = 'AQUARIUM IS FULL';
    pub const INVALID_AQUARIUM_ID: felt252 = 'AQUARIUM WITH ID NOT FOUND';
    pub const FISH_DEAD: felt252 = 'FISH IS DEAD';
    pub const INVALID_FISH_ID: felt252 = 'FISH WITH ID NOT FOUND';
    pub const INVALID_HEALTH: felt252 = 'INVALID HEALTH VALUE';
    pub const INVALID_HUNGER: felt252 = 'INVALID HUNGER VALUE';
    pub const INVALID_GROWTH: felt252 = 'INVALID GROWTH VALUE';
    pub const INVALID_BID: felt252 = 'INVALID BID';
    pub const INVALID_START_PRICE: felt252 = 'INVALID START PRICE';
    pub const END_DATE_IN_PAST: felt252 = 'END DATE IN PAST';
    pub const INVALID_TOKEN: felt252 = 'INVALID TOKEN';
    pub const TOKEN_TRANSFER_FAILED: felt252 = 'TOKEN TRANSFER FAILED';
    pub const CANNOT_CANCEL_AUCTION: felt252 = 'CANNOT CANCEL AUCTION';
    pub const AUCTION_COMPLETED: felt252 = 'AUCTION ALREADY COMPLETED';
    pub const AUCTION_CANCELED: felt252 = 'AUCTION ALREADY CANCELED';
    pub const AUCTION_NOT_ENDED: felt252 = 'AUCTION NOT ENDED';
    pub const AUCTION_ENDED: felt252 = 'AUCTION ENDED';
    pub const ALREADY_REGISTERED: felt252 = 'ALREADY_REGISTERED';
}
