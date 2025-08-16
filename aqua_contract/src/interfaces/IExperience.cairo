use aqua_stark::models::experience_model::{Experience, ExperienceConfig};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IExperience<T> {
    fn grant_experience(ref self: T, player: ContractAddress, amount: u64);
    fn get_player_experience(self: @T, player: ContractAddress) -> Experience;
    fn get_experience_config(self: @T) -> ExperienceConfig;
    fn update_experience_config(
        ref self: T, base_experience: u64, experience_multiplier: u64, max_level: u32,
    );
    fn initialize_player_experience(ref self: T, player: ContractAddress);
    fn get_level_progress(self: @T, player: ContractAddress) -> (u64, u64);
    fn get_experience_for_next_level(self: @T, player: ContractAddress) -> u64;
    fn claim_level_reward(ref self: T, level: u32);
    fn get_total_experience_granted(self: @T) -> u256;
}
