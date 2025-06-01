use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct FishCreated {
    #[key]
    pub id: u64,
    pub owner: ContractAddress,
    pub fish_type: u32,
}

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
