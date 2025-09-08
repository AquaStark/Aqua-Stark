use starknet::ContractAddress;
use array::ArrayTrait;

// Poll Status enum to track the state of a poll
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum PollStatus {
    Active,
    Closed
}

// Vote Option enum to represent different voting options
#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum VoteOption {
    Yes,
    No,
    Abstain
}

// Poll model to store information about a voting poll
#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Poll {
    // Key fields must come first
    #[key]
    pub poll_id: u32,
    pub creator: ContractAddress,
    pub title: felt252,
    pub description: felt252,
    pub status: PollStatus,
    pub end_time: u64,
    pub yes_count: u32,
    pub no_count: u32,
    pub abstain_count: u32,
    pub total_votes: u32,
}

// Vote model to track individual votes
#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Vote {
    // Composite key of player address and poll_id
    #[key]
    pub player: ContractAddress,
    #[key]
    pub poll_id: u32,
    pub option: VoteOption,
    pub timestamp: u64,
}

// Player model to store player information
#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress,
    pub polls_created: u32,
    pub polls_voted: u32,
}

// Poll Counter to keep track of the next poll_id
#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct PollCounter {
    #[key]
    pub id: felt252, // Using a constant key
    pub count: u32,
}

// Implementation for PollStatus conversion to felt252
impl PollStatusIntoFelt252 of Into<PollStatus, felt252> {
    fn into(self: PollStatus) -> felt252 {
        match self {
            PollStatus::Active => 1,
            PollStatus::Closed => 2,
        }
    }
}

// Implementation for VoteOption conversion to felt252
impl VoteOptionIntoFelt252 of Into<VoteOption, felt252> {
    fn into(self: VoteOption) -> felt252 {
        match self {
            VoteOption::Yes => 1,
            VoteOption::No => 2,
            VoteOption::Abstain => 3,
        }
    }
}
