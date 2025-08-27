#[cfg(test)]
mod tests {
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;
    use dojo::test_utils::spawn_test_world;
    
    use aqua_stark::systems::transaction::{Transaction};
    use aqua_stark::interfaces::ITransactionHistory::{
        ITransactionHistoryDispatcher, ITransactionHistoryDispatcherTrait
    };
    use aqua_stark::interfaces::ITransaction::{
        ITransactionDispatcher, ITransactionDispatcherTrait
    };
    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter,
        event_id_target, transaction_id_target,
    };
    use aqua_stark::models::player_model::{Player, PlayerCounter};
    use aqua_stark::base::events::{
        EventTypeRegistered, PlayerEventLogged, TransactionInitiated, 
        TransactionProcessed, TransactionConfirmed,
    };
    
    use starknet::{ContractAddress, contract_address_const, get_block_timestamp};
    use starknet::testing::{set_caller_address, set_contract_address};

    fn setup() -> (ITransactionDispatcher, ITransactionHistoryDispatcher, ContractAddress) {
        let caller = contract_address_const::<0x123>();
        let owner = contract_address_const::<0x456>();
        
        // Create world and register models
        let mut world = spawn_test_world([]);
        world.register_model(TransactionLog::selector());
        world.register_model(EventTypeDetails::selector());
        world.register_model(EventCounter::selector());
        world.register_model(TransactionCounter::selector());
        world.register_model(Player::selector());
        world.register_model(PlayerCounter::selector());

        // Initialize counters
        let event_counter = EventCounter { target: event_id_target(), current_val: 0 };
        let txn_counter = TransactionCounter { target: transaction_id_target(), current_val: 0 };
        world.write_model(@event_counter);
        world.write_model(@txn_counter);
        
        // Deploy transaction contract
        let contract_address = world.deploy_contract('salt', Transaction::contract_class_hash(), []);
        let transaction_contract = ITransactionDispatcher { contract_address };
        let transaction_history_contract = ITransactionHistoryDispatcher { contract_address };
        
        // Set owner permissions
        set_caller_address(owner);
        world.set_owner(contract_address, owner);
        
        (transaction_contract, transaction_history_contract, caller)
    }

    #[test]
    fn test_register_event_type_emits_events() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        let event_name = "FishCreated";
        let event_type_id = transaction_history_contract.register_event_type(event_name);
        
        assert(event_type_id > 0, 'Event type ID should be valid');
        
        // Verify event type details
        let event_details = transaction_history_contract.get_event_type_details(event_type_id);
        assert(event_details.type_id == event_type_id, 'Event type ID should match');
        assert(event_details.name == event_name, 'Event name should match');
        assert(event_details.total_logged == 0, 'Initial total should be 0');
    }

    #[test]
    fn test_log_event_emits_events() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        // First register an event type
        let event_name = "TestEvent";
        let event_type_id = transaction_history_contract.register_event_type(event_name);
        
        // Create a player
        let player_addr = contract_address_const::<0x789>();
        let player = Player {
            id: 1,
            username: 'testuser',
            address: player_addr,
            fish_count: 0,
            aquarium_count: 0,
            decoration_count: 0,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_count: 0,
            transaction_history: array![],
            experience_points: 0,
            is_verified: false,
            last_action_reset: 0,
            daily_fish_creations: 0,
            daily_decoration_creations: 0,
            daily_aquarium_creations: 0,
        };
        
        // Log an event
        let payload = array![123, 456, 789];
        let transaction_log = transaction_history_contract.log_event(
            event_type_id, player_addr, payload
        );
        
        assert(transaction_log.event_type_id == event_type_id, 'Event type should match');
        assert(transaction_log.player == player_addr, 'Player should match');
        assert(transaction_log.payload.len() == 3, 'Payload length should match');
    }

    #[test]
    fn test_transaction_lifecycle_events() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        let player_addr = contract_address_const::<0x789>();
        let event_type_id = 1;
        let payload = array![123, 456];
        
        // Test transaction initiation
        let txn_id = transaction_contract.initiate_transaction(
            player_addr, event_type_id, payload.clone()
        );
        assert(txn_id > 0, 'Transaction ID should be valid');
        
        // Test transaction processing
        let processed = transaction_contract.process_transaction(txn_id);
        assert(processed, 'Transaction should be processed');
        
        // Test transaction confirmation
        let confirmed = transaction_contract.confirm_transaction(txn_id, 'confirmation_hash');
        assert(confirmed, 'Transaction should be confirmed');
        
        // Verify transaction status
        let status = transaction_contract.get_transaction_status(txn_id);
        assert(status == 'CONFIRMED', 'Transaction should be confirmed');
        
        let is_confirmed = transaction_contract.is_transaction_confirmed(txn_id);
        assert(is_confirmed, 'Transaction should be confirmed');
    }

    #[test]
    fn test_transaction_history_queries() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        // Register event type and log some events
        let event_name = "TestEvent";
        let event_type_id = transaction_history_contract.register_event_type(event_name);
        
        let player_addr = contract_address_const::<0x789>();
        let payload1 = array![123];
        let payload2 = array![456];
        
        transaction_history_contract.log_event(event_type_id, player_addr, payload1);
        transaction_history_contract.log_event(event_type_id, player_addr, payload2);
        
        // Test count queries
        let event_count = transaction_history_contract.get_event_types_count();
        assert(event_count == 1, 'Should have 1 event type');
        
        let txn_count = transaction_history_contract.get_transaction_count();
        assert(txn_count == 2, 'Should have 2 transactions');
        
        // Test history queries
        let history = transaction_history_contract.get_transaction_history(
            Option::Some(player_addr), // player filter
            Option::None, // no event type filter
            Option::None, // no start
            Option::None, // no limit
            Option::None, // no start timestamp
            Option::None  // no end timestamp
        );
        
        assert(history.len() >= 1, 'Should have transaction history');
    }

    #[test]
    fn test_event_types_management() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        // Register multiple event types
        let event1_id = transaction_history_contract.register_event_type("FishCreated");
        let event2_id = transaction_history_contract.register_event_type("FishMoved");
        let event3_id = transaction_history_contract.register_event_type("AquariumCreated");
        
        assert(event1_id != event2_id, 'Event IDs should be unique');
        assert(event2_id != event3_id, 'Event IDs should be unique');
        
        // Get all event types
        let all_events = transaction_history_contract.get_all_event_types();
        assert(all_events.len() == 3, 'Should have 3 event types');
        
        // Get specific event type details
        let event1_details = transaction_history_contract.get_event_type_details(event1_id);
        assert(event1_details.name == "FishCreated", 'Event name should match');
        
        let event2_details = transaction_history_contract.get_event_type_details(event2_id);
        assert(event2_details.name == "FishMoved", 'Event name should match');
    }

    #[test]
    #[should_panic(expected: ('Only owner',))]
    fn test_unauthorized_event_registration() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        // Don't set caller as owner
        set_caller_address(contract_address_const::<0x999>());
        
        transaction_history_contract.register_event_type("UnauthorizedEvent");
    }

    #[test]
    #[should_panic(expected: ('Event name cannot be empty',))]
    fn test_empty_event_name() {
        let (transaction_contract, transaction_history_contract, caller) = setup();
        set_caller_address(contract_address_const::<0x456>()); // Owner address
        
        transaction_history_contract.register_event_type("");
    }
}