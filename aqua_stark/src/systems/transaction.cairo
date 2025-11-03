// dojo decorator
#[dojo::contract]
pub mod Transaction {
    use aqua_stark::base::events::{
        EventTypeRegistered, PlayerEventLogged, TransactionConfirmed, TransactionInitiated,
        TransactionProcessed,
    };
    use aqua_stark::interfaces::ITransactionHistory::ITransactionHistory;
    use aqua_stark::models::player_model::Player;
    use aqua_stark::models::transaction_model::{
        EventCounter, EventDetailsTrait, EventTypeDetails, TransactionCounter, TransactionLog,
        TransactionLogTrait, event_id_target, transaction_id_target,
    };
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo::world::IWorldDispatcherTrait;
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address, get_contract_address};


    #[abi(embed_v0)]
    impl TransactionHistoryImpl of ITransactionHistory<ContractState> {
        fn register_event_type(ref self: ContractState, event_name: ByteArray) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            assert(world.dispatcher.is_owner(0, caller), 'Only owner');
            assert(event_name.len() != 0, 'Event name cannot be empty');

            // Emit TransactionInitiated event
            let temp_txn_id = self.generate_temp_transaction_id(caller, current_time);
            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: temp_txn_id,
                        player: caller,
                        event_type_id: 0, // Not yet known
                        payload_size: event_name.len(),
                        timestamp: current_time,
                    },
                );

            let event_type_id = self.create_event_id();
            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            event_details = EventDetailsTrait::create_event(event_type_id, event_name.clone());
            world.write_model(@event_details);

            // Emit EventTypeRegistered event
            world.emit_event(@EventTypeRegistered { event_type_id, timestamp: current_time });

            // Emit TransactionConfirmed event
            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id: temp_txn_id,
                        player: caller,
                        event_type_id,
                        confirmation_hash: event_type_id.try_into().unwrap(),
                        timestamp: get_block_timestamp(),
                    },
                );

            event_type_id
        }

        fn log_event(
            ref self: ContractState,
            event_type_id: u256,
            player: ContractAddress,
            payload: Array<felt252>,
        ) -> TransactionLog {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            let processing_start = current_time;

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;

            assert(is_owner || is_contract, 'Only owner or contract');

            let txn_id = self.create_transaction_id();

            // Emit TransactionInitiated event
            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: txn_id,
                        player,
                        event_type_id,
                        payload_size: payload.len(),
                        timestamp: current_time,
                    },
                );

            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            event_details.total_logged += 1;
            event_details.transaction_history.append(txn_id);

            let mut transaction_event: TransactionLog = world.read_model(txn_id);
            transaction_event =
                TransactionLogTrait::log_transaction(
                    txn_id, event_type_id, player, payload.clone(),
                );

            let mut player_details: Player = world.read_model(player);
            player_details.transaction_count += 1;
            player_details.transaction_history.append(txn_id);

            world.write_model(@event_details);
            world.write_model(@transaction_event);
            world.write_model(@player_details);

            let processing_end = get_block_timestamp();

            // Emit TransactionProcessed event
            world
                .emit_event(
                    @TransactionProcessed {
                        transaction_id: txn_id,
                        player,
                        event_type_id,
                        processing_time: processing_end - processing_start,
                        timestamp: processing_end,
                    },
                );

            // Generate payload hash for logging
            let mut payload_hash: felt252 = 0;
            for item in payload.span() {
                payload_hash = payload_hash + *item;
            };

            world
                .emit_event(
                    @PlayerEventLogged {
                        id: txn_id, event_type_id, player, timestamp: processing_end,
                    },
                );

            // Emit TransactionConfirmed event
            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id: txn_id,
                        player,
                        event_type_id,
                        confirmation_hash: payload_hash,
                        timestamp: get_block_timestamp(),
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

            let mut i: u256 = start_index.into() + 1;
            let mut count = 0;

            let mut transaction_history: Array<TransactionLog> = array![];

            while i <= total_transactions && count < lim {
                let txn_log: TransactionLog = world.read_model(i);

                if txn_log.timestamp >= s_timestamp && txn_log.timestamp <= e_timestamp {
                    transaction_history.append(txn_log);
                }
                count += 1;
                i += 1;
            };

            transaction_history.span()
        }

        // Transaction lifecycle functions (additional to ITransactionHistory)
        fn initiate_transaction(
            ref self: ContractState,
            player: ContractAddress,
            event_type_id: u256,
            payload: Array<felt252>,
        ) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Only owner or contract');

            let txn_id = self.create_transaction_id();

            // Emit TransactionInitiated event
            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: txn_id,
                        player,
                        event_type_id,
                        payload_size: payload.len(),
                        timestamp: current_time,
                    },
                );

            txn_id
        }

        fn process_transaction(ref self: ContractState, transaction_id: u256) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Only owner or contract');

            // In a full implementation, this would contain transaction processing logic
            // For now, we just emit the processing event
            world
                .emit_event(
                    @TransactionProcessed {
                        transaction_id,
                        player: caller,
                        event_type_id: 0, // Would be retrieved from transaction data
                        processing_time: 1, // Mock processing time
                        timestamp: current_time,
                    },
                );

            true
        }

        fn confirm_transaction(
            ref self: ContractState, transaction_id: u256, confirmation_hash: felt252,
        ) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Only owner or contract');

            // Emit TransactionConfirmed event
            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id,
                        player: caller,
                        event_type_id: 0, // Would be retrieved from transaction data
                        confirmation_hash,
                        timestamp: current_time,
                    },
                );

            true
        }

        fn get_transaction_status(self: @ContractState, transaction_id: u256) -> felt252 {
            // Mock implementation - in a real system, this would check transaction state
            'CONFIRMED'
        }

        fn is_transaction_confirmed(self: @ContractState, transaction_id: u256) -> bool {
            // Mock implementation - in a real system, this would check if transaction is confirmed
            true
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
            // Start from 1 if counter is uninitialized (current_val == 0)
            let new_id = if event_counter.current_val == 0 {
                1
            } else {
                event_counter.current_val + 1
            };
            event_counter.target = event_id_target();
            event_counter.current_val = new_id;
            world.write_model(@event_counter);
            new_id
        }

        fn create_transaction_id(self: @ContractState) -> u256 {
            let mut world = self.world_default();
            let mut txn_counter: TransactionCounter = world.read_model(transaction_id_target());
            // Start from 1 if counter is uninitialized (current_val == 0)
            let new_id = if txn_counter.current_val == 0 {
                1
            } else {
                txn_counter.current_val + 1
            };
            txn_counter.target = transaction_id_target();
            txn_counter.current_val = new_id;
            world.write_model(@txn_counter);
            new_id
        }

        fn generate_temp_transaction_id(
            self: @ContractState, player: ContractAddress, timestamp: u64,
        ) -> u256 {
            // Generate a temporary transaction ID for tracking purposes
            let player_felt: felt252 = player.into();
            let timestamp_felt: felt252 = timestamp.into();
            let temp_id: felt252 = player_felt + timestamp_felt + 999999;
            temp_id.into()
        }
    }
}
