use starknet::ContractAddress;
#[starknet::interface]
pub trait IFish<ContractState> {
    fn create_fish(ref self: ContractState, owner: ContractAddress, fish_type: u32) -> u64;
    fn feed(ref self: ContractState, fish_id: u64, amount: u32);
    fn grow(ref self: ContractState, fish_id: u64, amount: u32);
    fn heal(ref self: ContractState, fish_id: u64, amount: u32);
    fn damage(ref self: ContractState, fish_id: u64, amount: u32);
    fn regenerate_health(ref self: ContractState, fish_id: u64, aquarium_cleanliness: u32);
    fn update_hunger(ref self: ContractState, fish_id: u64, hours_passed: u32);
    fn update_age(ref self: ContractState, fish_id: u64, days_passed: u32);
    fn get_hunger_level(self: @ContractState, fish_id: u64) -> u32;
    fn get_growth_rate(self: @ContractState, fish_id: u64) -> u32;
    fn get_health(self: @ContractState, fish_id: u64) -> u32;
}
