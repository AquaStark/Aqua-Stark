#[cfg(test)]
mod tests {
    use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
    use aqua_stark::interfaces::ITrade::{ITradeDispatcher, ITradeDispatcherTrait};
    use aqua_stark::models::fish_model::{Fish, FishOwner, Species};
    use aqua_stark::models::trade_model::{
        FishLockTrait, MatchCriteria, TradeOffer, TradeOfferCounter, TradeOfferStatus,
        TradeOfferTrait, m_ActiveTradeOffers, m_FishLock, m_TradeOffer, m_TradeOfferCounter,
    };
    use dojo::world::{IWorldDispatcher, WorldStorageTrait};
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{ContractAddress, contract_address_const, get_block_timestamp, testing};


    fn OWNER() -> ContractAddress {
        contract_address_const::<'owner'>()
    }

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_TradeOffer::TEST_CLASS_HASH),
                TestResource::Model(m_TradeOfferCounter::TEST_CLASS_HASH),
                TestResource::Model(m_FishLock::TEST_CLASS_HASH),
                TestResource::Model(m_ActiveTradeOffers::TEST_CLASS_HASH),
            ]
                .span(),
        };
        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"AquaStark")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
            ContractDefTrait::new(@"aqua_stark", @"Trade")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ]
            .span()
    }

    fn setup_test_world() -> (ITradeDispatcher, IAquaStarkDispatcher) {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (trade_address, _) = world.dns(@"Trade").unwrap();
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();

        let trade = ITradeDispatcher { contract_address: trade_address };
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };

        (trade, aqua_stark)
    }

    fn create_test_offer(
        id: u256,
        creator: felt252,
        fish_id: u256,
        criteria: MatchCriteria,
        requested_id: Option<u256>,
        requested_species: Option<u8>,
        requested_gen: Option<u8>,
        traits: Array<felt252>,
    ) -> TradeOffer {
        TradeOffer {
            id,
            creator: contract_address_const::<'creator'>(),
            offered_fish_id: fish_id,
            requested_fish_criteria: criteria,
            requested_fish_id: requested_id,
            requested_species: requested_species,
            requested_generation: requested_gen,
            requested_traits: traits,
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        }
    }

    #[test]
    fn test_trade_offer_exact_id_match() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::ExactId,
            Option::Some(42),
            Option::None,
            Option::None,
            array![],
        );

        assert(
            TradeOfferTrait::matches_criteria(@offer, 42, 1, 5, array![100, 200].span()),
            'Should match exact ID',
        );

        assert(
            !TradeOfferTrait::matches_criteria(@offer, 43, 1, 5, array![100, 200].span()),
            'Should not match different ID',
        );
    }

    #[test]
    fn test_trade_offer_species_match() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::Species,
            Option::None,
            Option::Some(0),
            Option::None,
            array![],
        );

        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 0, 5, array![100, 200].span()),
            'Should match AngelFish species',
        );

        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 5, array![100, 200].span()),
            'Should not match GoldFish',
        );
    }

    #[test]
    fn test_trade_offer_species_and_gen_match() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::SpeciesAndGen,
            Option::None,
            Option::Some(1),
            Option::Some(3),
            array![],
        );

        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200].span()),
            'Should match species and gen',
        );

        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 4, array![100, 200].span()),
            'Should not match wrong gen',
        );
    }

    #[test]
    fn test_trade_offer_traits_match() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::Traits,
            Option::None,
            Option::None,
            Option::None,
            array![100, 200],
        );

        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200, 300].span()),
            'Should match all traits',
        );

        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 300].span()),
            'Should not match missing traits',
        );
    }

    #[test]
    fn test_fish_lock_functionality() {
        let fish_id = 123;
        let offer_id = 456;

        let lock = FishLockTrait::lock_fish(fish_id, offer_id);
        assert(lock.fish_id == fish_id, 'Fish ID should match');
        assert(lock.locked_by_offer == offer_id, 'Should be locked by offer');
        assert(FishLockTrait::is_locked(lock), 'Fish should be locked');

        let unlock = FishLockTrait::unlock_fish(fish_id);
        assert(unlock.fish_id == fish_id, 'Fish ID should match');
        assert(!FishLockTrait::is_locked(unlock), 'Fish should be unlocked');
    }

    #[test]
    fn test_trade_offer_lifecycle() {
        let creator = starknet::contract_address_const::<0x123>();
        let offer_id = 1;
        let fish_id = 10;

        let offer = TradeOfferTrait::create_offer(
            offer_id,
            creator,
            fish_id,
            MatchCriteria::Species,
            Option::None,
            Option::Some(0),
            Option::None,
            array![].span(),
            24,
        );

        assert(TradeOfferTrait::is_active(@offer), 'Should be active');
        assert(TradeOfferTrait::can_accept(@offer), 'Should be acceptable');

        let locked_offer = TradeOfferTrait::lock_offer(offer);
        assert(!TradeOfferTrait::can_accept(@locked_offer), 'Should not be acceptable');

        let completed_offer = TradeOfferTrait::complete_offer(locked_offer);
        assert(!completed_offer.is_locked, 'Should be unlocked after done');
        assert(completed_offer.status == TradeOfferStatus::Completed, 'Should be completed');
    }

    #[test]
    fn test_trade_offer_cancellation() {
        let creator = starknet::contract_address_const::<0x123>();
        let offer_id = 1;
        let fish_id = 10;

        let offer = TradeOfferTrait::create_offer(
            offer_id,
            creator,
            fish_id,
            MatchCriteria::Species,
            Option::None,
            Option::Some(0),
            Option::None,
            array![].span(),
            24,
        );

        let cancelled_offer = TradeOfferTrait::cancel_offer(offer);
        assert(!cancelled_offer.is_locked, 'Should be unlocked after cancel');
        assert(!TradeOfferTrait::is_active(@cancelled_offer), 'Should not be active');
        assert(cancelled_offer.status == TradeOfferStatus::Cancelled, 'Should be cancelled');
    }

    #[test]
    fn test_empty_traits_match() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::Traits,
            Option::None,
            Option::None,
            Option::None,
            array![],
        );

        // Should match when no traits required
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200].span()),
            'Should match no traits required',
        );

        // Should also match fish with no traits
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![].span()),
            'Should match any fish',
        );
    }

    #[test]
    fn test_trade_offer_lifecycle_states() {
        let offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::ExactId,
            Option::Some(42),
            Option::None,
            Option::None,
            array![],
        );

        assert(TradeOfferTrait::is_active(@offer), 'Should start active');
        assert(TradeOfferTrait::can_accept(@offer), 'Should be acceptable');

        let cancel_offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::ExactId,
            Option::Some(42),
            Option::None,
            Option::None,
            array![],
        );

        let locked_offer = TradeOfferTrait::lock_offer(offer);
        assert!(
            !TradeOfferTrait::can_accept(@locked_offer), "Should not be acceptable when locked",
        );
        assert(locked_offer.is_locked, 'Should track lock state');

        let completed_offer = TradeOfferTrait::complete_offer(locked_offer);
        assert!(
            !TradeOfferTrait::is_active(@completed_offer), "Should not be active when completed",
        );
        assert!(!completed_offer.is_locked, "Should be unlocked after completion");
        assert!(
            completed_offer.status == TradeOfferStatus::Completed, "Should be marked completed",
        );

        let cancelled_offer = TradeOfferTrait::cancel_offer(cancel_offer);
        assert!(
            !TradeOfferTrait::is_active(@cancelled_offer), "Should not be active when cancelled",
        );
        assert!(!cancelled_offer.is_locked, "Should be unlocked after cancellation");
        assert!(
            cancelled_offer.status == TradeOfferStatus::Cancelled, "Should be marked cancelled",
        );
    }

    #[test]
    fn test_trade_offer_expiry() {
        testing::set_block_timestamp(1000);

        let mut offer = create_test_offer(
            1,
            'creator',
            10,
            MatchCriteria::ExactId,
            Option::Some(42),
            Option::None,
            Option::None,
            array![],
        );

        assert!(!TradeOfferTrait::is_expired(@offer), "Should not be expired initially");

        testing::set_block_timestamp(2001);
        assert(TradeOfferTrait::is_expired(@offer), 'Should be expired');
        assert!(!TradeOfferTrait::is_active(@offer), "Should not be active when expired");
        assert!(!TradeOfferTrait::can_accept(@offer), "Should not be acceptable when expired");
    }

    #[test]
    fn test_fish_lock_edge_cases() {
        let fish_id = 123;
        let offer_id = 456;

        let lock = FishLockTrait::lock_fish(fish_id, offer_id);
        assert(lock.fish_id == fish_id, 'Fish ID should match');
        assert!(lock.locked_by_offer == offer_id, "Should be locked by offer");
        assert(FishLockTrait::is_locked(lock), 'Should be locked');

        let unlock = FishLockTrait::unlock_fish(fish_id);
        assert(unlock.fish_id == fish_id, 'Fish ID should persist');
        assert(unlock.locked_by_offer == 0, 'Should clear offer ID');
        assert(!FishLockTrait::is_locked(unlock), 'Should be unlocked');
        assert(unlock.locked_at == 0, 'Should clear lock timestamp');

        let relock = FishLockTrait::lock_fish(fish_id, offer_id + 1);
        assert(relock.locked_by_offer == offer_id + 1, 'Should update offer ID');
        assert(FishLockTrait::is_locked(relock), 'Should be locked again');
    }

    #[test]
    fn test_trade_criteria_edge_cases() {
        let offer = create_test_offer(
            u256_max(),
            'creator',
            u256_max(),
            MatchCriteria::SpeciesAndGen,
            Option::Some(u256_max()),
            Option::Some(u8_max()),
            Option::Some(u8_max()),
            array![felt252_max()],
        );

        assert(
            TradeOfferTrait::matches_criteria(
                @offer, u256_max(), u8_max(), u8_max(), array![felt252_max()].span(),
            ),
            'Should handle max values',
        );

        let empty_offer = create_test_offer(
            1,
            'creator',
            0,
            MatchCriteria::Traits,
            Option::None,
            Option::None,
            Option::None,
            array![],
        );

        assert(
            TradeOfferTrait::matches_criteria(@empty_offer, 0, 0, 0, array![].span()),
            'Should handle empty values',
        );
    }

    // Helper functions for numeric limits
    fn u256_max() -> u256 {
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff_u256
    }
    fn u8_max() -> u8 {
        0xff_u8
    }
    fn felt252_max() -> felt252 {
        0x800000000000011000000000000000000000000000000000000000000000000_felt252
    }
}
