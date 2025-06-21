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
    fn create_new_player_id(ref self: T) -> u256;
    fn create_decoration_id(ref self: T) -> u256;
    fn new_decoration(
        ref self: T,
        aquarium_id: u256,
        name: felt252,
        description: felt252,
        price: u256,
        rarity: felt252,
    ) -> Decoration;
    fn create_aquarium_id(ref self: T) -> u256;
    fn create_fish_id(ref self: T) -> u256;
    fn new_aquarium(ref self: T, owner: ContractAddress, max_capacity: u32) -> Aquarium;
    fn new_fish(ref self: T, owner: ContractAddress, species: Species) -> Fish;
    fn get_player(self: @T, address: ContractAddress) -> Player;
    fn get_fish(self: @T, id: u256) -> Fish;
    fn get_aquarium(self: @T, id: u256) -> Aquarium;
    fn get_decoration(self: @T, id: u256) -> Decoration;
    fn add_fish_to_aquarium(ref self: T, fish: Fish, aquarium_id: u256);
    fn add_decoration_to_aquarium(ref self: T, decoration: Decoration, aquarium_id: u256);
}

