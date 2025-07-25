use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

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
pub struct FishOwner {
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

#[derive(Drop, Serde)]
#[dojo::event]
pub struct AuctionStarted {
    #[key]
    pub auction_id: u256,
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


#[starknet::interface]
pub trait IAquaAuction<T> {
    fn start_auction(
            ref self: T,
            fish_id: u256,
            duration_secs: u64,
            reserve_price: u256
        ) -> Auction;

    fn place_bid(
            ref self: T,
            auction_id: u256,
            amount: u256
        );
    fn end_auction(
            ref self: T,
            auction_id: u256
        );
    fn get_active_auctions(self: @T) -> Array<Auction>;
}

#[dojo::contract]
pub mod AquaAuction {

    use super::*;
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
//     use array::ArrayTrait;
    
    #[abi(embed_v0)]
    impl AquaAuctionImpl of IAquaAuction<ContractState> {
        fn start_auction(
            ref self: ContractState,
            fish_id: u256,
            duration_secs: u64,
            reserve_price: u256
        ) -> Auction {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Validate fish ownership and lock status
            let fish_owner: FishOwner  = world.read_model(fish_id);
            assert!(fish_owner.owner == caller, "You don't own this fish");
            assert!(!fish_owner.locked, "Fish is already locked");
            
            // Lock the fish
            world.write_model(@FishOwner {
                fish_id,
                owner: caller,
                locked: true
            });
            
            // Get next auction ID
            let mut counter: AuctionCounter = world.read_model('auction_counter');
            let auction_id = counter.current_val;
            counter.current_val += 1;
            world.write_model(@counter);
            
            // Create new auction
            let current_time = get_block_timestamp();
            
            let auction = Auction {
                auction_id,
                seller: caller,
                fish_id,
                start_time: current_time,
                end_time: current_time + duration_secs,
                reserve_price,
                highest_bid: 0,
                highest_bidder: Option::None(()),
                active: true
            };
            
            // Store auction
            world.write_model(@auction);
            
            // Emit event
            world.emit_event(@AuctionStarted {
                auction_id,
                seller: caller,
                fish_id,
                start_time: current_time,
                end_time: current_time + duration_secs,
                reserve_price
            });
            
            auction
        }
        
        fn place_bid(
            ref self: ContractState,
            auction_id: u256,
            amount: u256
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            
            let mut auction: Auction = world.read_model(auction_id);
            
            // Validate auction
            assert!(auction.active, "Auction is not active");
            assert!(auction.start_time <= current_time, "Auction not started yet");
            assert!(auction.end_time > current_time, "Auction has ended");
            assert!(amount > auction.highest_bid, "Bid must be higher than current bid");
            assert!(amount >= auction.reserve_price, "Bid must meet reserve price");
            
            // Update auction
            auction.highest_bid = amount;
            auction.highest_bidder = Option::Some(caller);
            
            world.write_model(@auction);
            
            // Emit event
            world.emit_event(@BidPlaced {
                auction_id,
                bidder: caller,
                amount
            });
        }
        
        fn end_auction(
            ref self: ContractState,
            auction_id: u256
        ) {
            let mut world = self.world_default();
            let current_time = get_block_timestamp();
            let mut auction: Auction = world.read_model(auction_id);
            
            // Validate auction can be ended
            assert!(auction.active, "Auction already ended");
            assert!(auction.end_time <= current_time, "Auction not yet ended");
            
            // Mark auction as inactive
            auction.active = false;
            world.write_model(@auction);
            
            // Transfer fish ownership if there was a winning bid
            match auction.highest_bidder {
                Option::Some(winner) => {
                    world.write_model(@FishOwner {
                        fish_id: auction.fish_id,
                        owner: winner,
                        locked: false
                    });
                },
                Option::None(()) => {
                    // No winner, return fish to seller
                    world.write_model(@FishOwner {
                        fish_id: auction.fish_id,
                        owner: auction.seller,
                        locked: false
                    });
                }
            }
            
            // Emit event
            world.emit_event(@AuctionEnded {
                auction_id,
                winner: auction.highest_bidder,
                final_price: auction.highest_bid
            });
        }
        
        fn get_active_auctions(self: @ContractState) -> Array<Auction> {
            let world = self.world_default();
            let current_time = get_block_timestamp();
            let mut active_auctions = ArrayTrait::new();
            
            // Get the current auction counter
            let counter: AuctionCounter = world.read_model('auction_counter');
            
            // Check all possible auctions
            let mut i = 0;
            loop {
                if i >= counter.current_val {
                    break;
                }
                
                let auction: Auction = world.read_model(i);
                if auction.active && auction.end_time > current_time {
                    active_auctions.append(auction);
                }
                
                i += 1;
            };
            
            active_auctions
        }
        
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_auction")
        }

        fn get_auction_by_id(self: @ContractState, auction_id: u256) -> Auction {
            self.world_default().read_model(auction_id)
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::{
//         AquaAuctionDispatcher, AquaAuctionDispatcherTrait, 
//         IWorldDispatcher, IWorldDispatcherTrait, Auction, FishOwner, AuctionCounter
//     };
//     use starknet::{ContractAddress, contract_address_const};
//     use dojo::test_utils::{mock_world, mock_contract, mock_model};
//     use dojo::model;
//     use array::ArrayTrait;
//     use option::OptionTrait;
    
//     fn zero_address() -> ContractAddress {
//         contract_address_const::<0>()
//     }
    
//     fn setup_world() -> IWorldDispatcher {
//         let world = mock_world();
        
//         // Initialize auction counter
//         model!(world, AuctionCounter).set(AuctionCounter {
//             id: 'auction_counter',
//             current_val: 0
//         });
        
//         world
//     }
    
//     #[test]
//     #[available_gas(100000)]
//     fn test_start_auction() {
//         let world = setup_world();
//         let contract = AquaAuctionDispatcher { world: world.clone() };
//         let fish_id = 1;
//         let owner = contract_address_const::<0x123>();
        
//         // Setup test fish
//         model!(world, FishOwner).set(FishOwner {
//             fish_id,
//             owner,
//             locked: false
//         });
        
//         // Test successful auction creation
//         starknet::testing::set_caller_address(owner);
//         contract.start_auction(fish_id, 3600, 100);
        
//         let auction = model!(world, Auction).get(0);
//         assert(auction.seller == owner, "Seller should be owner");
//         assert(auction.fish_id == fish_id, "Fish ID should match");
//         assert(auction.reserve_price == 100, "Reserve price should match");
//         assert(auction.active, "Auction should be active");
        
//         let fish_owner = model!(world, FishOwner).get(fish_id);
//         assert(fish_owner.locked, "Fish should be locked");
//     }
    
//     #[test]
//     #[available_gas(100000)]
//     #[should_panic(expected: ("You don't own this fish"))]
//     fn test_start_auction_not_owner() {
//         let world = setup_world();
//         let contract = AquaAuctionDispatcher { world: world.clone() };
//         let fish_id = 1;
//         let owner = contract_address_const::<0x123>();
        
//         model!(world, FishOwner).set(FishOwner {
//             fish_id,
//             owner,
//             locked: false
//         });
        
//         // Call from different address
//         let not_owner = contract_address_const::<0x456>();
//         starknet::testing::set_caller_address(not_owner);
//         contract.start_auction(fish_id, 3600, 100);
//     }
    
//     #[test]
//     #[available_gas(100000)]
//     fn test_place_bid() {
//         let world = setup_world();
//         let contract = AquaAuctionDispatcher { world: world.clone() };
//         let fish_id = 1;
//         let owner = contract_address_const::<0x123>();
//         let bidder = contract_address_const::<0x456>();
        
//         // Setup test fish and auction
//         model!(world, FishOwner).set(FishOwner {
//             fish_id,
//             owner,
//             locked: false
//         });
        
//         starknet::testing::set_caller_address(owner);
//         contract.start_auction(fish_id, 3600, 100);
        
//         // Place bid
//         starknet::testing::set_caller_address(bidder);
//         contract.place_bid(0, 150);
        
//         let auction = model!(world, Auction).get(0);
//         assert(auction.highest_bid == 150, "Bid amount should be updated");
//         match auction.highest_bidder {
//             Option::Some(addr) => assert(addr == bidder, "Bidder should be recorded"),
//             Option::None(()) => panic!("Bidder should be set")
//         };
//     }
    
//     #[test]
//     #[available_gas(100000)]
//     fn test_end_auction() {
//         let world = setup_world();
//         let contract = AquaAuctionDispatcher { world: world.clone() };
//         let fish_id = 1;
//         let owner = contract_address_const::<0x123>();
//         let bidder = contract_address_const::<0x456>();
        
//         // Setup test fish and auction
//         model!(world, FishOwner).set(FishOwner {
//             fish_id,
//             owner,
//             locked: false
//         });
        
//         starknet::testing::set_caller_address(owner);
//         contract.start_auction(fish_id, 1, 100); // Short duration for testing
        
//         // Place bid
//         starknet::testing::set_caller_address(bidder);
//         contract.place_bid(0, 150);
        
//         // Fast forward time
//         starknet::testing::set_block_timestamp(2);
        
//         // End auction
//         contract.end_auction(0);
        
//         let auction = model!(world, Auction).get(0);
//         assert(!auction.active, "Auction should be inactive");
        
//         let fish_owner = model!(world, FishOwner).get(fish_id);
//         assert(fish_owner.owner == bidder, "Fish should be transferred to winner");
//         assert(!fish_owner.locked, "Fish should be unlocked");
//     }
// }