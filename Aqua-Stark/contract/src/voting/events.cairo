use starknet::ContractAddress;
use super::models::{VoteOption, PollStatus};

// Event emitted when a new poll is created
#[derive(Drop, Serde)]
#[dojo::event]
pub struct PollCreated {
    #[key]
    pub poll_id: u32,
    pub creator: ContractAddress,
    pub title: felt252,
    pub description: felt252,
    pub end_time: u64,
}

// Event emitted when a vote is cast
#[derive(Drop, Serde)]
#[dojo::event]
pub struct VoteCast {
    #[key]
    pub poll_id: u32,
    #[key]
    pub player: ContractAddress,
    pub option: VoteOption,
}

// Event emitted when a poll's status is updated
#[derive(Drop, Serde)]
#[dojo::event]
pub struct PollStatusUpdated {
    #[key]
    pub poll_id: u32,
    pub new_status: PollStatus,
}

// Event emitted when poll results are finalized
#[derive(Drop, Serde)]
#[dojo::event]
pub struct PollFinalized {
    #[key]
    pub poll_id: u32,
    pub yes_count: u32,
    pub no_count: u32,
    pub abstain_count: u32,
    pub total_votes: u32,
}
