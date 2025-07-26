use starknet::{ContractAddress};

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
