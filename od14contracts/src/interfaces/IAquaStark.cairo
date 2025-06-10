use aqua_stark_od::models::fish_model::{Fish, Species};
use starknet::ContractAddress;
// define the interface
#[starknet::interface]
pub trait IAquaStark<T> {
    fn create_fish_id(ref self: T) -> u256;
    fn new_fish(ref self: T, owner: ContractAddress, species: Species) -> Fish;
    fn get_fish(ref self: T, id: u256) -> Fish;
}
