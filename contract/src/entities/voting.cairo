use starknet::ContractAddress;

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
#[derive(Copy, Drop, Serde, Debug)]
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
#[derive(Copy, Drop, Serde, Debug)]
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

// Poll Counter to keep track of the next poll_id
#[derive(Copy, Drop, Serde, Debug)]
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

#[generate_trait]
pub impl PollImpl of PollTrait {
    fn is_active(self: @Poll) -> bool {
        self.status == PollStatus::Active
    }

    fn has_ended(self: @Poll, current_time: u64) -> bool {
        current_time > self.end_time
    }
}

#[cfg(test)]
mod tests {
    use starknet::{contract_address_const, get_block_timestamp};
    use super::{*, Poll, PollStatus};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_poll_creation() {
        let time = get_block_timestamp();
        let poll = Poll {
            poll_id: 1_u32,
            creator: zero_address(),
            title: 'Test Poll',
            description: 'This is a test poll',
            status: PollStatus::Active,
            end_time: time + 86400, // 1 day later
            yes_count: 0_u32,
            no_count: 0_u32,
            abstain_count: 0_u32,
            total_votes: 0_u32,
        };
        assert(poll.poll_id == 1, 'Poll ID should match');
        assert(poll.is_active(), 'Poll should be active');
        assert(!poll.has_ended(time), 'Poll should not have ended');
        assert(poll.has_ended(time + 86401), 'Poll should have ended');
    }
}
