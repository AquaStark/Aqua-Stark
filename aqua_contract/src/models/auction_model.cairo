// models/auction_model.cairo
use starknet::ContractAddress;
use core::option::Option;

#[derive(Drop, Serde, Debug, Clone)]
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
    pub is_active: bool,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct AuctionCounter {
    #[key]
    pub target: felt252,
    pub current_val: u256,
}

pub fn auction_id_target() -> felt252 {
    'AUCTION_COUNTER'
}