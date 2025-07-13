use aqua_stark::models::aquarium_model::Aquarium;
use aqua_stark::models::decoration_model::Decoration;
use aqua_stark::models::fish_model::{Fish, Species};
use aqua_stark::models::player_model::Player;
use starknet::ContractAddress;
// define the interface
#[starknet::interface]
pub trait IAquaStark<T> {
    fn get_username_from_address(self: @T, address: ContractAddress) -> felt252;
    fn register(ref self: T, username: felt252);
    fn new_decoration(
        ref self: T,
        aquarium_id: u256,
        name: felt252,
        description: felt252,
        price: u256,
        rarity: felt252,
    ) -> Decoration;
    fn new_aquarium(
        ref self: T, owner: ContractAddress, max_capacity: u32, max_decorations: u32,
    ) -> Aquarium;
    fn new_fish(ref self: T, aquarium_id: u256, species: Species) -> Fish;
    fn breed_fishes(ref self: T, parent1_id: u256, parent2_id: u256) -> u256;
    fn move_fish_to_aquarium(ref self: T, fish_id: u256, from: u256, to: u256) -> bool;
    fn move_decoration_to_aquarium(ref self: T, decoration_id: u256, from: u256, to: u256) -> bool;
    fn get_player(self: @T, address: ContractAddress) -> Player;
    fn get_fish(self: @T, id: u256) -> Fish;
    fn get_fish_owner(self: @T, id: u256) -> ContractAddress;
    fn get_aquarium_owner(self: @T, id: u256) -> ContractAddress;
    fn get_decoration_owner(self: @T, id: u256) -> ContractAddress;
    fn get_aquarium(self: @T, id: u256) -> Aquarium;
    fn get_decoration(self: @T, id: u256) -> Decoration;
    fn add_fish_to_aquarium(ref self: T, fish: Fish, aquarium_id: u256);
    fn add_decoration_to_aquarium(ref self: T, decoration: Decoration, aquarium_id: u256);
    fn get_player_fishes(self: @T, player: ContractAddress) -> Array<Fish>;
    fn get_player_aquariums(self: @T, player: ContractAddress) -> Array<Aquarium>;
    fn get_player_decorations(self: @T, player: ContractAddress) -> Array<Decoration>;
    fn get_player_fish_count(self: @T, player: ContractAddress) -> u32;
    fn get_player_aquarium_count(self: @T, player: ContractAddress) -> u32;
    fn get_player_decoration_count(self: @T, player: ContractAddress) -> u32;
    fn is_verified(self: @T, player: ContractAddress) -> bool;
    fn get_parents(self: @T, fish_id: u256) -> (u256, u256);
    fn get_fish_offspring(self: @T, fish_id: u256) -> Array<Fish>;
}
