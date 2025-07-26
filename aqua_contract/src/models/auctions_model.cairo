use starknet::{ContractAddress};
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
// #[derive(Copy, Drop, Serde)]
// #[dojo::event]
// pub struct AuctionStarted {
//     #[key]
//     pub auction_id: u256,
//     #[key]
//     pub seller: ContractAddress,
//     pub fish_id: u256,
//     pub start_time: u64,
//     pub end_time: u64,
//     pub reserve_price: u256,
// }

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


#[starknet::interface]
pub trait IAquaAuction<T> {
    fn start_auction(
        ref self: T, fish_id: u256, duration_secs: u64, reserve_price: u256,
    ) -> Auction;

    fn place_bid(ref self: T, auction_id: u256, amount: u256);
    fn end_auction(ref self: T, auction_id: u256);
    fn get_active_auctions(self: @T) -> Array<Auction>;
    fn get_auction_by_id(self: @T, auction_id: u256) -> Auction;
}
// #[dojo::contract]
// pub mod AquaAuction {
//     use super::*;
//     use dojo::model::{ModelStorage};
//     use dojo::event::EventStorage;

//     #[abi(embed_v0)]
//     impl AquaAuctionImpl of IAquaAuction<ContractState> {
//         fn start_auction(
//             ref self: ContractState, fish_id: u256, duration_secs: u64, reserve_price: u256,
//         ) -> Auction {
//             let mut world = self.world_default();
//             let caller = get_caller_address();

//             // Validate fish ownership and lock status
//             let fish_owner: FishOwnerA = world.read_model(fish_id);
//             assert!(fish_owner.owner == caller, "You don't own this fish");
//             assert!(!fish_owner.locked, "Fish is already locked");

//             // Lock the fish
//             world.write_model(@FishOwnerA { fish_id, owner: caller, locked: true });

//             // Get next auction ID
//             let mut counter: AuctionCounter = world.read_model('auction_counter');
//             let auction_id = counter.current_val;
//             counter.current_val += 1;
//             world.write_model(@counter);

//             // Create new auction
//             let current_time = get_block_timestamp();

//             let auction = Auction {
//                 auction_id,
//                 seller: caller,
//                 fish_id,
//                 start_time: current_time,
//                 end_time: current_time + duration_secs,
//                 reserve_price,
//                 highest_bid: 0,
//                 highest_bidder: Option::None(()),
//                 active: true,
//             };

//             // Store auction
//             world.write_model(@auction);

//             // Emit event
//             world
//                 .emit_event(
//                     @AuctionStarted {
//                         auction_id,
//                         seller: caller,
//                         fish_id,
//                         start_time: current_time,
//                         end_time: current_time + duration_secs,
//                         reserve_price,
//                     },
//                 );

//             auction
//         }

//         fn place_bid(ref self: ContractState, auction_id: u256, amount: u256) {
//             let mut world = self.world_default();
//             let caller = get_caller_address();
//             let current_time = get_block_timestamp();

//             let mut auction: Auction = world.read_model(auction_id);

//             // Validate auction
//             assert!(auction.active, "Auction is not active");
//             assert!(auction.start_time <= current_time, "Auction not started yet");
//             assert!(auction.end_time > current_time, "Auction has ended");
//             assert!(amount > auction.highest_bid, "Bid must be higher than current bid");
//             assert!(amount >= auction.reserve_price, "Bid must meet reserve price");

//             // Update auction
//             auction.highest_bid = amount;
//             auction.highest_bidder = Option::Some(caller);

//             world.write_model(@auction);

//             // Emit event
//             world.emit_event(@BidPlaced { auction_id, bidder: caller, amount });
//         }

//         fn end_auction(ref self: ContractState, auction_id: u256) {
//             let mut world = self.world_default();
//             let current_time = get_block_timestamp();
//             let mut auction: Auction = world.read_model(auction_id);

//             // Validate auction can be ended
//             assert!(auction.active, "Auction already ended");
//             assert!(auction.end_time <= current_time, "Auction not yet ended");

//             // Mark auction as inactive
//             auction.active = false;
//             world.write_model(@auction);

//             // Transfer fish ownership if there was a winning bid
//             match auction.highest_bidder {
//                 Option::Some(winner) => {
//                     world
//                         .write_model(
//                             @FishOwnerA { fish_id: auction.fish_id, owner: winner, locked: false
//                             },
//                         );
//                 },
//                 Option::None(()) => {
//                     // No winner, return fish to seller
//                     world
//                         .write_model(
//                             @FishOwnerA {
//                                 fish_id: auction.fish_id, owner: auction.seller, locked: false,
//                             },
//                         );
//                 },
//             }

//             // Emit event
//             world
//                 .emit_event(
//                     @AuctionEnded {
//                         auction_id,
//                         winner: auction.highest_bidder,
//                         final_price: auction.highest_bid,
//                     },
//                 );
//         }

//         fn get_active_auctions(self: @ContractState) -> Array<Auction> {
//             let world = self.world_default();
//             let current_time = get_block_timestamp();
//             let mut active_auctions = ArrayTrait::new();

//             // Get the current auction counter
//             let counter: AuctionCounter = world.read_model('auction_counter');

//             // Check all possible auctions
//             let mut i = 0;
//             loop {
//                 if i >= counter.current_val {
//                     break;
//                 }

//                 let auction: Auction = world.read_model(i);
//                 if auction.active && auction.end_time > current_time {
//                     active_auctions.append(auction);
//                 }

//                 i += 1;
//             };

//             active_auctions
//         }

//         fn get_auction_by_id(self: @ContractState, auction_id: u256) -> Auction {
//             self.world_default().read_model(auction_id)
//         }
//     }

//     #[generate_trait]
//     impl InternalImpl of InternalTrait {
//         fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
//             self.world(@"aqua_auction")
//         }
//     }
// }

