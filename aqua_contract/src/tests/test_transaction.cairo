#[cfg(test)]
mod tests {
    use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{spawn_test_world, NamespaceDef, TestResource, WorldStorageTestTrait};
    use starknet::{ContractAddress, contract_address_const};
    use starknet::testing::{set_caller_address};

    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter,
        event_id_target, transaction_id_target,
        m_TransactionLog, m_EventTypeDetails, m_EventCounter, m_TransactionCounter
    };
    use aqua_stark::models::player_model::{Player, PlayerCounter, m_Player, m_PlayerCounter};

    fn setup_world() -> dojo::world::WorldStorage {
        // Create namespace definition
        let ndef = NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_TransactionLog::TEST_CLASS_HASH),
                TestResource::Model(m_EventTypeDetails::TEST_CLASS_HASH),
                TestResource::Model(m_EventCounter::TEST_CLASS_HASH),
                TestResource::Model(m_TransactionCounter::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_PlayerCounter::TEST_CLASS_HASH),
            ].span()
        };
        
        spawn_test_world([ndef].span())
    }

    #[test]
    fn test_transaction_log_model() {
        let mut world = setup_world();

        let player_addr = contract_address_const::<0x123>();
        let transaction_log = TransactionLog {
            transaction_id: 1,
            event_type_id: 1,
            player: player_addr,
            timestamp: 1234567890,
            payload: array![100, 200, 300],
            status: 'PENDING',
            confirmation_hash: 'test_hash',
        };

        world.write_model_test(@transaction_log);
        let retrieved_log: TransactionLog = world.read_model_test(1);
        
        assert(retrieved_log.transaction_id == 1, 'Transaction ID should match');
        assert(retrieved_log.event_type_id == 1, 'Event type ID should match');
        assert(retrieved_log.player == player_addr, 'Player should match');
        assert(retrieved_log.status == 'PENDING', 'Status should match');
    }

    #[test]
    fn test_event_type_details_model() {
        let mut world = setup_world();

        let event_details = EventTypeDetails {
            type_id: 1,
            name: "FishCreated",
            total_logged: 0,
            created_at: 1234567890,
        };

        world.write_model_test(@event_details);
        let retrieved_details: EventTypeDetails = world.read_model_test(1);
        
        assert(retrieved_details.type_id == 1, 'Type ID should match');
        assert(retrieved_details.name == "FishCreated", 'Name should match');
        assert(retrieved_details.total_logged == 0, 'Total logged should match');
    }

    #[test]
    fn test_counters() {
        let mut world = setup_world();

        // Test EventCounter
        let event_counter = EventCounter { 
            target: event_id_target(), 
            current_val: 0 
        };
        world.write_model_test(@event_counter);
        let retrieved_counter: EventCounter = world.read_model_test(event_id_target());
        assert(retrieved_counter.current_val == 0, 'Counter should start at 0');

        // Test TransactionCounter
        let txn_counter = TransactionCounter { 
            target: transaction_id_target(), 
            current_val: 0 
        };
        world.write_model_test(@txn_counter);
        let retrieved_txn_counter: TransactionCounter = world.read_model_test(transaction_id_target());
        assert(retrieved_txn_counter.current_val == 0, 'Counter should start at 0');
    }

    #[test]
    fn test_player_model() {
        let mut world = setup_world();

        let player_addr = contract_address_const::<0x789>();
        let player = Player {
            wallet: player_addr,
            id: 1,
            username: 'testuser',
            inventory_ref: contract_address_const::<0x100>(),
            is_verified: false,
            aquarium_count: 0,
            fish_count: 0,
            experience_points: 0,
            decoration_count: 0,
            transaction_count: 0,
            registered_at: 1234567890,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_history: array![],
            last_action_reset: 0,
            daily_fish_creations: 0,
            daily_decoration_creations: 0,
            daily_aquarium_creations: 0,
        };

        world.write_model_test(@player);
        let retrieved_player: Player = world.read_model_test(player_addr);
        
        assert(retrieved_player.id == 1, 'Player ID should match');
        assert(retrieved_player.username == 'testuser', 'Username should match');
        assert(retrieved_player.wallet == player_addr, 'Wallet should match');
        assert(!retrieved_player.is_verified, 'Verified status should match');
    }
}