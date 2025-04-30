use starknet::{ContractAddress, get_block_timestamp};
use crate::models::AuctionStatus;
use dojo_starter::entities::base::Bid;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Auction {
    #[key]
    pub id: u64,
    pub fish_id: u64,
    pub start_price: u256,
    pub final_price: u256,
    pub end_date: u64,
    pub highest_bid: Option<Bid>,
    pub no_of_bids: u32,
    pub payment_token: ContractAddress,
    pub creator: ContractAddress,
    pub status: AuctionStatus,
}

pub trait AuctionTrait<T, +Serde<T>, +Drop<T>> {
    fn is_active(self: @T) -> bool;
    fn is_canceled(self: @T) -> bool;
    fn is_completed(self: @T) -> bool;
    fn is_valid_bid(self: @T, bid: @Bid) -> bool;
    fn can_cancel(self: @T) -> bool;
}

impl AutionItemImpl of AuctionTrait<Auction> {
    fn is_active(self: @Auction) -> bool {
        match self.status {
            AuctionStatus::Active => {
                let current_time = get_block_timestamp();
                @current_time < self.end_date
            },
            _ => false,
        }
    }

    fn is_canceled(self: @Auction) -> bool {
        self.status == @AuctionStatus::Cancelled
    }

    fn is_completed(self: @Auction) -> bool {
        self.status == @AuctionStatus::Completed
    }

    fn is_valid_bid(self: @Auction, bid: @Bid) -> bool {
        match self.highest_bid {
            Option::Some(highest_bid) => bid.bid_amount > highest_bid.bid_amount,
            Option::None => bid.bid_amount >= self.start_price,
        }
    }

    fn can_cancel(self: @Auction) -> bool {
        match self.status {
            AuctionStatus::Active => self.no_of_bids == @0_u32,
            _ => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::Auction;
    use super::*;
    use starknet::contract_address_const;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_auction_creation() {
        let auction = Auction {
            id: 1,
            fish_id: 1,
            start_price: 100_u256,
            final_price: 0_u256,
            end_date: 2000000,
            highest_bid: Option::None,
            no_of_bids: 5,
            creator: zero_address(),
            payment_token: zero_address(),
            status: AuctionStatus::Active,
        };
        assert(auction.start_price == 100_u256, 'Start price should match');
    }
}
