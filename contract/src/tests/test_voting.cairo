use starknet::{ContractAddress, contract_address_const, get_block_timestamp};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo::test_utils::{spawn_test_world, deploy_contract};

use aqua_stark::components::voting::{
    IVotingDispatcher, IVotingDispatcherTrait, PollCreated, VoteCast
};
use aqua_stark::entities::voting::{Poll, Vote, PollStatus, VoteOption};

// Helper function to create a test address
fn test_address() -> ContractAddress {
    contract_address_const::<'test'>()
}

// Helper function to create a zero address
fn zero_address() -> ContractAddress {
    contract_address_const::<0>()
}

#[test]
fn test_create_poll() {
    // Set up the test environment
    let world = spawn_test_world();
    
    // Deploy the voting contract
    let contract_address = deploy_contract(
        world, 
        aqua_stark::components::voting::voting_system::TEST_CLASS_HASH, 
        array![].span()
    );
    let voting_contract = IVotingDispatcher { contract_address };
    
    // Create a poll
    let poll_id = voting_contract.create_poll(
        'Test Poll',
        'This is a test poll description',
        86400 // 1 day duration
    );
    
    // Verify the poll was created correctly
    let poll = voting_contract.get_poll(poll_id);
    assert(poll.poll_id == 0, 'Poll ID should be 0');
    assert(poll.title == 'Test Poll', 'Poll title should match');
    assert(poll.description == 'This is a test poll description', 'Poll description should match');
    assert(poll.status == PollStatus::Active, 'Poll should be active');
    assert(poll.yes_count == 0, 'Yes count should be 0');
    assert(poll.no_count == 0, 'No count should be 0');
    assert(poll.abstain_count == 0, 'Abstain count should be 0');
    assert(poll.total_votes == 0, 'Total votes should be 0');
}

#[test]
fn test_vote_on_poll() {
    // Set up the test environment
    let world = spawn_test_world();
    
    // Deploy the voting contract
    let contract_address = deploy_contract(
        world, 
        aqua_stark::components::voting::voting_system::TEST_CLASS_HASH, 
        array![].span()
    );
    let voting_contract = IVotingDispatcher { contract_address };
    
    // Create a poll
    let poll_id = voting_contract.create_poll(
        'Test Poll',
        'This is a test poll description',
        86400 // 1 day duration
    );
    
    // Cast a vote
    voting_contract.vote(poll_id, VoteOption::Yes);
    
    // Verify the vote was recorded
    let poll = voting_contract.get_poll(poll_id);
    assert(poll.yes_count == 1, 'Yes count should be 1');
    assert(poll.total_votes == 1, 'Total votes should be 1');
    
    // Verify the player has voted
    let caller = starknet::testing::set_caller_address(test_address());
    assert(voting_contract.has_voted(caller, poll_id), 'Player should have voted');
}

#[test]
#[should_panic(expected: ('Already voted',))]
fn test_cannot_vote_twice() {
    // Set up the test environment
    let world = spawn_test_world();
    
    // Deploy the voting contract
    let contract_address = deploy_contract(
        world, 
        aqua_stark::components::voting::voting_system::TEST_CLASS_HASH, 
        array![].span()
    );
    let voting_contract = IVotingDispatcher { contract_address };
    
    // Create a poll
    let poll_id = voting_contract.create_poll(
        'Test Poll',
        'This is a test poll description',
        86400 // 1 day duration
    );
    
    // Cast a vote
    voting_contract.vote(poll_id, VoteOption::Yes);
    
    // Try to vote again (should fail)
    voting_contract.vote(poll_id, VoteOption::No);
}

#[test]
fn test_close_poll() {
    // Set up the test environment
    let world = spawn_test_world();
    
    // Deploy the voting contract
    let contract_address = deploy_contract(
        world, 
        aqua_stark::components::voting::voting_system::TEST_CLASS_HASH, 
        array![].span()
    );
    let voting_contract = IVotingDispatcher { contract_address };
    
    // Create a poll
    let poll_id = voting_contract.create_poll(
        'Test Poll',
        'This is a test poll description',
        86400 // 1 day duration
    );
    
    // Close the poll
    voting_contract.close_poll(poll_id);
    
    // Verify the poll was closed
    let poll = voting_contract.get_poll(poll_id);
    assert(poll.status == PollStatus::Closed, 'Poll should be closed');
}

#[test]
#[should_panic(expected: ('Poll already closed',))]
fn test_cannot_close_twice() {
    // Set up the test environment
    let world = spawn_test_world();
    
    // Deploy the voting contract
    let contract_address = deploy_contract(
        world, 
        aqua_stark::components::voting::voting_system::TEST_CLASS_HASH, 
        array![].span()
    );
    let voting_contract = IVotingDispatcher { contract_address };
    
    // Create a poll
    let poll_id = voting_contract.create_poll(
        'Test Poll',
        'This is a test poll description',
        86400 // 1 day duration
    );
    
    // Close the poll
    voting_contract.close_poll(poll_id);
    
    // Try to close again (should fail)
    voting_contract.close_poll(poll_id);
}
