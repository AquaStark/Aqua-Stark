use starknet::{ContractAddress, get_block_timestamp};

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct TransactionLog {
    #[key]
    pub id: u256,
    pub event_type_id: u256,
    pub player: ContractAddress,
    pub description: ByteArray,
    pub timestamp: u64,
}
#[generate_trait]
pub impl TransactionImpl of TransactionLogTrait {
    fn log_transaction(
        id: u256, event_type_id: u256, player: ContractAddress, description: ByteArray,
    ) -> TransactionLog {
        TransactionLog { id, event_type_id, player, description, timestamp: get_block_timestamp() }
    }
}


#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct EventTypeDetails {
    #[key]
    pub type_id: u256,
    pub name: ByteArray,
    pub logger: ContractAddress,
    pub total_logged: u32,
    pub transaction_history: Array<u256>,
}

#[generate_trait]
pub impl EventDetailsImpl of EventDetailsTrait {
    fn create_event(type_id: u256, name: ByteArray, logger: ContractAddress) -> EventTypeDetails {
        EventTypeDetails { type_id, name, logger, total_logged: 0, transaction_history: array![] }
    }
    fn update_logger(
        mut event_details: EventTypeDetails, new_logger: ContractAddress,
    ) -> EventTypeDetails {
        event_details.logger = new_logger;
        event_details
    }
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct EventCounter {
    #[key]
    pub target: felt252,
    pub current_val: u256,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct TransactionCounter {
    #[key]
    pub target: felt252,
    pub current_val: u256,
}

pub fn event_id_target() -> felt252 {
    'EVENT_COUNTER'
}

pub fn transaction_id_target() -> felt252 {
    'TRANSACTION_COUNTER'
}

#[cfg(test)]
mod tests {
    use starknet::{contract_address_const, get_block_timestamp};
    use super::{*, EventTypeDetails, TransactionLog};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_event_type_creation() {
        let event_details = EventTypeDetails {
            type_id: 0,
            name: "Transfer Transaction",
            logger: zero_address(),
            total_logged: 0,
            transaction_history: array![],
        };
        assert(event_details.type_id == 0, 'Event type ID should match');
    }

    #[test]
    fn test_transaction_log_creation() {
        let time = get_block_timestamp();
        let txn_log = TransactionLog {
            id: 0, event_type_id: 1, player: zero_address(), description: "Test", timestamp: time,
        };
        assert(txn_log.id == 0, 'Transaction log ID should match');
    }
}
