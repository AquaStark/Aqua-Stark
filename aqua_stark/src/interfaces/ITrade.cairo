use aqua_stark::models::trade_model::{FishLock, MatchCriteria, TradeOffer};
use starknet::ContractAddress;

#[starknet::interface]
pub trait ITrade<T> {
    fn create_trade_offer(
        ref self: T,
        offered_fish_id: u256,
        criteria: felt252,
        requested_fish_id: Option<u256>,
        requested_species: Option<u8>,
        requested_generation: Option<u8>,
        duration_hours: u64,
    ) -> u256;

    fn accept_trade_offer(ref self: T, offer_id: u256, offered_fish_id: u256) -> bool;

    fn cancel_trade_offer(ref self: T, offer_id: u256) -> bool;

    fn get_trade_offer(self: @T, offer_id: u256) -> TradeOffer;

    fn get_active_trade_offers(self: @T, creator: ContractAddress) -> Array<TradeOffer>;

    fn get_all_active_offers(self: @T) -> Array<TradeOffer>;

    fn get_offers_for_fish(self: @T, fish_id: u256) -> Array<TradeOffer>;

    // Fish lock management
    fn get_fish_lock_status(self: @T, fish_id: u256) -> FishLock;

    fn is_fish_locked(self: @T, fish_id: u256) -> bool;

    fn cleanup_expired_offers(ref self: T) -> u256;

    fn get_total_trades_count(self: @T) -> u256;

    fn get_user_trade_count(self: @T, user: ContractAddress) -> u256;
}
