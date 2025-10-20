use aqua_stark::models::aquarium_model::Aquarium;
use aqua_stark::models::decoration_model::Decoration;
use aqua_stark::models::fish_model::FishOwner;
use aqua_stark::models::player_model::Player;
use aqua_stark::models::auctions_model::*;

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
    // Game-related functions moved to IGame interface
    fn get_player(self: @T, address: ContractAddress) -> Player;
    // Fish-related getters moved to IGame interface
    fn get_aquarium_owner(self: @T, id: u256) -> ContractAddress;
    fn get_decoration_owner(self: @T, id: u256) -> ContractAddress;
    fn get_aquarium(self: @T, id: u256) -> Aquarium;
    fn get_decoration(self: @T, id: u256) -> Decoration;
    // Fish and decoration addition moved to IGame interface
    fn get_player_aquariums(self: @T, player: ContractAddress) -> Array<Aquarium>;
    fn get_player_decorations(self: @T, player: ContractAddress) -> Array<Decoration>;
    // Player fish-related functions moved to IGame interface
    fn get_player_aquarium_count(self: @T, player: ContractAddress) -> u32;
    fn get_player_decoration_count(self: @T, player: ContractAddress) -> u32;
    fn is_verified(self: @T, player: ContractAddress) -> bool;
    // Fish breeding and family tree functions moved to IGame interface
    // Marketplace functions moved to IGame interface
    fn get_fish_owner_for_auction(self: @T, fish_id: u256) -> FishOwner;
   
}
