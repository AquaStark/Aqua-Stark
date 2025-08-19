#[dojo::contract]
pub mod Transaction {
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use aqua_stark::interfaces::ITransactionHistory::ITransactionHistory;
    use aqua_stark::base::events::{
        EventTypeRegistered, PlayerEventLogged, TransactionInitiated, TransactionProcessed,
        TransactionConfirmed, TransactionFailed, TransactionReverted,
    };
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp,
    };
    use aqua_stark::models::transaction_model::{
        EventCounter, EventDetailsTrait, EventTypeDetails, TransactionCounter, TransactionLog,
        TransactionLogTrait, event_id_target, transaction_id_target,
    };
    use aqua_stark::models::player_model::Player;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;

    #[abi(embed_v0)]
    impl TransactionHistoryImpl of ITransactionHistory<ContractState> {
        fn register_event_type(ref self: ContractState, event_name: ByteArray) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            assert(world.dispatcher.is_owner(0, caller), 'Only owner');
            assert(event_name.len() != 0, 'Event name cannot be empty');

            let event_type_id = self.create_event_id();
            let mut event_details: EventTypeDetails = world.read_model(event_type_id);
            event_details = EventDetailsTrait::create_event(event_type_id, event_name);
            world.write_model(@event_details);

            // Emit Transaction Initiated Event
            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: event_type_id,
                        transaction_type: 'event_registration',
                        initiator: caller,
                        timestamp: get_block_timestamp(),
                    },
                );

            // Emit Event Type Registered Event
            world
                .emit_event(
                    @EventTypeRegistered {
                        event_type_id, timestamp: get_block_timestamp(),
                    },
                );

            // Emit Transaction Confirmed Event
            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id: event_type_id,
                        transaction_type: 'event_registration',
                        result_data: array!['success', event_type_id.low.into(), event_type_id.high.into()],
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
            let txn_id = self.create_transaction_id();
            let caller = get_caller_address();

            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;

            assert(is_owner || is_contract, 'Only owner or contract');

            // Emit Transaction Initiated Event
            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: txn_id,
                        transaction_type: 'event_logging',
                        initiator: caller,
                        timestamp: get_block_timestamp(),
                    },
                );

            let mut event_details: EventTypeDetails = world.read_model(event_type_id);

            // Emit Transaction Processing Event
            world
                .emit_event(
                    @TransactionProcessed {
                        transaction_id: txn_id,
                        transaction_type: 'event_logging',
                        processing_data: array!['updating_counters', event_details.total_logged.into()],
                        timestamp: get_block_timestamp(),
                    },
                );

            event_details.total_logged += 1;
            event_details.transaction_history.append(txn_id);

            let mut transaction_event: TransactionLog = world.read_model(txn_id);
            transaction_event =
                TransactionLogTrait::log_transaction(txn_id, event_type_id, player, payload);

            let mut player_details: Player = world.read_model(player);
            player_details.transaction_count += 1;
            player_details.transaction_history.append(txn_id);

            world.write_model(@event_details);
            world.write_model(@transaction_event);
            world.write_model(@player_details);

            // Emit Player Event Logged Event
            world
                .emit_event(
                    @PlayerEventLogged {
                        id: txn_id, event_type_id, player, timestamp: get_block_timestamp(),
                    },
                );

            // Emit Transaction Confirmed Event
            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id: txn_id,
                        transaction_type: 'event_logging',
                        result_data: array!['logged', txn_id.low.into(), txn_id.high.into()],
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
    }

    // Additional transaction management functions
    #[abi(embed_v0)]
    impl TransactionManagementImpl of TransactionManagement<ContractState> {
        fn initiate_transaction(
            ref self: ContractState,
            transaction_type: felt252,
            initiator: ContractAddress,
        ) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Only allow contracts or owners to initiate transactions
            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Unauthorized transaction init');

            let txn_id = self.create_transaction_id();

            world
                .emit_event(
                    @TransactionInitiated {
                        transaction_id: txn_id,
                        transaction_type,
                        initiator,
                        timestamp: get_block_timestamp(),
                    },
                );

            txn_id
        }

        fn process_transaction(
            ref self: ContractState,
            transaction_id: u256,
            transaction_type: felt252,
            processing_data: Array<felt252>,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Only allow contracts or owners to process transactions
            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Unauthorized transaction proc');

            world
                .emit_event(
                    @TransactionProcessed {
                        transaction_id,
                        transaction_type,
                        processing_data,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn confirm_transaction(
            ref self: ContractState,
            transaction_id: u256,
            transaction_type: felt252,
            result_data: Array<felt252>,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Only allow contracts or owners to confirm transactions
            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Unauthorized transaction conf');

            world
                .emit_event(
                    @TransactionConfirmed {
                        transaction_id,
                        transaction_type,
                        result_data,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn fail_transaction(
            ref self: ContractState,
            transaction_id: u256,
            transaction_type: felt252,
            error_code: felt252,
            error_message: ByteArray,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Only allow contracts or owners to fail transactions
            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Unauthorized transaction fail');

            world
                .emit_event(
                    @TransactionFailed {
                        transaction_id,
                        transaction_type,
                        error_code,
                        error_message,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn revert_transaction(
            ref self: ContractState,
            transaction_id: u256,
            transaction_type: felt252,
            reason: ByteArray,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            
            // Only allow contracts or owners to revert transactions
            let is_owner = world.dispatcher.is_owner(0, caller);
            let is_contract = get_contract_address() == caller;
            assert(is_owner || is_contract, 'Unauthorized transaction rev');

            world
                .emit_event(
                    @TransactionReverted {
                        transaction_id,
                        transaction_type,
                        reason,
                        timestamp: get_block_timestamp(),
                    },
                );
        }
    }

    #[starknet::interface]
    trait TransactionManagement<TContractState> {
        fn initiate_transaction(
            ref self: TContractState,
            transaction_type: felt252,
            initiator: ContractAddress,
        ) -> u256;
        fn process_transaction(
            ref self: TContractState,
            transaction_id: u256,
            transaction_type: felt252,
            processing_data: Array<felt252>,
        );
        fn confirm_transaction(
            ref self: TContractState,
            transaction_id: u256,
            transaction_type: felt252,
            result_data: Array<felt252>,
        );
        fn fail_transaction(
            ref self: TContractState,
            transaction_id: u256,
            transaction_type: felt252,
            error_code: felt252,
            error_message: ByteArray,
        );
        fn revert_transaction(
            ref self: TContractState,
            transaction_id: u256,
            transaction_type: felt252,
            reason: ByteArray,
        );
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