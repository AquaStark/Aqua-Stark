#[cfg(test)]
mod tests {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
    use dojo::event::EventStorage;
    use starknet::{ContractAddress, contract_address_const, get_block_timestamp};
    use dojo_cairo_test::{spawn_test_world, NamespaceDef, TestResource, ContractDef};

    use aqua_stark::systems::transaction::{Transaction, ITransactionDispatcher, ITransactionDispatcherTrait};
    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter, event_id_target, transaction_id_target
    };
    use aqua_stark::models::player_model::Player;
    use aqua_stark::base::events::{
        TransactionInitiated, TransactionProcessed, TransactionConfirmed, TransactionFailed, TransactionReverted,
        EventTypeRegistered, PlayerEventLogged
    };

    fn zero_address() -> ContractAddress {
        contract_address_const::<0x0>()
    }

    fn owner_address() -> ContractAddress {
        contract_address_const::<0x1234>()
    }

    fn player_address() -> ContractAddress {
        contract_address_const::<0x5678>()
    }

    fn setup_world() -> (IWorldDispatcher, ITransactionDispatcher) {
        let namespace_def = NamespaceDef {
            namespace: "aqua_stark", resources: [
                TestResource::Model(TransactionLog::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Model(EventTypeDetails::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Model(EventCounter::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Model(TransactionCounter::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Model(Player::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(TransactionInitiated::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(TransactionProcessed::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(TransactionConfirmed::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(TransactionFailed::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(TransactionReverted::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(EventTypeRegistered::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Event(PlayerEventLogged::TEST_CLASS_HASH.try_into().unwrap()),
                TestResource::Contract(ContractDef {
                    class_hash: Transaction::TEST_CLASS_HASH.try_into().unwrap(),
                    address: Option::None,
                }),
            ].span()
        };

        let mut world = spawn_test_world([namespace_def].span());

        world.sync_perms_and_inits([].span());

        let (transaction_address, _) = world.dns(@"transaction").unwrap();
        let transaction_system = ITransactionDispatcher { contract_address: transaction_address };

        (world, transaction_system)
    }

    #[test]
    fn test_register_event_type() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        let event_name = "TestEvent";
        let event_type_id = transaction_system.register_event_type(event_name);

        assert(event_type_id == 1, 'Event type ID should be 1');

        let event_details: EventTypeDetails = world.read_model(event_type_id);
        assert(event_details.name == event_name, 'Event name should match');
        assert(event_details.total_logged == 0, 'Total logged should be 0');

        let event_counter: EventCounter = world.read_model(event_id_target());
        assert(event_counter.current_val == 1, 'Event counter should be 1');
    }

    #[test] 
    fn test_log_event() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        // First register an event type
        let event_name = "TestEvent";
        let event_type_id = transaction_system.register_event_type(event_name);

        // Create a player to log events for
        let player = Player {
            wallet: player_address(),
            username: 'test_player',
            player_id: 1,
            aquarium_count: 0,
            fish_count: 0,
            decoration_count: 0,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_count: 0,
            transaction_history: array![],
            is_verified: false,
        };
        world.write_model(@player);

        // Log an event
        let payload = array!['test', 'data'];
        let transaction_log = transaction_system.log_event(event_type_id, player_address(), payload);

        assert(transaction_log.id == 1, 'Transaction ID should be 1');
        assert(transaction_log.event_type_id == event_type_id, 'Event type ID should match');
        assert(transaction_log.player == player_address(), 'Player should match');

        // Check updated counters
        let event_details: EventTypeDetails = world.read_model(event_type_id);
        assert(event_details.total_logged == 1, 'Total logged should be 1');

        let updated_player: Player = world.read_model(player_address());
        assert(updated_player.transaction_count == 1, 'Player transaction count should be 1');
    }

    #[test]
    fn test_transaction_lifecycle() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        let transaction_type = 'test_transaction';
        let initiator = player_address();

        // Initiate transaction
        let txn_id = transaction_system.initiate_transaction(transaction_type, initiator);
        assert(txn_id == 1, 'Transaction ID should be 1');

        // Process transaction
        let processing_data = array!['processing', 'step1'];
        transaction_system.process_transaction(txn_id, transaction_type, processing_data);

        // Confirm transaction
        let result_data = array!['success', 'completed'];
        transaction_system.confirm_transaction(txn_id, transaction_type, result_data);

        // Check transaction counter
        let txn_counter: TransactionCounter = world.read_model(transaction_id_target());
        assert(txn_counter.current_val == 1, 'Transaction counter should be 1');
    }

    #[test] 
    fn test_transaction_failure() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        let transaction_type = 'failing_transaction';
        let initiator = player_address();

        // Initiate transaction
        let txn_id = transaction_system.initiate_transaction(transaction_type, initiator);

        // Fail transaction
        let error_code = 'INVALID_INPUT';
        let error_message = "Invalid input provided";
        transaction_system.fail_transaction(txn_id, transaction_type, error_code, error_message);

        // Check transaction counter still incremented
        let txn_counter: TransactionCounter = world.read_model(transaction_id_target());
        assert(txn_counter.current_val == 1, 'Transaction counter should be 1');
    }

    #[test]
    fn test_transaction_revert() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        let transaction_type = 'revertible_transaction';
        let initiator = player_address();

        // Initiate transaction
        let txn_id = transaction_system.initiate_transaction(transaction_type, initiator);

        // Revert transaction
        let reason = "User requested cancellation";
        transaction_system.revert_transaction(txn_id, transaction_type, reason);

        // Check transaction counter still incremented
        let txn_counter: TransactionCounter = world.read_model(transaction_id_target());
        assert(txn_counter.current_val == 1, 'Transaction counter should be 1');
    }

    #[test]
    fn test_get_transaction_history() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        // Register event type
        let event_name = "TestEvent";
        let event_type_id = transaction_system.register_event_type(event_name);

        // Create player
        let player = Player {
            wallet: player_address(),
            username: 'test_player',
            player_id: 1,
            aquarium_count: 0,
            fish_count: 0,
            decoration_count: 0,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_count: 0,
            transaction_history: array![],
            is_verified: false,
        };
        world.write_model(@player);

        // Log multiple events
        transaction_system.log_event(event_type_id, player_address(), array!['event1']);
        transaction_system.log_event(event_type_id, player_address(), array!['event2']);

        // Get transaction history
        let history = transaction_system.get_transaction_history(
            Option::Some(player_address()),
            Option::None,
            Option::None,
            Option::None,
            Option::None,
            Option::None
        );

        assert(history.len() == 2, 'Should have 2 transactions');
    }

    #[test]
    fn test_get_event_types_count() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        // Initially should be 0
        let initial_count = transaction_system.get_event_types_count();
        assert(initial_count == 0, 'Initial count should be 0');

        // Register some event types
        transaction_system.register_event_type("Event1");
        transaction_system.register_event_type("Event2");

        let count = transaction_system.get_event_types_count();
        assert(count == 2, 'Count should be 2');
    }

    #[test]
    fn test_get_all_event_types() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        // Register event types
        let event1_id = transaction_system.register_event_type("Event1");
        let event2_id = transaction_system.register_event_type("Event2");

        let all_events = transaction_system.get_all_event_types();
        assert(all_events.len() == 2, 'Should have 2 event types');

        let event1_details = *all_events.at(0);
        let event2_details = *all_events.at(1);
        assert(event1_details.name == "Event1", 'First event name should match');
        assert(event2_details.name == "Event2", 'Second event name should match');
    }

    #[test]
    #[should_panic(expected: ('Only owner',))]
    fn test_unauthorized_event_registration() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Don't set up owner permissions - should fail
        transaction_system.register_event_type("UnauthorizedEvent");
    }

    #[test]
    #[should_panic(expected: ('Event name cannot be empty',))]
    fn test_empty_event_name() {
        let (mut world, mut transaction_system) = setup_world();
        
        // Set up owner permissions
        world.dispatcher.grant_owner(world.executor(), zero_address());

        // Try to register with empty name
        transaction_system.register_event_type("");
    }
}