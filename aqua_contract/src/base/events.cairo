use starknet::{ContractAddress};
use aqua_stark::models::trade_model::MatchCriteria;

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
    pub criteria: MatchCriteria,
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
