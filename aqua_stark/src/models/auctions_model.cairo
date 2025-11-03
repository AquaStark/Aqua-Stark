use starknet::ContractAddress;
// use aqua_stark::base::events::AuctionStarted;

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct Auction {
    #[key]
    pub auction_id: u256,
    pub seller: ContractAddress,
    pub fish_id: u256,
    pub start_time: u64,
    pub end_time: u64,
    pub reserve_price: u256,
    pub highest_bid: u256,
    pub highest_bidder: Option<ContractAddress>,
    pub active: bool,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct FishOwnerA {
    #[key]
    pub fish_id: u256,
    pub owner: ContractAddress,
    pub locked: bool,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct AuctionCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
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
pub struct AuctionEnded {
    #[key]
    pub auction_id: u256,
    pub winner: Option<ContractAddress>,
    pub final_price: u256,
}

#[derive(Drop, Serde)]
#[dojo::event]
pub struct BidPlaced {
    #[key]
    pub auction_id: u256,
    pub bidder: ContractAddress,
    pub amount: u256,
}

