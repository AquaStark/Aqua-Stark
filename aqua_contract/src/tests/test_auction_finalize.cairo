// use aqua_stark::models::auctions_model::{Auction, FishOwnerA, AuctionCounter};
// use aqua_stark::models::fish_model::Fish;
// use aqua_stark::models::player_model::Player;

// use starknet::{ContractAddress, contract_address_const};

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use aqua_stark::models::session::{SessionKey, SessionAnalytics};
//     use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
//     use aqua_stark::systems::Auctions::{IAquaAuctionDispatcher, IAquaAuctionDispatcherTrait};
//     use aqua_stark::models::auctions_model::{
//         m_Auction, m_AuctionCounter, m_FishOwnerA, e_AuctionStarted, e_BidPlaced, e_AuctionEnded, e_AuctionFinalized,
//         Auction, AuctionCounter, FishOwnerA, AuctionFinalized,
//     };
//     use aqua_stark::models::session::{m_SessionKey, m_SessionAnalytics};
//     use aqua_stark::models::session::{
//         SESSION_STATUS_ACTIVE, SESSION_TYPE_PREMIUM, PERMISSION_TRADE, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_ADMIN,
//     };
//     use aqua_stark::helpers::session_validation::{
//         MIN_SESSION_DURATION, MAX_TRANSACTIONS_PER_SESSION,
//     };
//     use aqua_stark::systems::Auctions::AquaAuction;
//     use dojo::world::{WorldStorage, WorldStorageTrait};
//     use dojo_cairo_test::{
//         ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
//         spawn_test_world,
//     };
//     use starknet::{contract_address_const, testing, get_block_timestamp, ContractAddress};

//     fn OWNER() -> ContractAddress {
//         contract_address_const::<'owner'>()
//     }

//     fn BUYER() -> ContractAddress {
//         contract_address_const::<'buyer'>()
//     }

//     fn namespace_def() -> NamespaceDef {
//         let ndef = NamespaceDef {
//             namespace: "aqua_auction",
//             resources: [
//                 TestResource::Model(m_Auction::TEST_CLASS_HASH),
//                 TestResource::Model(m_AuctionCounter::TEST_CLASS_HASH),
//                 TestResource::Model(m_FishOwnerA::TEST_CLASS_HASH),
//                 TestResource::Model(m_SessionKey::TEST_CLASS_HASH),
//                 TestResource::Model(m_SessionAnalytics::TEST_CLASS_HASH),
//                 TestResource::Event(e_AuctionStarted::TEST_CLASS_HASH),
//                 TestResource::Event(e_BidPlaced::TEST_CLASS_HASH),
//                 TestResource::Event(e_AuctionEnded::TEST_CLASS_HASH),
//                 TestResource::Event(e_AuctionFinalized::TEST_CLASS_HASH),
//                 TestResource::Contract(AquaAuction::TEST_CLASS_HASH),
//             ]
//                 .span(),
//         };
//         ndef
//     }

//     fn contract_defs() -> Span<ContractDef> {
//         [
//             ContractDefTrait::new(@"aqua_auction", @"AquaAuction")
//                 .with_writer_of([dojo::utils::bytearray_hash(@"aqua_auction")].span())
//         ]
//             .span()
//     }

//     fn setup_test_world() -> (WorldStorage, IAquaAuctionDispatcher) {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
//         let auction_system = IAquaAuctionDispatcher { contract_address };

//         (world, auction_system)
//     }

//     fn create_test_session(ref world: WorldStorage, player: ContractAddress, current_time: u64) {
//         let session_id = player.into() + current_time.into();
//         let session = SessionKey {
//             session_id,
//             player_address: player,
//             created_at: current_time,
//             expires_at: current_time + MIN_SESSION_DURATION,
//             last_used: current_time,
//             max_transactions: MAX_TRANSACTIONS_PER_SESSION,
//             used_transactions: 0,
//             status: SESSION_STATUS_ACTIVE,
//             is_valid: true,
//             auto_renewal_enabled: true,
//             session_type: SESSION_TYPE_PREMIUM,
//             permissions: array![
//                 PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
//             ],
//         };
//         world.write_model(@session);

//         let analytics = SessionAnalytics {
//             session_id,
//             total_transactions: 0,
//             successful_transactions: 0,
//             failed_transactions: 0,
//             total_gas_used: 0,
//             average_gas_per_tx: 0,
//             last_activity: current_time,
//             created_at: current_time,
//         };
//         world.write_model(@analytics);
//     }

//     #[test]
//     fn test_finalize_auction_with_valid_winner() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 1000_u256;
//         let seller = OWNER();
//         let buyer = BUYER();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create sessions for both parties
//         create_test_session(ref world, seller, current_time);
//         create_test_session(ref world, buyer, current_time);

//         let (mut world, auction_system) = setup_test_world();

//         // Start auction
//         let auction = auction_system.start_auction(fish_id, 3600, 100_u256); // 1 hour duration, 100 reserve

//         // Switch to buyer and place bid
//         testing::set_caller_address(buyer);
//         auction_system.place_bid(auction.auction_id, 150_u256); // Bid above reserve

//         // Fast forward time to end auction
//         testing::set_block_timestamp(current_time + 3601); // After auction ends

//         // Finalize auction (anyone can call this)
//         testing::set_caller_address(OWNER());
//         auction_system.finalize_auction(auction.auction_id);

//         // Verify auction state
//         let final_auction: Auction = world.read_model(auction.auction_id);
//         assert!(final_auction.finalized, "Auction should be finalized");
//         assert!(!final_auction.active, "Auction should be inactive");

//         // Verify fish ownership transferred to winner
//         let fish_owner: FishOwnerA = world.read_model(fish_id);
//         assert!(fish_owner.owner == buyer, "Fish should be transferred to winner");
//         assert!(!fish_owner.locked, "Fish should be unlocked");
//     }

//     #[test]
//     fn test_finalize_auction_with_no_bids() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 2000_u256;
//         let seller = OWNER();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create session for seller
//         create_test_session(ref world, seller, current_time);

//         let (mut auction_system, _) = setup_test_world();

//         // Start auction
//         let auction = auction_system.start_auction(fish_id, 3600, 100_u256);

//         // Fast forward time to end auction
//         testing::set_block_timestamp(current_time + 3601);

//         // Finalize auction
//         auction_system.finalize_auction(auction.auction_id);

//         // Verify auction state
//         let final_auction: Auction = world.read_model(auction.auction_id);
//         assert!(final_auction.finalized, "Auction should be finalized");
//         assert!(!final_auction.active, "Auction should be inactive");

//         // Verify fish returned to seller
//         let fish_owner: FishOwnerA = world.read_model(fish_id);
//         assert!(fish_owner.owner == seller, "Fish should be returned to seller");
//         assert!(!fish_owner.locked, "Fish should be unlocked");
//     }

//     #[test]
//     fn test_finalize_auction_bid_below_reserve() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 3000_u256;
//         let seller = OWNER();
//         let buyer = BUYER();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create sessions for both parties
//         create_test_session(ref world, seller, current_time);
//         create_test_session(ref world, buyer, current_time);

//         let (mut auction_system, _) = setup_test_world();

//         // Start auction with high reserve
//         let auction = auction_system.start_auction(fish_id, 3600, 1000_u256); // 1000 reserve

//         // Switch to buyer and place bid below reserve
//         testing::set_caller_address(buyer);
//         auction_system.place_bid(auction.auction_id, 500_u256); // Bid below reserve

//         // Fast forward time to end auction
//         testing::set_block_timestamp(current_time + 3601);

//         // Finalize auction
//         testing::set_caller_address(OWNER());
//         auction_system.finalize_auction(auction.auction_id);

//         // Verify auction state
//         let final_auction: Auction = world.read_model(auction.auction_id);
//         assert!(final_auction.finalized, "Auction should be finalized");
//         assert!(!final_auction.active, "Auction should be inactive");

//         // Verify fish returned to seller (bid didn't meet reserve)
//         let fish_owner: FishOwnerA = world.read_model(fish_id);
//         assert!(fish_owner.owner == seller, "Fish should be returned to seller");
//         assert!(!fish_owner.locked, "Fish should be unlocked");
//     }

//     #[test]
//     #[should_panic(expected: ('Auction already finalized',))]
//     fn test_finalize_auction_duplicate_finalization() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 4000_u256;
//         let seller = OWNER();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create session for seller
//         create_test_session(ref world, seller, current_time);

//         let (mut auction_system, _) = setup_test_world();

//         // Start auction
//         let auction = auction_system.start_auction(fish_id, 3600, 100_u256);

//         // Fast forward time to end auction
//         testing::set_block_timestamp(current_time + 3601);

//         // Finalize auction first time
//         auction_system.finalize_auction(auction.auction_id);

//         // Try to finalize again - should panic
//         auction_system.finalize_auction(auction.auction_id);
//     }

//     #[test]
//     #[should_panic(expected: ('Auction has not ended yet',))]
//     fn test_finalize_auction_before_end() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 5000_u256;
//         let seller = OWNER();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create session for seller
//         create_test_session(ref world, seller, current_time);

//         let (mut auction_system, _) = setup_test_world();

//         // Start auction
//         let auction = auction_system.start_auction(fish_id, 3600, 100_u256);

//         // Try to finalize before auction ends - should panic
//         auction_system.finalize_auction(auction.auction_id);
//     }

//     #[test]
//     fn test_finalize_auction_anyone_can_call() {
//         let mut world = spawn_test_world([namespace_def()].span());
//         world.sync_perms_and_inits(contract_defs());

//         let current_time = 1000;
//         testing::set_block_timestamp(current_time);
//         testing::set_caller_address(OWNER());

//         // Setup initial data
//         let fish_id = 6000_u256;
//         let seller = OWNER();
//         let random_user = contract_address_const::<'random'>();
        
//         world.write_model(@FishOwnerA { fish_id, owner: seller, locked: false });
//         world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        
//         // Create sessions
//         create_test_session(ref world, seller, current_time);
//         create_test_session(ref world, random_user, current_time);

//         let (mut auction_system, _) = setup_test_world();

//         // Start auction
//         let auction = auction_system.start_auction(fish_id, 3600, 100_u256);

//         // Fast forward time to end auction
//         testing::set_block_timestamp(current_time + 3601);

//         // Finalize auction as random user - should work
//         testing::set_caller_address(random_user);
//         auction_system.finalize_auction(auction.auction_id);

//         // Verify auction was finalized
//         let final_auction: Auction = world.read_model(auction.auction_id);
//         assert!(final_auction.finalized, "Auction should be finalized");
//     }
// }
