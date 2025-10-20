use aqua_stark::models::session::SessionKey;

// Define the interface
#[starknet::interface]
pub trait ISession<T> {
    fn create_session_key(
        ref self: T, duration: u64, max_transactions: u32, session_type: u8,
    ) -> felt252;
    fn validate_session(ref self: T, session_id: felt252) -> bool;
    fn renew_session(ref self: T, session_id: felt252, new_duration: u64, new_max_tx: u32) -> bool;
    fn revoke_session(ref self: T, session_id: felt252) -> bool;
    fn get_session_info(self: @T, session_id: felt252) -> SessionKey;
    fn calculate_session_time_remaining(self: @T, session_id: felt252) -> u64;
    fn check_session_needs_renewal(self: @T, session_id: felt252) -> bool;
    fn calculate_remaining_transactions(self: @T, session_id: felt252) -> u32;
}

// dojo decorator
#[dojo::contract]
pub mod session {
    use aqua_stark::models::session::{
        SessionKey, SessionAnalytics, SessionOperation, SESSION_STATUS_ACTIVE,
        SESSION_STATUS_EXPIRED, SESSION_STATUS_REVOKED, SESSION_TYPE_BASIC, SESSION_TYPE_PREMIUM,
        SESSION_TYPE_ADMIN, OPERATION_TYPE_CREATE, OPERATION_TYPE_USE, OPERATION_TYPE_RENEW,
        OPERATION_TYPE_REVOKE, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE,
        PERMISSION_ADMIN,
    };
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use super::ISession;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionKeyCreated {
        #[key]
        pub session_id: felt252,
        pub player_address: ContractAddress,
        pub duration: u64,
        pub max_transactions: u32,
        pub session_type: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionKeyRevoked {
        #[key]
        pub session_id: felt252,
        pub player_address: ContractAddress,
        pub reason: u8,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionKeyUsed {
        #[key]
        pub session_id: felt252,
        pub player_address: ContractAddress,
        pub operation_type: u8,
        pub gas_used: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionAutoRenewed {
        #[key]
        pub session_id: felt252,
        pub player_address: ContractAddress,
        pub new_expires_at: u64,
        pub new_max_transactions: u32,
    }


    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionOperationTracked {
        #[key]
        pub session_id: felt252,
        pub operation_id: felt252,
        pub operation_type: u8,
        pub timestamp: u64,
        pub gas_used: u64,
        pub success: bool,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct SessionPerformanceMetrics {
        #[key]
        pub session_id: felt252,
        pub average_gas_per_tx: u64,
        pub success_rate: u8,
        pub last_activity: u64,
    }

    #[abi(embed_v0)]
    impl SessionImpl of ISession<ContractState> {
        fn create_session_key(
            ref self: ContractState, duration: u64, max_transactions: u32, session_type: u8,
        ) -> felt252 {
            let mut world = self.world_default();
            let player = get_caller_address();
            let current_time = get_block_timestamp();

            // Validate parameters
            assert(duration >= 3600, 'Duration too short'); // Minimum 1 hour
            assert(duration <= 86400, 'Duration too long'); // Maximum 24 hours
            assert(max_transactions > 0, 'Invalid max transactions');
            assert(max_transactions <= 1000, 'Max transactions too high');
            assert(session_type <= SESSION_TYPE_ADMIN, 'Invalid session type');

            // Generate session ID (simple hash of player + timestamp)
            let session_id = self.generate_session_id(player, current_time);

            // Create permissions array based on session type
            let mut permissions = array![];
            if session_type == SESSION_TYPE_BASIC {
                permissions.append(PERMISSION_MOVE);
                permissions.append(PERMISSION_SPAWN);
            } else if session_type == SESSION_TYPE_PREMIUM {
                permissions.append(PERMISSION_MOVE);
                permissions.append(PERMISSION_SPAWN);
                permissions.append(PERMISSION_TRADE);
            } else if session_type == SESSION_TYPE_ADMIN {
                permissions.append(PERMISSION_MOVE);
                permissions.append(PERMISSION_SPAWN);
                permissions.append(PERMISSION_TRADE);
                permissions.append(PERMISSION_ADMIN);
            };

            // Create session key
            let session_key = SessionKey {
                session_id,
                player_address: player,
                created_at: current_time,
                expires_at: current_time + duration,
                last_used: current_time,
                max_transactions,
                used_transactions: 0,
                status: SESSION_STATUS_ACTIVE,
                is_valid: true,
                auto_renewal_enabled: true,
                session_type,
                permissions,
            };

            // Create analytics entry
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

            // Write to world
            world.write_model(@session_key);
            world.write_model(@analytics);

            // Track operation
            self.track_operation(world, session_id, OPERATION_TYPE_CREATE, 0, true, Option::None);

            // Emit events
            world
                .emit_event(
                    @SessionKeyCreated {
                        session_id,
                        player_address: player,
                        duration,
                        max_transactions,
                        session_type,
                    },
                );

            session_id
        }

        fn validate_session(ref self: ContractState, session_id: felt252) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read session
            let session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Basic validations
            if session.session_id == 0 {
                return false;
            }
            if session.player_address != caller {
                return false;
            }
            if !session.is_valid {
                return false;
            }
            if session.status != SESSION_STATUS_ACTIVE {
                return false;
            }
            if current_time >= session.expires_at {
                // Create updated session with expired status
                let mut expired_session = session;
                expired_session.status = SESSION_STATUS_EXPIRED;
                expired_session.is_valid = false;
                world.write_model(@expired_session);
                return false;
            }
            if session.used_transactions >= session.max_transactions {
                return false;
            }

            // Auto-renewal check
            let time_remaining = session.expires_at - current_time;
            if time_remaining < 300 && session.auto_renewal_enabled { // 5 minutes threshold
                // Create renewed session
                let mut renewed_session = session;
                renewed_session.expires_at = current_time + 3600; // Extend by 1 hour
                renewed_session.max_transactions = 100; // Reset transaction limit
                renewed_session.used_transactions = 0; // Reset used transactions
                renewed_session.last_used = current_time;
                world.write_model(@renewed_session);

                // Emit auto-renewal event
                world
                    .emit_event(
                        @SessionAutoRenewed {
                            session_id,
                            player_address: caller,
                            new_expires_at: renewed_session.expires_at,
                            new_max_transactions: renewed_session.max_transactions,
                        },
                    );
            } else {
                // Create updated session with incremented transaction count
                let mut updated_session = session;
                updated_session.last_used = current_time;
                updated_session.used_transactions += 1;
                world.write_model(@updated_session);
            }

            // Track usage
            self.track_operation(world, session_id, OPERATION_TYPE_USE, 0, true, Option::None);

            true
        }

        fn renew_session(
            ref self: ContractState, session_id: felt252, new_duration: u64, new_max_tx: u32,
        ) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read session
            let session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Validate session exists and belongs to caller
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');

            // Validate parameters
            assert(new_duration >= 3600, 'Duration too short');
            assert(new_duration <= 86400, 'Duration too long');
            assert(new_max_tx > 0, 'Invalid max transactions');
            assert(new_max_tx <= 1000, 'Max transactions too high');

            // Create updated session
            let mut updated_session = session;
            updated_session.expires_at = current_time + new_duration;
            updated_session.max_transactions = new_max_tx;
            updated_session.used_transactions = 0; // Reset transaction count
            updated_session.last_used = current_time;
            updated_session.status = SESSION_STATUS_ACTIVE;
            updated_session.is_valid = true;

            world.write_model(@updated_session);

            // Track operation
            self.track_operation(world, session_id, OPERATION_TYPE_RENEW, 0, true, Option::None);

            // Emit event
            world
                .emit_event(
                    @SessionAutoRenewed {
                        session_id,
                        player_address: caller,
                        new_expires_at: updated_session.expires_at,
                        new_max_transactions: updated_session.max_transactions,
                    },
                );

            true
        }

        fn revoke_session(ref self: ContractState, session_id: felt252) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read session
            let session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Validate session exists and belongs to caller
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');

            // Create revoked session
            let mut revoked_session = session;
            revoked_session.status = SESSION_STATUS_REVOKED;
            revoked_session.is_valid = false;
            revoked_session.last_used = current_time;

            world.write_model(@revoked_session);

            // Track operation
            self.track_operation(world, session_id, OPERATION_TYPE_REVOKE, 0, true, Option::None);

            // Emit event
            world
                .emit_event(
                    @SessionKeyRevoked {
                        session_id, player_address: caller, reason: 0 // User requested
                    },
                );

            true
        }

        fn get_session_info(self: @ContractState, session_id: felt252) -> SessionKey {
            let world = self.world_default();
            let caller = get_caller_address();
            world.read_model((session_id, caller))
        }

        fn calculate_session_time_remaining(self: @ContractState, session_id: felt252) -> u64 {
            let world = self.world_default();
            let caller = get_caller_address();
            let session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            if current_time >= session.expires_at {
                0
            } else {
                session.expires_at - current_time
            }
        }

        fn check_session_needs_renewal(self: @ContractState, session_id: felt252) -> bool {
            let time_remaining = self.calculate_session_time_remaining(session_id);
            time_remaining < 300 // 5 minutes threshold
        }

        fn calculate_remaining_transactions(self: @ContractState, session_id: felt252) -> u32 {
            let world = self.world_default();
            let caller = get_caller_address();
            let session: SessionKey = world.read_model((session_id, caller));

            if session.used_transactions >= session.max_transactions {
                0
            } else {
                session.max_transactions - session.used_transactions
            }
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn generate_session_id(
            self: @ContractState, player: ContractAddress, timestamp: u64,
        ) -> felt252 {
            // Simple hash function for session ID generation
            // In production, you might want to use a more sophisticated hash
            let player_felt: felt252 = player.into();
            player_felt + timestamp.into()
        }

        fn track_operation(
            self: @ContractState,
            mut world: dojo::world::WorldStorage,
            session_id: felt252,
            operation_type: u8,
            gas_used: u64,
            success: bool,
            error_code: Option<u8>,
        ) {
            let current_time = get_block_timestamp();
            let operation_id = session_id + current_time.into();

            let operation = SessionOperation {
                session_id,
                operation_id,
                operation_type,
                timestamp: current_time,
                gas_used,
                success,
                error_code,
            };

            world.write_model(@operation);

            // Update analytics
            let mut analytics: SessionAnalytics = world.read_model(session_id);
            analytics.total_transactions += 1;
            if success {
                analytics.successful_transactions += 1;
            } else {
                analytics.failed_transactions += 1;
            }
            analytics.total_gas_used += gas_used;
            world.write_model(@analytics);

            // Emit events
            world
                .emit_event(
                    @SessionOperationTracked {
                        session_id,
                        operation_id,
                        operation_type,
                        timestamp: current_time,
                        gas_used,
                        success,
                    },
                );
        }
    }
}
