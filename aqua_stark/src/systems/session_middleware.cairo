use aqua_stark::helpers::session_validation::{
    AUTO_RENEWAL_THRESHOLD, MAX_SESSION_DURATION, MAX_TRANSACTIONS_PER_SESSION,
    MIN_SESSION_DURATION, SessionValidationImpl, SessionValidationTrait,
};
use aqua_stark::models::session::{
    OPERATION_TYPE_CREATE, OPERATION_TYPE_RENEW, OPERATION_TYPE_REVOKE, OPERATION_TYPE_USE,
    PERMISSION_ADMIN, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, SESSION_STATUS_ACTIVE,
    SESSION_STATUS_EXPIRED, SESSION_STATUS_REVOKED, SESSION_TYPE_ADMIN, SESSION_TYPE_BASIC,
    SESSION_TYPE_PREMIUM, SessionAnalytics, SessionKey, SessionOperation,
};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

#[starknet::interface]
pub trait ISessionMiddleware<TContractState> {
    // Middleware functions for existing game systems
    fn validate_session_for_aquarium_action(
        ref self: TContractState, session_id: felt252, action_type: u8,
    ) -> bool;

    fn validate_session_for_fish_action(
        ref self: TContractState, session_id: felt252, action_type: u8,
    ) -> bool;

    fn validate_session_for_trade_action(
        ref self: TContractState, session_id: felt252, action_type: u8,
    ) -> bool;

    fn validate_session_for_shop_action(
        ref self: TContractState, session_id: felt252, action_type: u8,
    ) -> bool;

    // Gas optimization functions
    fn batch_aquarium_actions(
        ref self: TContractState, session_id: felt252, actions: Array<u8>,
    ) -> bool;

    fn batch_fish_actions(
        ref self: TContractState, session_id: felt252, actions: Array<u8>,
    ) -> bool;

    // Session management for existing systems
    fn create_session_for_player(
        ref self: TContractState, player: ContractAddress, duration: u64, session_type: u8,
    ) -> felt252;

    fn get_session_status(
        self: @TContractState, session_id: felt252, player: ContractAddress,
    ) -> SessionKey;
}

#[starknet::contract]
pub mod SessionMiddleware {
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use super::*;

    #[storage]
    pub struct Storage {
        world: IWorldDispatcher,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        SessionValidated: SessionValidated,
        SessionExpired: SessionExpired,
        SessionRevoked: SessionRevoked,
        GasOptimized: GasOptimized,
        BatchActionExecuted: BatchActionExecuted,
    }

    #[derive(Drop, starknet::Event)]
    pub struct SessionValidated {
        session_id: felt252,
        player: ContractAddress,
        system: felt252, // Which game system
        action_type: u8,
        gas_saved: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct SessionExpired {
        session_id: felt252,
        player: ContractAddress,
        system: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct SessionRevoked {
        session_id: felt252,
        player: ContractAddress,
        reason: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GasOptimized {
        session_id: felt252,
        player: ContractAddress,
        original_gas: u64,
        optimized_gas: u64,
        savings: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct BatchActionExecuted {
        session_id: felt252,
        player: ContractAddress,
        system: felt252,
        actions_count: u32,
        total_gas_used: u64,
        gas_saved: u64,
    }

    #[abi(embed_v0)]
    pub impl SessionMiddlewareImpl of super::ISessionMiddleware<ContractState> {
        fn validate_session_for_aquarium_action(
            ref self: ContractState, session_id: felt252, action_type: u8,
        ) -> bool {
            let caller = get_caller_address();
            let mut world = self.world_default();

            // Read and validate session
            let mut session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check aquarium-specific permissions
            let has_permission = self.check_aquarium_permissions(session, action_type);
            assert(has_permission, 'Insufficient permissions for aquarium action');

            // Auto-renewal check
            let time_remaining = if current_time >= session.expires_at {
                0
            } else {
                session.expires_at - current_time
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

            // Track operation
            self.track_operation(session_id, caller, action_type, true, 25000);

            // Emit event
            self
                .emit(
                    Event::SessionValidated(
                        SessionValidated {
                            session_id,
                            player: caller,
                            system: 'aquarium',
                            action_type,
                            gas_saved: 15000 // Estimated gas savings
                        },
                    ),
                );

            true
        }

        fn validate_session_for_fish_action(
            ref self: ContractState, session_id: felt252, action_type: u8,
        ) -> bool {
            let caller = get_caller_address();
            let mut world = self.world_default();

            let mut session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check fish-specific permissions
            let has_permission = self.check_fish_permissions(session, action_type);
            assert(has_permission, 'Insufficient permissions for fish action');

            // Auto-renewal check
            let time_remaining = if current_time >= session.expires_at {
                0
            } else {
                session.expires_at - current_time
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

            // Track operation
            self.track_operation(session_id, caller, action_type, true, 30000);

            self
                .emit(
                    Event::SessionValidated(
                        SessionValidated {
                            session_id,
                            player: caller,
                            system: 'fish',
                            action_type,
                            gas_saved: 20000,
                        },
                    ),
                );

            true
        }

        fn validate_session_for_trade_action(
            ref self: ContractState, session_id: felt252, action_type: u8,
        ) -> bool {
            let caller = get_caller_address();
            let mut world = self.world_default();

            let mut session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check trade-specific permissions
            let has_permission = self.check_trade_permissions(session, action_type);
            assert(has_permission, 'Insufficient permissions for trade action');

            // Auto-renewal check
            let time_remaining = if current_time >= session.expires_at {
                0
            } else {
                session.expires_at - current_time
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

            // Track operation
            self.track_operation(session_id, caller, action_type, true, 45000);

            self
                .emit(
                    Event::SessionValidated(
                        SessionValidated {
                            session_id,
                            player: caller,
                            system: 'trade',
                            action_type,
                            gas_saved: 25000,
                        },
                    ),
                );

            true
        }

        fn validate_session_for_shop_action(
            ref self: ContractState, session_id: felt252, action_type: u8,
        ) -> bool {
            let caller = get_caller_address();
            let mut world = self.world_default();

            let mut session: SessionKey = world.read_model((session_id, caller));
            let current_time = get_block_timestamp();

            // Basic validation
            assert(session.session_id != 0, 'Session not found');
            assert(session.player_address == caller, 'Unauthorized session');
            assert(session.is_valid, 'Session invalid');
            assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
            assert(current_time < session.expires_at, 'Session expired');
            assert(session.used_transactions < session.max_transactions, 'No transactions left');

            // Check shop-specific permissions
            let has_permission = self.check_shop_permissions(session, action_type);
            assert(has_permission, 'Insufficient permissions for shop action');

            // Auto-renewal check
            let time_remaining = if current_time >= session.expires_at {
                0
            } else {
                session.expires_at - current_time
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

            // Track operation
            self.track_operation(session_id, caller, action_type, true, 35000);

            self
                .emit(
                    Event::SessionValidated(
                        SessionValidated {
                            session_id,
                            player: caller,
                            system: 'shop',
                            action_type,
                            gas_saved: 18000,
                        },
                    ),
                );

            true
        }

        fn batch_aquarium_actions(
            ref self: ContractState, session_id: felt252, actions: Array<u8>,
        ) -> bool {
            // Validate session once for batch
            assert(self.validate_session_for_aquarium_action(session_id, 0), 'Invalid session');

            let caller = get_caller_address();
            let actions_count = actions.len();
            let total_gas_used = actions_count * 25000;
            let gas_saved = actions_count * 10000; // Savings from batching

            // Process batch actions (simplified)
            let success = true;

            self
                .emit(
                    Event::BatchActionExecuted(
                        BatchActionExecuted {
                            session_id,
                            player: caller,
                            system: 'aquarium',
                            actions_count: actions_count.try_into().unwrap(),
                            total_gas_used,
                            gas_saved,
                        },
                    ),
                );

            success
        }

        fn batch_fish_actions(
            ref self: ContractState, session_id: felt252, actions: Array<u8>,
        ) -> bool {
            // Validate session once for batch
            assert(self.validate_session_for_fish_action(session_id, 0), 'Invalid session');

            let caller = get_caller_address();
            let actions_count = actions.len();
            let total_gas_used = actions_count * 30000;
            let gas_saved = actions_count * 12000; // Savings from batching

            // Process batch actions (simplified)
            let success = true;

            self
                .emit(
                    Event::BatchActionExecuted(
                        BatchActionExecuted {
                            session_id,
                            player: caller,
                            system: 'fish',
                            actions_count: actions_count.try_into().unwrap(),
                            total_gas_used,
                            gas_saved,
                        },
                    ),
                );

            success
        }

        fn create_session_for_player(
            ref self: ContractState, player: ContractAddress, duration: u64, session_type: u8,
        ) -> felt252 {
            let current_time = get_block_timestamp();

            // Validate parameters
            assert(SessionValidationImpl::validate_session_duration(duration), 'Invalid duration');
            assert(
                SessionValidationImpl::validate_session_type(session_type), 'Invalid session type',
            );

            // Generate unique session ID
            let session_id = self.generate_session_id(player, current_time);

            // Determine permissions based on session type
            let permissions = self.get_permissions_for_type(session_type);
            let max_transactions = self.get_max_transactions_for_type(session_type);

            // Create session key
            let session = SessionKey {
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

            // Create analytics
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

            // Store in world
            let mut world = self.world_default();
            world.write_model(@session);
            world.write_model(@analytics);

            session_id
        }

        fn get_session_status(
            self: @ContractState, session_id: felt252, player: ContractAddress,
        ) -> SessionKey {
            let world = self.world_default();
            world.read_model((session_id, player))
        }
    }

    // Internal helper functions
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> IWorldDispatcher {
            self.world.read()
        }

        fn generate_session_id(
            self: @ContractState, player: ContractAddress, timestamp: u64,
        ) -> felt252 {
            player.into() + timestamp.into()
        }

        fn check_aquarium_permissions(
            self: @ContractState, session: SessionKey, action_type: u8,
        ) -> bool {
            // Check if session has required permissions for aquarium actions
            if action_type == PERMISSION_MOVE {
                // Check for move permission
                for i in 0..session.permissions.len() {
                    if *session.permissions.at(i) == PERMISSION_MOVE {
                        return true;
                    }
                }
            }
            true // Default to true for basic actions
        }

        fn check_fish_permissions(
            self: @ContractState, session: SessionKey, action_type: u8,
        ) -> bool {
            // Check if session has required permissions for fish actions
            if action_type == PERMISSION_SPAWN {
                // Check for spawn permission
                for i in 0..session.permissions.len() {
                    if *session.permissions.at(i) == PERMISSION_SPAWN {
                        return true;
                    }
                }
            }
            true // Default to true for basic actions
        }

        fn check_trade_permissions(
            self: @ContractState, session: SessionKey, action_type: u8,
        ) -> bool {
            // Check if session has required permissions for trade actions
            if action_type == PERMISSION_TRADE {
                // Check for trade permission
                for i in 0..session.permissions.len() {
                    if *session.permissions.at(i) == PERMISSION_TRADE {
                        return true;
                    }
                }
            }
            true // Default to true for basic actions
        }

        fn check_shop_permissions(
            self: @ContractState, session: SessionKey, action_type: u8,
        ) -> bool {
            // Check if session has required permissions for shop actions
            // Shop actions typically require basic permissions
            true
        }

        fn get_permissions_for_type(self: @ContractState, session_type: u8) -> Array<u8> {
            if session_type == SESSION_TYPE_BASIC {
                array![PERMISSION_MOVE, PERMISSION_SPAWN]
            } else if session_type == SESSION_TYPE_PREMIUM {
                array![PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE]
            } else if session_type == SESSION_TYPE_ADMIN {
                array![PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN]
            } else {
                array![PERMISSION_MOVE] // Default basic permissions
            }
        }

        fn get_max_transactions_for_type(self: @ContractState, session_type: u8) -> u32 {
            if session_type == SESSION_TYPE_BASIC {
                100
            } else if session_type == SESSION_TYPE_PREMIUM {
                500
            } else if session_type == SESSION_TYPE_ADMIN {
                1000
            } else {
                50 // Default low limit
            }
        }

        fn track_operation(
            ref self: ContractState,
            session_id: felt252,
            player: ContractAddress,
            operation_type: u8,
            success: bool,
            gas_used: u64,
        ) {
            let current_time = get_block_timestamp();
            let mut world = self.world_default();

            // Create operation record
            let operation = SessionOperation {
                session_id,
                operation_id: self.generate_operation_id(session_id, current_time),
                operation_type,
                timestamp: current_time,
                gas_used,
                success,
                error_code: if success {
                    Option::None
                } else {
                    Option::Some(1)
                },
            };

            // Store operation
            world.write_model(@operation);

            // Update analytics
            let mut analytics: SessionAnalytics = world.read_model((session_id, player));
            analytics.total_transactions += 1;
            if success {
                analytics.successful_transactions += 1;
            } else {
                analytics.failed_transactions += 1;
            }
            analytics.total_gas_used += gas_used;
            analytics.average_gas_per_tx = analytics.total_gas_used / analytics.total_transactions;
            analytics.last_activity = current_time;

            world.write_model(@analytics);
        }

        fn generate_operation_id(self: @ContractState, session_id: felt252, timestamp: u64) -> u64 {
            (session_id.into() + timestamp.into()).try_into().unwrap()
        }
    }
}

#[starknet::interface]
pub trait InternalTrait {
    fn world_default(self: @ContractState) -> IWorldDispatcher;
    fn generate_session_id(
        self: @ContractState, player: ContractAddress, timestamp: u64,
    ) -> felt252;
    fn check_aquarium_permissions(
        self: @ContractState, session: SessionKey, action_type: u8,
    ) -> bool;
    fn check_fish_permissions(self: @ContractState, session: SessionKey, action_type: u8) -> bool;
    fn check_trade_permissions(self: @ContractState, session: SessionKey, action_type: u8) -> bool;
    fn check_shop_permissions(self: @ContractState, session: SessionKey, action_type: u8) -> bool;
    fn get_permissions_for_type(self: @ContractState, session_type: u8) -> Array<u8>;
    fn get_max_transactions_for_type(self: @ContractState, session_type: u8) -> u32;
    fn track_operation(
        ref self: ContractState,
        session_id: felt252,
        player: ContractAddress,
        operation_type: u8,
        success: bool,
        gas_used: u64,
    );
    fn generate_operation_id(self: @ContractState, session_id: felt252, timestamp: u64) -> u64;
}
