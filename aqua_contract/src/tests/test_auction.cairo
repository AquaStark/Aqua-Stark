#[cfg(test)]
pub mod Test {
    use super::*;
    use dojo::world::WorldStorageTrait;
    use dojo::model::ModelStorage;
    use aqua_stark::models::auctions_model::{
        m_Auction, m_AuctionCounter, m_FishOwnerA, e_AuctionStarted, e_BidPlaced, e_AuctionEnded,
        Auction, AuctionCounter, FishOwnerA,
    };
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use aqua_stark::systems::Auctions::{
        IAquaAuctionDispatcher, IAquaAuctionDispatcherTrait, AquaAuction,
    };
    use starknet::{get_caller_address, contract_address_const};


    fn namespace_def() -> NamespaceDef {
        NamespaceDef {
            namespace: "aqua_auction",
            resources: [
                TestResource::Model(m_Auction::TEST_CLASS_HASH),
                TestResource::Model(m_AuctionCounter::TEST_CLASS_HASH),
                TestResource::Model(m_FishOwnerA::TEST_CLASS_HASH),
                TestResource::Event(e_AuctionStarted::TEST_CLASS_HASH),
                TestResource::Event(e_BidPlaced::TEST_CLASS_HASH),
                TestResource::Event(e_AuctionEnded::TEST_CLASS_HASH),
                TestResource::Contract(AquaAuction::TEST_CLASS_HASH),
            ]
                .span(),
        }
    }
    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_auction", @"AquaAuction")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_auction")].span())
        ]
            .span()
    }


    #[test]
    fn test_start_auction() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let fish_id: u256 = 1000_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        let duration_secs: u64 = 7200;
        let reserve_price: u256 = 5_u256;
        let auction = actions_system.start_auction(fish_id, duration_secs, reserve_price);

        let stored_auction: Auction = world.read_model(auction.auction_id);
        assert!(stored_auction.fish_id == fish_id, "Fish ID mismatch");
        assert!(stored_auction.seller == owner, "Seller mismatch");
        assert!(stored_auction.active, "Auction should be active");

        let locked_fish: FishOwnerA = world.read_model(fish_id);
        assert!(locked_fish.locked, "Fish should be locked");
    }

    #[test]
    fn test_place_bid() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Setup
        let fish_id: u256 = 2000_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        let auction = actions_system.start_auction(fish_id, 3600, 10_u256);

        // Place first bid (must be > reserve)
        let bid_amount = 15_u256;
        actions_system.place_bid(auction.auction_id, bid_amount);

        // Assert bid is stored
        let updated: Auction = world.read_model(auction.auction_id);
        assert!(updated.highest_bid == bid_amount, "Highest bid mismatch");
        assert!(updated.highest_bidder == Option::Some(owner), "Highest bidder mismatch");
    }

    #[test]
    fn test_end_auction_with_winner() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let fish_id: u256 = 3000_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        let auction = actions_system.start_auction(fish_id, 10_u64, 10_u256);

        // Place winning bid
        let bid_amount = 12_u256;
        actions_system.place_bid(auction.auction_id, bid_amount);

        let mut ended_auction: Auction = world.read_model(auction.auction_id);
        ended_auction.end_time = starknet::get_block_timestamp();
        world.write_model(@ended_auction);

        // End the auction
        actions_system.end_auction(auction.auction_id);

        let final_auction: Auction = world.read_model(auction.auction_id);
        assert!(!final_auction.active, "Auction should be inactive after end");

        let new_fish_owner: FishOwnerA = world.read_model(fish_id);
        assert!(new_fish_owner.owner == owner, "Fish ownership should be transferred to winner");
        assert!(!new_fish_owner.locked, "Fish should be unlocked");
    }

    #[test]
    fn test_end_auction_no_bids() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let fish_id: u256 = 4000_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        let auction = actions_system.start_auction(fish_id, 10_u64, 20_u256);

        let mut ended_auction: Auction = world.read_model(auction.auction_id);
        ended_auction.end_time = starknet::get_block_timestamp();
        world.write_model(@ended_auction);

        actions_system.end_auction(auction.auction_id);

        let final_auction: Auction = world.read_model(auction.auction_id);
        assert!(!final_auction.active, "Auction should be inactive");
        let fish: FishOwnerA = world.read_model(fish_id);
        assert!(fish.owner == owner, "Fish returned to seller");
        assert!(!fish.locked, "Fish unlocked and returned");
    }


    #[test]
    #[should_panic]
    fn test_start_auction_with_wrong_owner_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let fish_id: u256 = 5000_u256;
        let other_owner = contract_address_const::<1>();
        world.write_model(@FishOwnerA { fish_id, owner: other_owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let duration_secs: u64 = 7200;
        let reserve_price: u256 = 50_u256;

        actions_system.start_auction(fish_id, duration_secs, reserve_price);
    }


    #[test]
    #[should_panic]
    fn test_bid_below_minimum_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 6000_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let auction = actions_system.start_auction(fish_id, 3600, 10_u256);

        actions_system.place_bid(auction.auction_id, 8_u256);

        actions_system.place_bid(auction.auction_id, 12_u256);

        actions_system.place_bid(auction.auction_id, 12_u256);
    }

    #[test]
    #[should_panic]
    fn test_bid_on_inactive_auction_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 9999_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let auction = actions_system.start_auction(fish_id, 10_u64, 10_u256);

        // End auction manually
        let mut auction_model: Auction = world.read_model(auction.auction_id);
        auction_model.active = false;
        world.write_model(@auction_model);

        // Try to bid
        actions_system.place_bid(auction.auction_id, 15_u256);
    }

    #[test]
    #[should_panic]
    fn test_end_auction_too_early_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 1111_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let auction = actions_system.start_auction(fish_id, 1000_u64, 10_u256); // Far future

        // Try to end before end_time
        actions_system.end_auction(auction.auction_id);
    }

    #[test]
    #[should_panic]
    fn test_bid_on_nonexistent_auction_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        actions_system.place_bid(999999_u256, 50_u256);
    }

    #[test]
    #[should_panic]
    fn test_end_auction_twice_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 2222_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });
        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let auction = actions_system.start_auction(fish_id, 10_u64, 10_u256);

        // Simulate passing time
        let mut ended_auction: Auction = world.read_model(auction.auction_id);
        ended_auction.end_time = starknet::get_block_timestamp();
        world.write_model(@ended_auction);

        actions_system.end_auction(auction.auction_id);
        actions_system.end_auction(auction.auction_id);
    }

    #[test]
    #[should_panic]
    fn test_start_auction_on_locked_fish_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 3333_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: true }); // Fish already locked
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        actions_system.start_auction(fish_id, 7200, 20_u256);
    }

    #[test]
    #[should_panic]
    fn test_bid_below_increment_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let fish_id: u256 = 4444_u256;
        let owner = get_caller_address();
        world.write_model(@FishOwnerA { fish_id, owner, locked: false });
        world.write_model(@AuctionCounter { id: 'auction_counter', current_val: 0_u256 });

        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };
        let auction = actions_system.start_auction(fish_id, 3600, 10_u256);

        actions_system.place_bid(auction.auction_id, 12_u256); // First bid
        actions_system.place_bid(auction.auction_id, 12_u256);
    }

    #[test]
    fn test_get_nonexistent_auction_should_fail() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaAuction").unwrap();
        let mut actions_system = IAquaAuctionDispatcher { contract_address };

        actions_system.get_auction_by_id(999999_u256);
    }
}
