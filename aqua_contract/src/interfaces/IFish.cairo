use starknet::ContractAddress;
use aqua_stark::models::fish_model::{Fish, FishParents, Species, Listing, FishOwner};
use aqua_stark::models::trade_model::FishLock;

// define the interface
#[starknet::interface]
pub trait IFish<T> {
    fn new_fish(ref self: T, aquarium_id: u256, species: Species) -> Fish;
    fn breed_fishes(ref self: T, parent1_id: u256, parent2_id: u256) -> u256;
    fn move_fish_to_aquarium(ref self: T, fish_id: u256, from: u256, to: u256) -> bool;
    fn get_fish(self: @T, id: u256) -> Fish;
    fn get_fish_owner(self: @T, id: u256) -> ContractAddress;
    fn add_fish_to_aquarium(ref self: T, fish: Fish, aquarium_id: u256);
    fn get_player_fishes(self: @T, player: ContractAddress) -> Array<Fish>;
    fn get_player_fish_count(self: @T, player: ContractAddress) -> u32;
    fn get_fish_offspring(self: @T, fish_id: u256) -> Array<Fish>;
    fn get_fish_family_tree(self: @T, fish_id: u256) -> Array<FishParents>;
    fn get_fish_ancestor(self: @T, fish_id: u256, generation: u32) -> FishParents;
    fn list_fish(self: @T, fish_id: u256, price: u256) -> Listing;
    fn get_listing(self: @T, listing_id: felt252) -> Listing;
    fn purchase_fish(self: @T, listing_id: felt252);
    fn get_fish_owner_for_auction(self: @T, fish_id: u256) -> FishOwner;
    fn get_fish_lock_status(self: @T, fish_id: u256) -> FishLock;
    fn is_fish_locked(self: @T, fish_id: u256) -> bool;
}