use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use aqua_stark::models::session::{
    SessionKey, SessionAnalytics, SessionOperation, SESSION_STATUS_ACTIVE, SESSION_STATUS_EXPIRED,
    SESSION_STATUS_REVOKED, SESSION_TYPE_BASIC, SESSION_TYPE_PREMIUM, SESSION_TYPE_ADMIN,
    PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN, OPERATION_TYPE_CREATE,
    OPERATION_TYPE_USE, OPERATION_TYPE_RENEW, OPERATION_TYPE_REVOKE,
};
use aqua_stark::helpers::session_validation::{
    SessionValidationTrait, SessionValidationImpl, MIN_SESSION_DURATION, MAX_SESSION_DURATION,
    AUTO_RENEWAL_THRESHOLD, MAX_TRANSACTIONS_PER_SESSION,
};

// Constants for gas optimization
pub const GAS_SAVINGS_PER_SESSION_VALIDATION: u64 = 15000;
pub const GAS_SAVINGS_PER_BATCH_ACTION: u64 = 10000;
pub const BASIC_ACTION_GAS: u64 = 25000;
pub const FISH_ACTION_GAS: u64 = 30000;
pub const TRADE_ACTION_GAS: u64 = 45000;
pub const SHOP_ACTION_GAS: u64 = 35000;

#[generate_trait]
pub impl UnifiedSessionMiddlewareImpl of UnifiedSessionMiddlewareTrait {
    // Universal session validation for any game system
    fn validate_unified_session(
        world: IWorldDispatcher, session_id: felt252, required_permission: u8,
    ) -> bool {
        let caller = get_caller_address();
        let current_time = get_block_timestamp();

        // Read session
        let mut session: SessionKey = world.read_model((session_id, caller));

        // Basic validation
        assert(session.session_id != 0, 'Session not found');
        assert(session.player_address == caller, 'Unauthorized session');
        assert(session.is_valid, 'Session invalid');
        assert(session.status == SESSION_STATUS_ACTIVE, 'Session not active');
        assert(current_time < session.expires_at, 'Session expired');
        assert(session.used_transactions < session.max_transactions, 'No transactions left');

        // Check required permission
        let has_permission = Self::check_permission(session, required_permission);
        assert(has_permission, 'Insufficient permissions');

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

        // Update analytics
        let mut analytics: SessionAnalytics = world.read_model(session_id);
        analytics.total_transactions += 1;
        analytics.successful_transactions += 1;
        analytics.last_activity = current_time;
        world.write_model(@analytics);

        true
    }

    // Check if session has required permission
    fn check_permission(session: SessionKey, required_permission: u8) -> bool {
        for i in 0..session.permissions.len() {
            if *session.permissions.at(i) == required_permission {
                return true;
            }
        }
        false
    }

    // Create session for any player
    fn create_unified_session(
        world: IWorldDispatcher, player: ContractAddress, duration: u64, session_type: u8,
    ) -> felt252 {
        let current_time = get_block_timestamp();

        // Validate parameters
        assert(SessionValidationImpl::validate_session_duration(duration), 'Invalid duration');
        assert(SessionValidationImpl::validate_session_type(session_type), 'Invalid session type');

        // Generate unique session ID
        let session_id = Self::generate_session_id(player, current_time);

        // Determine permissions and limits based on session type
        let (permissions, max_transactions) = Self::get_session_config(session_type);

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
        world.write_model(@session);
        world.write_model(@analytics);

        session_id
    }

    // Get session configuration based on type
    fn get_session_config(session_type: u8) -> (Array<u8>, u32) {
        if session_type == SESSION_TYPE_BASIC {
            (array![PERMISSION_MOVE, PERMISSION_SPAWN], 100)
        } else if session_type == SESSION_TYPE_PREMIUM {
            (array![PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE], 500)
        } else if session_type == SESSION_TYPE_ADMIN {
            (array![PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN], 1000)
        } else {
            (array![PERMISSION_MOVE], 50) // Default basic permissions
        }
    }

    // Generate unique session ID
    fn generate_session_id(player: ContractAddress, timestamp: u64) -> felt252 {
        player.into() + timestamp.into()
    }

    // Track operation for analytics
    fn track_operation(
        world: IWorldDispatcher,
        session_id: felt252,
        operation_type: u8,
        gas_used: u64,
        success: bool,
    ) {
        let caller = get_caller_address();
        let current_time = get_block_timestamp();

        // Create operation record
        let operation = SessionOperation {
            session_id,
            operation_id: Self::generate_operation_id(session_id, current_time),
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
        let mut analytics: SessionAnalytics = world.read_model(session_id);
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

    // Generate unique operation ID
    fn generate_operation_id(session_id: felt252, timestamp: u64) -> u64 {
        (session_id.into() + timestamp.into()).try_into().unwrap()
    }

    // Calculate gas savings for unified session
    fn calculate_gas_savings(actions_count: u32, is_batch: bool) -> u64 {
        let base_savings = actions_count * GAS_SAVINGS_PER_SESSION_VALIDATION;
        if is_batch {
            base_savings + (actions_count * GAS_SAVINGS_PER_BATCH_ACTION)
        } else {
            base_savings
        }
    }

    // Get session info
    fn get_session_info(
        world: IWorldDispatcher, session_id: felt252, player: ContractAddress,
    ) -> SessionKey {
        world.read_model((session_id, player))
    }

    // Get session analytics
    fn get_session_analytics(
        world: IWorldDispatcher, session_id: felt252, player: ContractAddress,
    ) -> SessionAnalytics {
        world.read_model(session_id)
    }

    // Renew session
    fn renew_session(world: IWorldDispatcher, session_id: felt252, new_duration: u64) -> bool {
        let caller = get_caller_address();
        let mut session: SessionKey = world.read_model((session_id, caller));
        let current_time = get_block_timestamp();

        assert(session.session_id != 0, 'Session not found');
        assert(session.player_address == caller, 'Unauthorized session');
        assert(session.is_valid, 'Session invalid');
        assert(SessionValidationImpl::validate_session_duration(new_duration), 'Invalid duration');

        // Renew session
        session.expires_at = current_time + new_duration;
        session.max_transactions = MAX_TRANSACTIONS_PER_SESSION;
        session.used_transactions = 0;
        session.last_used = current_time;

        world.write_model(@session);

        true
    }

    // Revoke session
    fn revoke_session(world: IWorldDispatcher, session_id: felt252) -> bool {
        let caller = get_caller_address();
        let mut session: SessionKey = world.read_model((session_id, caller));

        assert(session.session_id != 0, 'Session not found');
        assert(session.player_address == caller, 'Unauthorized session');

        session.status = SESSION_STATUS_REVOKED;
        session.is_valid = false;
        session.last_used = get_block_timestamp();

        world.write_model(@session);

        true
    }
}

// Trait for the unified session middleware
#[starknet::interface]
pub trait UnifiedSessionMiddlewareTrait<TContractState> {
    fn validate_unified_session(
        self: @TContractState,
        world: IWorldDispatcher,
        session_id: felt252,
        required_permission: u8,
    ) -> bool;

    fn create_unified_session(
        self: @TContractState,
        world: IWorldDispatcher,
        player: ContractAddress,
        duration: u64,
        session_type: u8,
    ) -> felt252;

    fn get_session_info(
        self: @TContractState,
        world: IWorldDispatcher,
        session_id: felt252,
        player: ContractAddress,
    ) -> SessionKey;

    fn get_session_analytics(
        self: @TContractState,
        world: IWorldDispatcher,
        session_id: felt252,
        player: ContractAddress,
    ) -> SessionAnalytics;

    fn renew_session(
        self: @TContractState, world: IWorldDispatcher, session_id: felt252, new_duration: u64,
    ) -> bool;

    fn revoke_session(self: @TContractState, world: IWorldDispatcher, session_id: felt252) -> bool;
}
