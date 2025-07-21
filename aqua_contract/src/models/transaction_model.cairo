use starknet::{ContractAddress, get_block_timestamp};

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct TransactionLog {
    #[key]
    pub id: u256,
    pub event_type_id: u256,
    pub player: ContractAddress,
    pub payload: Array<felt252>,
    pub timestamp: u64,
}
#[generate_trait]
pub impl TransactionImpl of TransactionLogTrait {
    fn log_transaction(
        id: u256, event_type_id: u256, player: ContractAddress, payload: Array<felt252>,
    ) -> TransactionLog {
        TransactionLog { id, event_type_id, player, payload, timestamp: get_block_timestamp() }
    }
}


#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct EventTypeDetails {
    #[key]
    pub type_id: u256,
    pub name: ByteArray,
    pub total_logged: u32,
    pub transaction_history: Array<u256>,
}

#[generate_trait]
pub impl EventDetailsImpl of EventDetailsTrait {
    fn create_event(type_id: u256, name: ByteArray) -> EventTypeDetails {
        EventTypeDetails { type_id, name, total_logged: 0, transaction_history: array![] }
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

    #[derive(Serde, Drop, Clone, Copy)]
    pub struct AquariumCreatedData {
        pub aquarium_id: u256,
        pub name: felt252,
        pub owner: ContractAddress,
        pub capacity: u256,
    }

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_event_type_creation() {
        let event_details = EventTypeDetails {
            type_id: 0,
            name: "Transfer Transaction",
            total_logged: 0,
            transaction_history: array![],
        };
        assert(event_details.type_id == 0, 'Event type ID should match');
    }

    #[test]
    fn test_transaction_log_creation() {
        let time = get_block_timestamp();

        let aquarium_data = AquariumCreatedData {
            aquarium_id: 0, name: 'FIRE', owner: zero_address(), capacity: 100,
        };

        let mut payload: Array<felt252> = array![];
        aquarium_data.aquarium_id.serialize(ref payload);
        aquarium_data.name.serialize(ref payload);
        aquarium_data.owner.serialize(ref payload);
        aquarium_data.capacity.serialize(ref payload);

        let txn_log = TransactionLog {
            id: 0, event_type_id: 1, player: zero_address(), payload, timestamp: time,
        };

        assert(txn_log.id == 0, 'Transaction log ID should match');
    }
}
