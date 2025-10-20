use starknet::{ContractAddress, get_block_timestamp};

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
#[dojo::model]
pub struct TradeOfferCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
}

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
pub enum TradeOfferStatus {
    #[default]
    Active,
    Completed,
    Cancelled,
    Expired,
}

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
pub enum MatchCriteria {
    #[default]
    ExactId,
    Species,
    SpeciesAndGen,
    Traits,
}

#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct TradeOffer {
    #[key]
    pub id: u256,
    pub creator: ContractAddress,
    pub offered_fish_id: u256,
    pub requested_fish_criteria: MatchCriteria,
    pub requested_fish_id: Option<u256>,
    pub requested_species: Option<u8>,
    pub requested_generation: Option<u8>,
    pub requested_traits: Array<felt252>,
    pub status: TradeOfferStatus,
    pub created_at: u64,
    pub expires_at: u64,
    pub is_locked: bool,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct FishLock {
    #[key]
    pub fish_id: u256,
    pub is_locked: bool,
    pub locked_by_offer: u256,
    pub locked_at: u64,
}

#[derive(Drop, Serde, Introspect)]
#[dojo::model]
pub struct ActiveTradeOffers {
    #[key]
    pub creator: ContractAddress,
    pub offers: Array<u256>,
}

pub trait TradeOfferTrait {
    fn create_offer(
        id: u256,
        creator: ContractAddress,
        offered_fish_id: u256,
        criteria: MatchCriteria,
        requested_fish_id: Option<u256>,
        requested_species: Option<u8>,
        requested_generation: Option<u8>,
        requested_traits: Span<felt252>,
        duration_hours: u64,
    ) -> TradeOffer;

    fn is_active(offer: @TradeOffer) -> bool;
    fn is_expired(offer: @TradeOffer) -> bool;
    fn can_accept(offer: @TradeOffer) -> bool;
    fn lock_offer(offer: TradeOffer) -> TradeOffer;
    fn complete_offer(offer: TradeOffer) -> TradeOffer;
    fn cancel_offer(offer: TradeOffer) -> TradeOffer;

    fn matches_criteria(
        offer: @TradeOffer,
        fish_id: u256,
        fish_species: u8,
        fish_generation: u8,
        fish_traits: Span<felt252>,
    ) -> bool;
}

pub trait FishLockTrait {
    fn lock_fish(fish_id: u256, offer_id: u256) -> FishLock;
    fn unlock_fish(fish_id: u256) -> FishLock;
    fn is_locked(lock: FishLock) -> bool;
}

impl TradeOfferImpl of TradeOfferTrait {
    fn create_offer(
        id: u256,
        creator: ContractAddress,
        offered_fish_id: u256,
        criteria: MatchCriteria,
        requested_fish_id: Option<u256>,
        requested_species: Option<u8>,
        requested_generation: Option<u8>,
        requested_traits: Span<felt252>,
        duration_hours: u64,
    ) -> TradeOffer {
        let current_time = get_block_timestamp();
        let mut traits_array = ArrayTrait::new();
        let mut i = 0;
        loop {
            if i >= requested_traits.len() {
                break;
            }
            traits_array.append(*requested_traits.at(i));
            i += 1;
        };

        TradeOffer {
            id,
            creator,
            offered_fish_id,
            requested_fish_criteria: criteria,
            requested_fish_id,
            requested_species,
            requested_generation,
            requested_traits: traits_array,
            status: TradeOfferStatus::Active,
            created_at: current_time,
            expires_at: current_time + (duration_hours * 3600),
            is_locked: false,
        }
    }

    fn is_active(offer: @TradeOffer) -> bool {
        *offer.status == TradeOfferStatus::Active && !Self::is_expired(offer) && !*offer.is_locked
    }

    fn is_expired(offer: @TradeOffer) -> bool {
        get_block_timestamp() > *offer.expires_at
    }

    fn can_accept(offer: @TradeOffer) -> bool {
        Self::is_active(offer)
    }

    fn lock_offer(mut offer: TradeOffer) -> TradeOffer {
        offer.is_locked = true;
        offer
    }

    fn complete_offer(mut offer: TradeOffer) -> TradeOffer {
        offer.status = TradeOfferStatus::Completed;
        offer.is_locked = false;
        offer
    }

    fn cancel_offer(mut offer: TradeOffer) -> TradeOffer {
        offer.status = TradeOfferStatus::Cancelled;
        offer.is_locked = false;
        offer
    }

    fn matches_criteria(
        offer: @TradeOffer,
        fish_id: u256,
        fish_species: u8,
        fish_generation: u8,
        fish_traits: Span<felt252>,
    ) -> bool {
        match *offer.requested_fish_criteria {
            MatchCriteria::ExactId => {
                match offer.requested_fish_id {
                    Option::Some(required_id) => fish_id == *required_id,
                    Option::None => false,
                }
            },
            MatchCriteria::Species => {
                match offer.requested_species {
                    Option::Some(required_species) => fish_species == *required_species,
                    Option::None => false,
                }
            },
            MatchCriteria::SpeciesAndGen => {
                match (offer.requested_species, offer.requested_generation) {
                    (
                        Option::Some(species), Option::Some(gen),
                    ) => { fish_species == *species && fish_generation == *gen },
                    _ => false,
                }
            },
            MatchCriteria::Traits => {
                // Check if all requested traits are present in the fish
                let mut i = 0;
                let required_traits = offer.requested_traits.span();
                loop {
                    if i >= required_traits.len() {
                        break true;
                    }
                    let required_trait = *required_traits.at(i);
                    let mut found = false;
                    let mut j = 0;
                    loop {
                        if j >= fish_traits.len() {
                            break;
                        }
                        if *fish_traits.at(j) == required_trait {
                            found = true;
                            break;
                        }
                        j += 1;
                    };
                    if !found {
                        break false;
                    }
                    i += 1;
                }
            },
        }
    }
}

impl FishLockImpl of FishLockTrait {
    fn lock_fish(fish_id: u256, offer_id: u256) -> FishLock {
        FishLock {
            fish_id, is_locked: true, locked_by_offer: offer_id, locked_at: get_block_timestamp(),
        }
    }

    fn unlock_fish(fish_id: u256) -> FishLock {
        FishLock { fish_id, is_locked: false, locked_by_offer: 0, locked_at: 0 }
    }

    fn is_locked(lock: FishLock) -> bool {
        lock.is_locked
    }
}

// Helper functions for ID generation
pub fn trade_offer_id_target() -> felt252 {
    'TRADE_OFFER_COUNTER'
}

#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use super::*;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_create_trade_offer() {
        let offer = TradeOfferImpl::create_offer(
            1,
            zero_address(),
            100,
            MatchCriteria::ExactId,
            Option::Some(200),
            Option::None,
            Option::None,
            array![].span(),
            24,
        );
        assert(offer.id == 1, 'Offer ID should match');
        assert(offer.status == TradeOfferStatus::Active, 'Should be active');
    }

    #[test]
    fn test_exact_id_matching() {
        let offer = TradeOfferImpl::create_offer(
            1,
            zero_address(),
            100,
            MatchCriteria::ExactId,
            Option::Some(200),
            Option::None,
            Option::None,
            array![].span(),
            24,
        );

        assert(
            TradeOfferImpl::matches_criteria(@offer, 200, 1, 1, array![].span()),
            'Should match exact ID',
        );
        assert(
            !TradeOfferImpl::matches_criteria(@offer, 201, 1, 1, array![].span()),
            'Should not match different ID',
        );
    }

    #[test]
    fn test_fish_locking() {
        let lock = FishLockImpl::lock_fish(100, 1);
        assert(FishLockImpl::is_locked(lock), 'Fish should be locked');

        let unlock = FishLockImpl::unlock_fish(100);
        assert(!FishLockImpl::is_locked(unlock), 'Fish should be unlocked');
    }
}
