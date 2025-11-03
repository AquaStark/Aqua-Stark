use aqua_stark::models::fish_model::{Fish, FishParents, Listing};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IFishSystem<T> {
    // Core fish management functions
    fn new_fish(ref self: T, aquarium_id: u256, species: felt252) -> Fish;
    fn breed_fishes(ref self: T, parent1_id: u256, parent2_id: u256) -> u256;
    fn move_fish_to_aquarium(ref self: T, fish_id: u256, from: u256, to: u256) -> bool;
    fn add_fish_to_aquarium(ref self: T, fish: Fish, aquarium_id: u256);

    // Fish retrieval functions
    fn get_fish(self: @T, id: u256) -> Fish;
    fn get_player_fishes(self: @T, player: ContractAddress) -> Array<Fish>;
    fn get_player_fish_count(self: @T, player: ContractAddress) -> u32;


    // Fish breeding and family tree
    fn get_parents(self: @T, fish_id: u256) -> (u256, u256);
    fn get_fish_offspring(self: @T, fish_id: u256) -> Array<Fish>;
    fn get_fish_family_tree(self: @T, fish_id: u256) -> Array<u256>;
    fn get_fish_ancestor(self: @T, fish_id: u256, generation: u32) -> FishParents;
    fn get_fish_owner(self: @T, id: u256) -> ContractAddress;

    // Marketplace functionality
    fn list_fish(self: @T, fish_id: u256, price: u256) -> Listing;
    fn purchase_fish(ref self: T, listing_id: felt252);
}
