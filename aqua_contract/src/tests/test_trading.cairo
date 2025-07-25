#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use aqua_stark::models::trade_model::{
        TradeOffer, TradeOfferStatus, MatchCriteria, FishLock,
        TradeOfferTrait, FishLockTrait
    };

    #[test]
    fn test_trade_offer_exact_id_match() {
        let offer = TradeOffer {
            id: 1,
            creator: starknet::contract_address_const::<0x123>(),
            offered_fish_id: 10,
            requested_fish_criteria: MatchCriteria::ExactId,
            requested_fish_id: Option::Some(42),
            requested_species: Option::None,
            requested_generation: Option::None,
            requested_traits: array![],
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        };

        // Should match exact ID
        assert(
            TradeOfferTrait::matches_criteria(@offer, 42, 1, 5, array![100, 200]),
            'Should match exact ID'
        );

        // Should not match different ID
        assert(
            !TradeOfferTrait::matches_criteria(@offer, 43, 1, 5, array![100, 200]),
            'Should not match different ID'
        );
    }

    #[test]
    fn test_trade_offer_species_match() {
        let offer = TradeOffer {
            id: 1,
            creator: starknet::contract_address_const::<0x123>(),
            offered_fish_id: 10,
            requested_fish_criteria: MatchCriteria::Species,
            requested_fish_id: Option::None,
            requested_species: Option::Some(0), // AngelFish
            requested_generation: Option::None,
            requested_traits: array![],
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        };

        // Should match correct species
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 0, 5, array![100, 200]),
            'Should match AngelFish species'
        );

        // Should not match different species
        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 5, array![100, 200]),
            'Should not match GoldFish'
        );
    }

    #[test]
    fn test_trade_offer_species_and_gen_match() {
        let offer = TradeOffer {
            id: 1,
            creator: starknet::contract_address_const::<0x123>(),
            offered_fish_id: 10,
            requested_fish_criteria: MatchCriteria::SpeciesAndGen,
            requested_fish_id: Option::None,
            requested_species: Option::Some(1), // GoldFish
            requested_generation: Option::Some(3),
            requested_traits: array![],
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        };

        // Should match correct species and generation
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200]),
            'Should match species and gen'
        );

        // Should not match wrong generation
        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 4, array![100, 200]),
            'Should not match wrong gen'
        );
    }

    #[test]
    fn test_trade_offer_traits_match() {
        let offer = TradeOffer {
            id: 1,
            creator: starknet::contract_address_const::<0x123>(),
            offered_fish_id: 10,
            requested_fish_criteria: MatchCriteria::Traits,
            requested_fish_id: Option::None,
            requested_species: Option::None,
            requested_generation: Option::None,
            requested_traits: array![100, 200],
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        };

        // Should match when fish has all required traits
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200, 300]),
            'Should match all traits'
        );

        // Should not match when fish lacks required traits
        assert(
            !TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 300]),
            'Should not match missing traits'
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
            array![],
            24 // 24 hours
        );

        assert(TradeOfferTrait::is_active(@offer), 'Should be active');
        assert(TradeOfferTrait::can_accept(@offer), 'Should be acceptable');

        // Test locking
        let locked_offer = TradeOfferTrait::lock_offer(offer);
        assert(!TradeOfferTrait::can_accept(@locked_offer), 'Should not be acceptable');

        // Test completion
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
            array![],
            24
        );

        let cancelled_offer = TradeOfferTrait::cancel_offer(offer);
        assert(!cancelled_offer.is_locked, 'Should be unlocked after cancel');
        assert(!TradeOfferTrait::is_active(@cancelled_offer), 'Should not be active');
        assert(cancelled_offer.status == TradeOfferStatus::Cancelled, 'Should be cancelled');
    }

    #[test]
    fn test_empty_traits_match() {
        let offer = TradeOffer {
            id: 1,
            creator: starknet::contract_address_const::<0x123>(),
            offered_fish_id: 10,
            requested_fish_criteria: MatchCriteria::Traits,
            requested_fish_id: Option::None,
            requested_species: Option::None,
            requested_generation: Option::None,
            requested_traits: array![], // No traits required
            status: TradeOfferStatus::Active,
            created_at: 1000,
            expires_at: 2000,
            is_locked: false,
        };

        // Should match when no traits required
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![100, 200]),
            'Should match no traits required'
        );

        // Should also match fish with no traits
        assert(
            TradeOfferTrait::matches_criteria(@offer, 100, 1, 3, array![]),
            'Should match any fish'
        );
    }
} 