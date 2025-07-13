#[dojo::contract]
pub mod TransactionHistory {
    use dojo::world::IWorldDispatcherTrait;
    use aqua_stark::interfaces::ITransactionHistory::ITransactionHistory;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter, event_id_target,
        transaction_id_target, EventDetailsTrait, TransactionLogTrait,
    };
    use aqua_stark::models::player_model::Player;
    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct PlayerEventLogged {
        #[key]
        pub id: u256,
        #[key]
        pub event_type_id: u256,
        pub player: ContractAddress,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct EventTypeRegistered {
        #[key]
        pub event_type_id: u256,
        pub event_logger: ContractAddress,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct EventLoggerUpdated {
        #[key]
        pub event_type_id: u256,
        pub event_logger: ContractAddress,
        pub timestamp: u64,
    }

    #[abi(embed_v0)]
    impl TransactionHistoryImpl of ITransactionHistory<ContractState> {
        fn register_event_type(
            ref self: ContractState, event_name: ByteArray, event_logger: ContractAddress,
        ) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            assert(world.dispatcher.is_owner(0, caller), 'Only owner');

            // assert that caller is dojo creator
            let event_type_id = self.create_event_id();
            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            event_details =
                EventDetailsTrait::create_event(event_type_id, event_name, event_logger);

            // --- Emit Event ---
            world
                .emit_event(
                    @EventTypeRegistered {
                        event_type_id: event_type_id.clone(),
                        event_logger: event_logger,
                        timestamp: get_block_timestamp(),
                    },
                );

            event_type_id
        }

        fn update_event_logger(
            ref self: ContractState, event_type_id: u256, new_event_logger: ContractAddress,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // assert that caller is dojo creator
            assert(world.dispatcher.is_owner(0, caller), 'Only owner');

            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            assert(event_details.type_id == event_type_id, 'Invalid event type id');
            assert(event_details.logger != new_event_logger, 'Logger should be different');

            event_details =
                EventDetailsTrait::update_logger(event_details.clone(), new_event_logger);
            world.write_model(@event_details);

            world
                .emit_event(
                    @EventLoggerUpdated {
                        event_type_id: event_type_id.clone(),
                        event_logger: new_event_logger,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn log_event(
            ref self: ContractState,
            event_type_id: u256,
            player: ContractAddress,
            description: ByteArray,
        ) -> TransactionLog {
            let mut world = self.world_default();
            let txn_id = self.create_transaction_id();

            let caller = get_caller_address();
            let mut event_details: EventTypeDetails = world.read_model(event_type_id);

            assert(event_details.logger == caller, 'Only event logger can log event');

            event_details.total_logged += 1;
            event_details.transaction_history.append(txn_id);

            let mut transaction_event: TransactionLog = world.read_model(txn_id);
            transaction_event =
                TransactionLogTrait::log_transaction(txn_id, event_type_id, player, description);

            let mut player_details: Player = world.read_model(player);
            player_details.transaction_count += 1;
            player_details.transaction_history.append(txn_id);

            world.write_model(@event_details);
            world.write_model(@transaction_event);
            world.write_model(@player_details);

            world
                .emit_event(
                    @PlayerEventLogged {
                        id: txn_id, event_type_id, player, timestamp: get_block_timestamp(),
                    },
                );

            transaction_event
        }

        fn get_event_types_count(self: @ContractState) -> u256 {
            let world = self.world_default();
            let event_counter: EventCounter = world.read_model(event_id_target());
            event_counter.current_val
        }

        fn get_event_type_details(self: @ContractState, event_type_id: u256) -> EventTypeDetails {
            let world = self.world_default();
            world.read_model(event_type_id)
        }

        fn get_all_event_types(self: @ContractState) -> Span<EventTypeDetails> {
            let world = self.world_default();
            let event_counter: EventCounter = world.read_model(event_id_target());
            let event_count = event_counter.current_val;
            let mut all_events: Array<EventTypeDetails> = array![];

            for i in 0..event_count {
                let event_details: EventTypeDetails = world.read_model(i);
                all_events.append(event_details);
            };

            all_events.span()
        }

        fn get_transaction_count(self: @ContractState) -> u256 {
            let world = self.world_default();
            let txn_counter: TransactionCounter = world.read_model(transaction_id_target());
            txn_counter.current_val
        }

        fn get_transaction_history(
            self: @ContractState,
            player: Option<ContractAddress>,
            event_type_id: Option<u256>,
            start: Option<u32>,
            limit: Option<u32>,
            start_timestamp: Option<u64>,
            end_timestamp: Option<u64>,
        ) -> Span<TransactionLog> {
            let world = self.world_default();
            let start_index = start.unwrap_or_default();
            let lim = limit.unwrap_or(50);
            let s_timestamp = start_timestamp.unwrap_or_default();
            let e_timestamp = end_timestamp.unwrap_or(get_block_timestamp());

            if let Option::Some(player_addr) = player {
                let player_data: Player = world.read_model(player_addr);

                let mut i = start_index;
                let mut count = 0;
                let mut player_history: Array<TransactionLog> = array![];

                while i < player_data.transaction_count && count < lim {
                    let txn_event_id = player_data.transaction_history.at(i);

                    if let Option::Some(event_id) = event_type_id {
                        if @event_id != txn_event_id {
                            i += 1;
                            continue;
                        }
                    }

                    let txn_log: TransactionLog = world.read_model(*txn_event_id);

                    if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                        player_history.append(txn_log);
                    }
                    count += 1;
                    i += 1;
                };

                return player_history.span();
            }

            if let Option::Some(event_id) = event_type_id {
                let event_details: EventTypeDetails = world.read_model(event_id);

                let mut i = start_index;
                let mut count = 0;
                let mut event_history: Array<TransactionLog> = array![];

                while i < event_details.total_logged && count < lim {
                    let txn_event_id = event_details.transaction_history.at(i);

                    let txn_log: TransactionLog = world.read_model(*txn_event_id);

                    if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                        event_history.append(txn_log);
                    }
                    count += 1;
                    i += 1;
                };

                return event_history.span();
            }

            let total_transactions = self.get_transaction_count();

            let mut i = start_index;
            let mut count = 0;

            let mut transaction_history: Array<TransactionLog> = array![];

            while i.into() < total_transactions && count < lim {
                let txn_log: TransactionLog = world.read_model(i);

                if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                    transaction_history.append(txn_log);
                }
                count += 1;
                i += 1;
            };

            transaction_history.span()
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_event_id(self: @ContractState) -> u256 {
            let mut world = self.world_default();
            let mut event_counter: EventCounter = world.read_model(event_id_target());
            let new_id = event_counter.current_val + 1;
            event_counter.current_val = new_id;
            world.write_model(@event_counter);
            new_id
        }

        fn create_transaction_id(self: @ContractState) -> u256 {
            let mut world = self.world_default();
            let mut txn_counter: TransactionCounter = world.read_model(transaction_id_target());
            let new_id = txn_counter.current_val + 1;
            txn_counter.current_val = new_id;
            world.write_model(@txn_counter);
            new_id
        }
    }
}
