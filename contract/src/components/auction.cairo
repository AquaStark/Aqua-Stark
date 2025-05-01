use starknet::ContractAddress;

const AUCTION_ID_TARGET: felt252 = 'AUCTION';

#[starknet::interface]
pub trait IAuctionState<TContractState> {
    fn create_auction(
        ref self: TContractState,
        fish_id: u64,
        start_price: u256,
        end_date: u64,
        payment_token: ContractAddress,
    ) -> u64;
    fn make_bid(ref self: TContractState, auction_id: u64, bid_amount: u256);
    fn cancel_auction(ref self: TContractState, auction_id: u64);
    fn end_auction(ref self: TContractState, auction_id: u64);
}

#[dojo::contract]
pub mod AuctionState {
    use super::*;
    use dojo_starter::entities::{auction::{Auction, AuctionTrait}, fish::Fish};
    use dojo_starter::entities::base::{
        AuctionCreated, NewBid, AuctionCanceled, AuctionCompleted, Bid, Id, CustomErrors,
    };
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use dojo_starter::models::AuctionStatus;
    use starknet::{
        get_caller_address, get_block_timestamp, contract_address_const, get_contract_address,
    };
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use core::option::Option;


    #[abi(embed_v0)]
    impl AuctionStateImpl of IAuctionState<ContractState> {
        fn create_auction(
            ref self: ContractState,
            fish_id: u64,
            start_price: u256,
            end_date: u64,
            payment_token: ContractAddress,
        ) -> u64 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_date = get_block_timestamp();

            // Get Fish state
            let fish: Fish = world.read_model(fish_id);

            // Check ownership
            assert(fish.owner == caller, CustomErrors::NOT_OWNER);

            // Run Validations
            assert(start_price > 0, CustomErrors::INVALID_START_PRICE);
            assert(end_date > current_date, CustomErrors::END_DATE_IN_PAST);
            assert(payment_token != self.zero_address(), CustomErrors::INVALID_TOKEN);

            // Generate new Auction ID
            let auction_id = self.generate_auction_id();

            // Create new auction
            let auction = Auction {
                id: auction_id,
                fish_id,
                start_price,
                final_price: 0,
                end_date,
                highest_bid: Option::None,
                no_of_bids: 0,
                creator: fish.owner,
                payment_token,
                status: AuctionStatus::Active,
            };

            // Write to world state
            world.write_model(@auction);

            // Emit event
            let created_event = AuctionCreated {
                id: auction_id, fish_id, creator: auction.creator, start_price, end_date,
            };
            world.emit_event(@created_event);

            auction_id
        }


        fn make_bid(ref self: ContractState, auction_id: u64, bid_amount: u256) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let this_contract = get_contract_address();

            // Read current fish state
            let mut auction: Auction = world.read_model(auction_id);

            // Check if auction is still active
            assert(!auction.is_completed(), CustomErrors::AUCTION_COMPLETED);
            assert(!auction.is_canceled(), CustomErrors::AUCTION_CANCELED);
            assert(auction.is_active(), CustomErrors::AUCTION_ENDED);

            // Create new bid
            let bid = Bid { id: auction.no_of_bids, bidder: caller, bid_amount };

            // Check if bid is valid
            assert(auction.is_valid_bid(@bid), CustomErrors::INVALID_BID);
            let token_dispatcher = IERC20Dispatcher { contract_address: auction.payment_token };

            // Check if there was an existing bid
            if let Option::Some(prev_bid) = auction.highest_bid {
                // Transfer back funds to prev_bidder
                assert(
                    token_dispatcher.transfer(prev_bid.bidder, prev_bid.bid_amount),
                    CustomErrors::TOKEN_TRANSFER_FAILED,
                );
            }

            // Transfer new bid
            assert(
                token_dispatcher.transfer_from(caller, this_contract, bid_amount),
                CustomErrors::TOKEN_TRANSFER_FAILED,
            );

            // Update highest bid
            auction.highest_bid = Option::Some(bid);

            // Increment number of bids
            auction.no_of_bids += 1;

            // Write updated state
            world.write_model(@auction);

            // Emit event
            let bid_event = NewBid { auction_id, bidder: caller, bid_amount };
            world.emit_event(@bid_event);
        }

        fn cancel_auction(ref self: ContractState, auction_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current auction state
            let mut auction: Auction = world.read_model(auction_id);

            // Check ownership
            assert(auction.creator == caller, CustomErrors::NOT_OWNER);

            // Check if owner can cancel
            assert(!auction.is_completed(), CustomErrors::AUCTION_COMPLETED);
            assert(!auction.is_canceled(), CustomErrors::AUCTION_CANCELED);
            assert(auction.can_cancel(), CustomErrors::CANNOT_CANCEL_AUCTION);

            // Update Status
            auction.status = AuctionStatus::Cancelled;

            // Write updated state
            world.write_model(@auction);

            // Emit event
            let bid_event = AuctionCanceled {
                auction_id, creator: caller, timestamp: get_block_timestamp(),
            };
            world.emit_event(@bid_event);
        }

        fn end_auction(ref self: ContractState, auction_id: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current auction state
            let mut auction: Auction = world.read_model(auction_id);

            // Check if auction can be completed
            assert(!auction.is_completed(), CustomErrors::AUCTION_COMPLETED);
            assert(!auction.is_canceled(), CustomErrors::AUCTION_CANCELED);
            assert(!auction.is_active(), CustomErrors::AUCTION_NOT_ENDED);

            // Check ownership
            assert(auction.creator == caller, CustomErrors::NOT_OWNER);

            if let Option::Some(highest_bid) = auction.highest_bid {
                // Create token dispatcher
                let token_dispatcher = IERC20Dispatcher { contract_address: auction.payment_token };

                // Read current fish state
                let mut fish: Fish = world.read_model(auction.fish_id);

                let bid_amount = highest_bid.bid_amount;
                let bidder = highest_bid.bidder;

                let prev_owner = fish.owner.clone();

                // Transfer Ownership
                fish.owner = bidder;

                // Write updated state
                world.write_model(@fish);

                // Set Auction final price
                auction.final_price = bid_amount;

                // send payments to prev fish owner
                let _ = prev_owner;

                // Transfer auction final price to previous owner
                assert(
                    token_dispatcher.transfer(prev_owner, bid_amount),
                    CustomErrors::TOKEN_TRANSFER_FAILED,
                );

                // Emit event
                let bid_event = AuctionCompleted {
                    auction_id, winner: bidder, final_price: bid_amount,
                };
                world.emit_event(@bid_event);
            }

            // Update Status
            auction.status = AuctionStatus::Completed;

            // Write updated state
            world.write_model(@auction);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            // self.world(@"aquastark")
            self.world(@"dojo_starter")
        }

        fn generate_auction_id(self: @ContractState) -> u64 {
            let mut world = self.world_default();
            let mut auction_id: Id = world.read_model(AUCTION_ID_TARGET);
            let new_id = auction_id.nonce + 1;
            auction_id.nonce = new_id;
            world.write_model(@auction_id);
            new_id
        }

        fn zero_address(self: @ContractState) -> ContractAddress {
            contract_address_const::<0>()
        }
    }
}
