// dojo decorator
#[dojo::contract]
pub mod AquaStark {
    use aqua_stark::base::events::{AquariumCreated, DecorationCreated, PlayerCreated};
    use aqua_stark::helpers::session_validation::{
        AUTO_RENEWAL_THRESHOLD, MAX_TRANSACTIONS_PER_SESSION, MIN_SESSION_DURATION,
        SessionValidationImpl,
    };
    use aqua_stark::interfaces::IAquaStark::IAquaStark;
    use aqua_stark::interfaces::ITransactionHistory::{
        ITransactionHistory, ITransactionHistoryDispatcher, ITransactionHistoryDispatcherTrait,
    };
    use aqua_stark::models::aquarium_model::{
        Aquarium, AquariumCounter, AquariumOwner, AquariumTrait,
    };
    use aqua_stark::models::decoration_model::{Decoration, DecorationCounter, DecorationTrait};
    use aqua_stark::models::fish_model::{FishCounter, FishOwner};
    use aqua_stark::models::player_model::{
        AddressToUsername, Player, PlayerCounter, PlayerTrait, UsernameToAddress,
    };
    use aqua_stark::models::session::{
        PERMISSION_ADMIN, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE,
        SESSION_STATUS_ACTIVE, SESSION_TYPE_PREMIUM, SessionAnalytics, SessionKey,
    };
    use aqua_stark::models::transaction_model::{EventTypeDetails, TransactionLog};
    use core::traits::Into;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::{
        ContractAddress, contract_address_const, get_block_timestamp, get_caller_address,
    };


    #[abi(embed_v0)]
    impl AquaStarkImpl of IAquaStark<ContractState> {
        fn get_fish_owner_for_auction(self: @ContractState, fish_id: u256) -> FishOwner {
            self.world_default().read_model(fish_id)
        }

        fn get_username_from_address(self: @ContractState, address: ContractAddress) -> felt252 {
            let mut world = self.world_default();

            let address_map: AddressToUsername = world.read_model(address);

            address_map.username
        }

        fn new_aquarium(
            ref self: ContractState,
            owner: ContractAddress,
            max_capacity: u32,
            max_decorations: u32,
        ) -> Aquarium {
            // Get or create unified session
            let session_id = self.get_or_create_session(owner);
            self.validate_and_update_session(session_id, PERMISSION_MOVE);

            // Delegate to aquarium contract
            let mut world = self.world_default();
            let caller = get_caller_address();
            let aquarium_id = self.create_aquarium_id();
            let mut aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium =
                AquariumTrait::create_aquarium(aquarium_id, owner, max_capacity, max_decorations);

            let mut aquarium_owner: AquariumOwner = world.read_model(aquarium_id);
            aquarium_owner.owner = caller;

            let mut player: Player = world.read_model(caller);
            player.aquarium_count += 1;
            player.player_aquariums.append(aquarium.id);

            self.check_and_reset_daily_limits(caller);
            assert(player.daily_aquarium_creations < 2, 'Daily aquarium limit reached');

            player.daily_aquarium_creations += 1;
            player.experience_points += 5; // 5 XP for aquarium creation

            world.write_model(@player);

            world.write_model(@aquarium_owner);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @AquariumCreated {
                        aquarium_id,
                        owner,
                        max_capacity,
                        max_decorations,
                        timestamp: get_block_timestamp(),
                    },
                );

            aquarium
        }

        // Fish addition to aquarium moved to game.cairo system

        // Decoration addition to aquarium moved to game.cairo system

        fn new_decoration(
            ref self: ContractState,
            aquarium_id: u256,
            name: felt252,
            description: felt252,
            price: u256,
            rarity: felt252,
        ) -> Decoration {
            let mut world = self.world_default();
            let mut aquarium = self.get_aquarium(aquarium_id);
            assert(aquarium.owner == get_caller_address(), 'You do not own this aquarium');
            let id = self.create_decoration_id();

            let mut decoration = world.read_model(id);

            decoration =
                DecorationTrait::decoration(
                    decoration, id, aquarium_id, name, description, price, rarity,
                );

            let mut player: Player = world.read_model(get_caller_address());
            player.decoration_count += 1;
            player.player_decorations.append(decoration.id);
            aquarium = AquariumTrait::add_decoration(aquarium.clone(), decoration.id);

            self.check_and_reset_daily_limits(get_caller_address());

            if player.daily_decoration_creations < 5 {
                let experience = match rarity {
                    0 => 3, // Common
                    1 => 5, // Rare
                    2 => 10, // Legendary
                    _ => 3 // Default to common
                };
                player.experience_points += experience;
                player.daily_decoration_creations += 1;
            }

            world.write_model(@aquarium);
            world.write_model(@player);
            world.write_model(@decoration);

            world
                .emit_event(
                    @DecorationCreated {
                        id,
                        aquarium_id,
                        owner: get_caller_address(),
                        name,
                        rarity,
                        price,
                        timestamp: get_block_timestamp(),
                    },
                );

            decoration
        }

        // Game-related functions moved to game.cairo system
        // Use game contract for fish creation, breeding, movement, and marketplace operations

        // Fish movement moved to game.cairo system

        // Decoration movement moved to game.cairo system

        // Fish breeding moved to game.cairo system

        fn register(ref self: ContractState, username: felt252) {
            let mut world = self.world_default();
            let player = get_caller_address();

            // Constants
            let zero_address: ContractAddress = contract_address_const::<0x0>();

            // --- Validations ---

            // Username should not be zero
            assert(username != 0, 'USERNAME CANNOT BE ZERO');

            // Username must be unique (not already registered)
            let existing_player: UsernameToAddress = world.read_model(username);
            assert(existing_player.address == zero_address, 'USERNAME ALREADY TAKEN');

            // Address must not already be registered
            let existing_username = self.get_username_from_address(player);
            assert(existing_username == 0, 'USERNAME ALREADY CREATED');

            // --- Create initial session for new player ---
            let _session_id = self.get_or_create_session(player);

            // --- Player Registration ---

            let id = self.create_new_player_id();

            let mut new_player = PlayerTrait::register_player(id, username, player, 0, 0);

            // --- Username ↔ Address Mappings ---

            let username_to_address = UsernameToAddress { username, address: player };
            let address_to_username = AddressToUsername { address: player, username };

            // --- Aquarium Setup ---

            let mut aquarium = self.new_aquarium(player, 10, 5);

            new_player.aquarium_count += 1;
            let aquarium_id = aquarium.id;
            new_player.player_aquariums.append(aquarium.id);

            // Create initial fish
            let fish_id = 0_u256;
            new_player.fish_count += 1;
            new_player.player_fishes.append(fish_id);

            let decoration = self.new_decoration(aquarium.id, 'Pebbles', 'Shiny rocks', 0, 0);
            new_player.decoration_count += 1;
            new_player.player_decorations.append(decoration.id);
            let decoration_id = decoration.id;

            // Fish addition moved to game contract
            // aquarium.fish_count += 1;
            // aquarium.housed_fish.append(fish.id);
            aquarium.housed_decorations.append(decoration.id);
            aquarium.decoration_count += 1;

            new_player.experience_points += 5; // 5 XP for registration

            // --- Persist to Storage ---
            world.write_model(@aquarium);
            world.write_model(@new_player);
            world.write_model(@username_to_address);
            world.write_model(@address_to_username);

            // --- Emit Event ---
            world
                .emit_event(
                    @PlayerCreated {
                        username,
                        player,
                        player_id: id,
                        aquarium_id,
                        decoration_id,
                        fish_id: 0_u256,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn is_verified(self: @ContractState, player: ContractAddress) -> bool {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.is_verified
        }


        fn get_player(self: @ContractState, address: ContractAddress) -> Player {
            let mut world = self.world_default();
            let player: Player = world.read_model(address);
            player
        }
        // Fish retrieval moved to game.cairo system
        fn get_aquarium(self: @ContractState, id: u256) -> Aquarium {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(id);
            aquarium
        }
        fn get_decoration(self: @ContractState, id: u256) -> Decoration {
            let mut world = self.world_default();
            let decoration: Decoration = world.read_model(id);
            decoration
        }
        // Player fishes retrieval moved to game.cairo system
        fn get_player_aquariums(self: @ContractState, player: ContractAddress) -> Array<Aquarium> {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            let mut aquariums: Array<Aquarium> = array![];
            for aquarium_id in player_model.player_aquariums {
                let aquarium: Aquarium = world.read_model(aquarium_id);
                aquariums.append(aquarium);
            };
            aquariums
        }
        fn get_player_decorations(
            self: @ContractState, player: ContractAddress,
        ) -> Array<Decoration> {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            let mut decorations: Array<Decoration> = array![];
            for decoration_id in player_model.player_decorations {
                let decoration: Decoration = world.read_model(decoration_id);
                decorations.append(decoration);
            };
            decorations
        }
        // Player fish count moved to game.cairo system
        fn get_player_aquarium_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.aquarium_count
        }
        fn get_player_decoration_count(self: @ContractState, player: ContractAddress) -> u32 {
            let mut world = self.world_default();
            let player_model: Player = world.read_model(player);
            player_model.decoration_count
        }

        // Fish parents retrieval moved to game.cairo system

        // Fish offspring retrieval moved to game.cairo system

        // Fish owner retrieval moved to game.cairo system

        fn get_aquarium_owner(self: @ContractState, id: u256) -> ContractAddress {
            let aquarium = self.get_aquarium(id);
            aquarium.owner
        }

        fn get_decoration_owner(self: @ContractState, id: u256) -> ContractAddress {
            let decoration = self.get_decoration(id);
            decoration.owner
        }
    }

    #[abi(embed_v0)]
    impl TransactionHistoryImpl of ITransactionHistory<ContractState> {
        fn register_event_type(ref self: ContractState, event_name: ByteArray) -> u256 {
            // Get the transaction contract address
            let transaction_contract = self.get_transaction_contract();
            // Delegate to transaction contract
            transaction_contract.register_event_type(event_name)
        }

        fn log_event(
            ref self: ContractState,
            event_type_id: u256,
            player: ContractAddress,
            payload: Array<felt252>,
        ) -> TransactionLog {
            // Get the transaction contract address
            let transaction_contract = self.get_transaction_contract();
            // Delegate to transaction contract
            transaction_contract.log_event(event_type_id, player, payload)
        }

        fn get_event_types_count(self: @ContractState) -> u256 {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.get_event_types_count()
        }

        fn get_event_type_details(self: @ContractState, event_type_id: u256) -> EventTypeDetails {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.get_event_type_details(event_type_id)
        }

        fn get_all_event_types(self: @ContractState) -> Span<EventTypeDetails> {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.get_all_event_types()
        }

        fn get_transaction_count(self: @ContractState) -> u256 {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.get_transaction_count()
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
            let transaction_contract = self.get_transaction_contract();
            transaction_contract
                .get_transaction_history(
                    player, event_type_id, start, limit, start_timestamp, end_timestamp,
                )
        }

        fn initiate_transaction(
            ref self: ContractState,
            player: ContractAddress,
            event_type_id: u256,
            payload: Array<felt252>,
        ) -> u256 {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.initiate_transaction(player, event_type_id, payload)
        }

        fn process_transaction(ref self: ContractState, transaction_id: u256) -> bool {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.process_transaction(transaction_id)
        }

        fn confirm_transaction(
            ref self: ContractState, transaction_id: u256, confirmation_hash: felt252,
        ) -> bool {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.confirm_transaction(transaction_id, confirmation_hash)
        }

        fn get_transaction_status(self: @ContractState, transaction_id: u256) -> felt252 {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.get_transaction_status(transaction_id)
        }

        fn is_transaction_confirmed(self: @ContractState, transaction_id: u256) -> bool {
            let transaction_contract = self.get_transaction_contract();
            transaction_contract.is_transaction_confirmed(transaction_id)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_new_player_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut game_counter: PlayerCounter = world.read_model('v0');
            let new_val = game_counter.current_val + 1;
            game_counter.current_val = new_val;
            world.write_model(@game_counter);
            new_val
        }

        fn create_decoration_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut decoration_counter: DecorationCounter = world.read_model('v0');
            let new_val = decoration_counter.current_val + 1;
            decoration_counter.current_val = new_val;
            world.write_model(@decoration_counter);
            new_val
        }

        fn create_aquarium_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut aquarium_counter: AquariumCounter = world.read_model('v0');
            let new_val = aquarium_counter.current_val + 1;
            aquarium_counter.current_val = new_val;
            world.write_model(@aquarium_counter);
            new_val
        }

        fn create_fish_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut fish_counter: FishCounter = world.read_model('v0');
            let new_val = fish_counter.current_val + 1;
            fish_counter.current_val = new_val;
            world.write_model(@fish_counter);
            new_val
        }

        fn get_transaction_contract(self: @ContractState) -> ITransactionHistoryDispatcher {
            let transaction_contract_address = starknet::contract_address_const::<0x123>();
            ITransactionHistoryDispatcher { contract_address: transaction_contract_address }
        }

        // Session management functions
        fn get_or_create_session(ref self: ContractState, player: ContractAddress) -> felt252 {
            let mut world = self.world_default();
            let current_time = get_block_timestamp();

            // Try to find existing active session
            let session_id = self.generate_session_id(player, current_time);

            // Try to read existing session
            let existing_session: SessionKey = world.read_model((session_id, player));

            // If session doesn't exist or is invalid, create new one
            if existing_session.session_id == 0
                || !existing_session.is_valid
                || existing_session.status != SESSION_STATUS_ACTIVE {
                let mut session = self.create_new_session(player, current_time);
                world.write_model(@session);

                // Create analytics for new session
                let analytics = SessionAnalytics {
                    session_id,
                    total_transactions: 0,
                    successful_transactions: 0,
                    failed_transactions: 0,
                    total_gas_used: 0,
                    average_gas_per_tx: 0,
                    last_activity: current_time,
                    created_at: current_time,
                };
                world.write_model(@analytics);
            }

            session_id
        }

        fn create_new_session(
            ref self: ContractState, player: ContractAddress, current_time: u64,
        ) -> SessionKey {
            let session_id = self.generate_session_id(player, current_time);

            SessionKey {
                session_id,
                player_address: player,
                created_at: current_time,
                expires_at: current_time + MIN_SESSION_DURATION,
                last_used: current_time,
                max_transactions: MAX_TRANSACTIONS_PER_SESSION,
                used_transactions: 0,
                status: SESSION_STATUS_ACTIVE,
                is_valid: true,
                auto_renewal_enabled: true,
                session_type: SESSION_TYPE_PREMIUM, // All permissions
                permissions: array![
                    PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
                ],
            }
        }

        fn generate_session_id(
            self: @ContractState, player: ContractAddress, timestamp: u64,
        ) -> felt252 {
            player.into() + timestamp.into()
        }

        fn validate_and_update_session(
            ref self: ContractState, session_id: felt252, required_permission: u8,
        ) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let current_time = get_block_timestamp();

            // Try to read existing session
            let existing_session: SessionKey = world.read_model((session_id, caller));

            // If session doesn't exist or is invalid, create a new one
            if existing_session.session_id == 0
                || !existing_session.is_valid
                || existing_session.status != SESSION_STATUS_ACTIVE {
                let mut session = self.create_new_session(caller, current_time);
                world.write_model(@session);

                // Create new analytics
                let analytics = SessionAnalytics {
                    session_id,
                    total_transactions: 0,
                    successful_transactions: 0,
                    failed_transactions: 0,
                    total_gas_used: 0,
                    average_gas_per_tx: 0,
                    last_activity: current_time,
                    created_at: current_time,
                };
                world.write_model(@analytics);

                // Return true for new session (bypass validation for first use)
                return true;
            }

            // Use existing session
            let mut session = existing_session;

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check required permission
            let has_permission = self.check_permission(@session, required_permission);
            assert(has_permission, 'Insufficient permissions');

            // Auto-renewal check
            let expires_at = session.expires_at;
            let time_remaining = if current_time >= expires_at {
                0
            } else {
                expires_at - current_time
            };
            if time_remaining < AUTO_RENEWAL_THRESHOLD && session.auto_renewal_enabled {
                session.expires_at = current_time + MIN_SESSION_DURATION;
                session.max_transactions = MAX_TRANSACTIONS_PER_SESSION;
                session.used_transactions = 0;
            }

            // Update session
            session.used_transactions += 1;
            session.last_used = current_time;
            world.write_model(@session);

            // Update analytics
            let mut analytics: SessionAnalytics = world.read_model(session_id);
            analytics.total_transactions += 1;
            analytics.successful_transactions += 1;
            analytics.last_activity = current_time;
            world.write_model(@analytics);

            true
        }

        fn check_permission(
            self: @ContractState, session: @SessionKey, required_permission: u8,
        ) -> bool {
            let mut i = 0;
            loop {
                if i >= session.permissions.len() {
                    break false;
                }
                if *session.permissions.at(i) == required_permission {
                    break true;
                }
                i += 1;
            }
        }


        fn check_and_reset_daily_limits(ref self: ContractState, player_addr: ContractAddress) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_addr);
            let current_timestamp = get_block_timestamp();
            let seconds_per_day: u64 = 86400;

            if current_timestamp >= player.last_action_reset + seconds_per_day {
                player.last_action_reset = current_timestamp;
                player.daily_fish_creations = 0;
                player.daily_decoration_creations = 0;
                player.daily_aquarium_creations = 0;
                world.write_model(@player);
            }
        }
    }
}
