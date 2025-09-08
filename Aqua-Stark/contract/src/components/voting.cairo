use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use dojo::world::IWorldDispatcher;
use dojo::model::ModelStorage;
use dojo::event::EventStorage;

use aqua_stark::entities::voting::{Poll, Vote, PollCounter, PollStatus, VoteOption, PollTrait};
use aqua_stark::entities::player::Player;

// Constants
const POLL_COUNTER_ID: felt252 = 'poll_counter';

// Events for the voting system
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PollCreated {
    #[key]
    pub poll_id: u32,
    pub creator: ContractAddress,
    pub title: felt252,
    pub description: felt252,
    pub end_time: u64,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct VoteCast {
    #[key]
    pub poll_id: u32,
    #[key]
    pub player: ContractAddress,
    pub option: VoteOption,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PollStatusUpdated {
    #[key]
    pub poll_id: u32,
    pub new_status: PollStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct PollFinalized {
    #[key]
    pub poll_id: u32,
    pub yes_count: u32,
    pub no_count: u32,
    pub abstain_count: u32,
    pub total_votes: u32,
}

// Define the interface for the voting system
#[starknet::interface]
pub trait IVoting<T> {
    // Create a new poll
    fn create_poll(
        ref self: T,
        title: felt252,
        description: felt252,
        duration_seconds: u64
    ) -> u32;
    
    // Cast a vote on a poll
    fn vote(
        ref self: T,
        poll_id: u32,
        option: VoteOption
    );
    
    // Close a poll
    fn close_poll(ref self: T, poll_id: u32);
    
    // Get poll details
    fn get_poll(self: @T, poll_id: u32) -> Poll;
    
    // Check if a player has voted on a specific poll
    fn has_voted(self: @T, player: ContractAddress, poll_id: u32) -> bool;
}

// Voting system implementation
#[dojo::contract]
pub mod voting_system {
    use super::*;

    #[storage]
    struct Storage {
        world: IWorldDispatcher,
    }

    // Contract constructor
    #[constructor]
    fn constructor(ref self: ContractState, world: IWorldDispatcher) {
        self.world.write(world);
        
        // Initialize the poll counter if it doesn't exist
        let mut world = self.world_default();
        let poll_counter = world.read_model(POLL_COUNTER_ID);
        if poll_counter.count == 0 {
            world.write_model(@PollCounter { id: POLL_COUNTER_ID, count: 0 });
        }
    }

    // Contract functions
    #[abi(embed_v0)]
    impl VotingImpl of super::IVoting<ContractState> {
        // Create a new poll
        fn create_poll(
            ref self: ContractState,
            title: felt252,
            description: felt252,
            duration_seconds: u64
        ) -> u32 {
            // Get the caller address
            let caller = get_caller_address();
            
            // Access the world
            let mut world = self.world_default();
            
            // Get the next poll id
            let mut poll_counter = world.read_model(POLL_COUNTER_ID);
            let poll_id = poll_counter.count;
            
            // Increment the counter
            poll_counter.count += 1;
            world.write_model(@poll_counter);
            
            // Calculate end time
            let current_time = get_block_timestamp();
            let end_time = current_time + duration_seconds;
            
            // Create the new poll
            let poll = Poll {
                poll_id,
                creator: caller,
                title,
                description,
                status: PollStatus::Active,
                end_time,
                yes_count: 0,
                no_count: 0,
                abstain_count: 0,
                total_votes: 0,
            };
            
            // Save the poll
            world.write_model(@poll);
            
            // Emit event
            world.emit_event(@PollCreated {
                poll_id,
                creator: caller,
                title,
                description,
                end_time,
            });
            
            poll_id
        }

        // Cast a vote on a poll
        fn vote(
            ref self: ContractState,
            poll_id: u32,
            option: VoteOption
        ) {
            // Get the caller address
            let caller = get_caller_address();
            
            // Access the world
            let mut world = self.world_default();
            
            // Get the poll
            let mut poll = world.read_model(poll_id);
            
            // Ensure the poll exists and is active
            assert(poll.creator != starknet::contract_address_const::<0>(), 'Poll does not exist');
            assert(poll.is_active(), 'Poll is not active');
            
            // Check if the poll has ended
            let current_time = get_block_timestamp();
            if poll.has_ended(current_time) {
                // Close the poll if it has ended
                self._close_poll(poll_id);
                assert(false, 'Poll has ended');
            }
            
            // Check if the player has already voted
            let existing_vote = world.read_model((caller, poll_id));
            assert(existing_vote.timestamp == 0, 'Already voted');
            
            // Create the vote
            let vote = Vote {
                player: caller,
                poll_id,
                option,
                timestamp: current_time,
            };
            
            // Save the vote
            world.write_model(@vote);
            
            // Update poll counts
            match option {
                VoteOption::Yes => {
                    poll.yes_count += 1;
                },
                VoteOption::No => {
                    poll.no_count += 1;
                },
                VoteOption::Abstain => {
                    poll.abstain_count += 1;
                },
            };
            
            poll.total_votes += 1;
            world.write_model(@poll);
            
            // Emit event
            world.emit_event(@VoteCast {
                poll_id,
                player: caller,
                option,
            });
        }

        // Close a poll
        fn close_poll(ref self: ContractState, poll_id: u32) {
            // Get the caller address
            let caller = get_caller_address();
            
            // Access the world
            let mut world = self.world_default();
            
            // Get the poll
            let poll = world.read_model(poll_id);
            
            // Ensure the poll exists
            assert(poll.creator != starknet::contract_address_const::<0>(), 'Poll does not exist');
            
            // Only the creator or an expired poll can be closed
            let current_time = get_block_timestamp();
            if poll.creator != caller {
                assert(poll.has_ended(current_time), 'Not authorized');
            }
            
            // Close the poll
            self._close_poll(poll_id);
        }

        // Get poll details
        fn get_poll(self: @ContractState, poll_id: u32) -> Poll {
            // Access the world
            let world = self.world_default();
            
            // Get and return the poll
            let poll = world.read_model(poll_id);
            
            // Ensure the poll exists
            assert(poll.creator != starknet::contract_address_const::<0>(), 'Poll does not exist');
            
            poll
        }

        // Check if a player has voted on a specific poll
        fn has_voted(self: @ContractState, player: ContractAddress, poll_id: u32) -> bool {
            // Access the world
            let world = self.world_default();
            
            // Get the vote
            let vote = world.read_model((player, poll_id));
            
            // Return true if the timestamp is not 0 (meaning a vote exists)
            vote.timestamp != 0
        }
    }

    // Internal functions
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        // Internal function to close a poll
        fn _close_poll(ref self: ContractState, poll_id: u32) {
            // Access the world
            let mut world = self.world_default();
            
            // Get the poll
            let mut poll = world.read_model(poll_id);
            
            // Ensure the poll exists and is active
            assert(poll.creator != starknet::contract_address_const::<0>(), 'Poll does not exist');
            assert(poll.is_active(), 'Poll already closed');
            
            // Close the poll
            poll.status = PollStatus::Closed;
            world.write_model(@poll);
            
            // Emit events
            world.emit_event(@PollStatusUpdated {
                poll_id,
                new_status: PollStatus::Closed,
            });
            
            world.emit_event(@PollFinalized {
                poll_id,
                yes_count: poll.yes_count,
                no_count: poll.no_count,
                abstain_count: poll.abstain_count,
                total_votes: poll.total_votes,
            });
        }

        // Helper to get the world with the default namespace
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }
    }
}
