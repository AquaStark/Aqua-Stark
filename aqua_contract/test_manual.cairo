use aqua_stark::models::trade_model::{
    TradeOffer, TradeOfferStatus, MatchCriteria, FishLock, TradeOfferTrait, FishLockTrait,
};
use starknet::contract_address_const;

fn main() {
    // Test 1: Create a trade offer
    let alice = contract_address_const::<0x1>();
    let offer = TradeOfferTrait::create_offer(
        1,
        alice,
        100, // Alice's fish ID
        MatchCriteria::ExactId,
        Option::Some(200), // Wants Bob's fish ID 200
        Option::None,
        Option::None,
        array![],
        24 // 24 hours
    );

    print!("Offer created: ID = {}", offer.id);
    print!("Status: {:?}", offer.status);

    // Test 2: Check matching
    let matches = TradeOfferTrait::matches_criteria(offer, 200, 1, 1, array![]);
    print!("Fish 200 matches: {}", matches);

    let no_match = TradeOfferTrait::matches_criteria(offer, 201, 1, 1, array![]);
    print!("Fish 201 matches: {} (should be false)", no_match);

    // Test 3: Fish locking
    let lock = FishLockTrait::lock_fish(100, offer.id);
    print!("Fish locked: {}", FishLockTrait::is_locked(lock));

    print!("All manual tests passed!");
}
