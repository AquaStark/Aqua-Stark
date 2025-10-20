use aqua_stark::models::session::{
    PERMISSION_ADMIN, PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, SESSION_STATUS_ACTIVE,
    SESSION_TYPE_ADMIN, SESSION_TYPE_BASIC, SESSION_TYPE_PREMIUM, SessionKey,
};
use starknet::ContractAddress;

// Session Validation Constants
pub const MIN_SESSION_DURATION: u64 = 3600; // 1 hour
pub const MAX_SESSION_DURATION: u64 = 86400; // 24 hours
pub const AUTO_RENEWAL_THRESHOLD: u64 = 300; // 5 minutes
pub const MAX_TRANSACTIONS_PER_SESSION: u32 = 1000;
pub const DEFAULT_SESSION_DURATION: u64 = 7200; // 2 hours
pub const DEFAULT_MAX_TRANSACTIONS: u32 = 100;

// Gas limits for different operations
pub const GAS_LIMIT_MOVE: u64 = 50000;
pub const GAS_LIMIT_SPAWN: u64 = 100000;
pub const GAS_LIMIT_TRADE: u64 = 150000;
pub const GAS_LIMIT_ADMIN: u64 = 200000;

// Error codes
pub const ERROR_SESSION_NOT_FOUND: u8 = 1;
pub const ERROR_SESSION_EXPIRED: u8 = 2;
pub const ERROR_SESSION_REVOKED: u8 = 3;
pub const ERROR_SESSION_SUSPENDED: u8 = 4;
pub const ERROR_NO_TRANSACTIONS_LEFT: u8 = 5;
pub const ERROR_INSUFFICIENT_PERMISSIONS: u8 = 6;
pub const ERROR_UNAUTHORIZED_ACCESS: u8 = 7;
pub const ERROR_INVALID_SESSION_TYPE: u8 = 8;

#[generate_trait]
pub impl SessionValidationImpl of SessionValidationTrait {
    fn validate_session_parameters(
        session: SessionKey, caller: ContractAddress, current_time: u64,
    ) -> bool {
        // Check if session exists
        if session.session_id == 0 {
            return false;
        }

        // Check ownership
        if session.player_address != caller {
            return false;
        }

        // Check if session is valid
        if !session.is_valid {
            return false;
        }

        // Check session status
        if session.status != SESSION_STATUS_ACTIVE {
            return false;
        }

        // Check expiration
        if current_time >= session.expires_at {
            return false;
        }

        // Check transaction limits
        if session.used_transactions >= session.max_transactions {
            return false;
        }

        true
    }

    fn is_session_expired(session: SessionKey, current_time: u64) -> bool {
        current_time >= session.expires_at
    }

    fn has_transactions_left(session: SessionKey) -> bool {
        session.used_transactions < session.max_transactions
    }

    fn get_session_status(session: SessionKey) -> u8 {
        session.status
    }

    fn validate_session_permissions(session: SessionKey, required_permission: u8) -> bool {
        let mut has_permission = false;
        let mut i = 0;
        let permissions_len = session.permissions.len();

        while i < permissions_len {
            let permission = session.permissions.at(i);
            let permission_value = *permission;
            if permission_value == required_permission {
                has_permission = true;
                break;
            }
            i += 1;
        };

        has_permission
    }

    fn calculate_session_health(session: SessionKey, current_time: u64) -> u64 {
        // Calculate session health as a percentage (0-100)
        if session.status != SESSION_STATUS_ACTIVE {
            return 0;
        }

        if current_time >= session.expires_at {
            return 0;
        }

        let total_duration = session.expires_at - session.created_at;
        let remaining_time = session.expires_at - current_time;
        let time_health = (remaining_time * 100) / total_duration;

        let transaction_health = if session.max_transactions > 0 {
            let remaining_tx = session.max_transactions - session.used_transactions;
            (remaining_tx * 100) / session.max_transactions
        } else {
            0
        };

        // Return average of time and transaction health
        (time_health + transaction_health.into()) / 2
    }

    fn should_auto_renew(session: SessionKey, current_time: u64) -> bool {
        if !session.auto_renewal_enabled {
            return false;
        }

        if session.status != SESSION_STATUS_ACTIVE {
            return false;
        }

        let time_remaining = if current_time >= session.expires_at {
            0
        } else {
            session.expires_at - current_time
        };

        time_remaining < AUTO_RENEWAL_THRESHOLD
    }

    fn get_session_type_name(session_type: u8) -> felt252 {
        if session_type == SESSION_TYPE_BASIC {
            'basic'
        } else if session_type == SESSION_TYPE_PREMIUM {
            'premium'
        } else if session_type == SESSION_TYPE_ADMIN {
            'admin'
        } else {
            'unknown'
        }
    }

    fn get_permission_name(permission: u8) -> felt252 {
        if permission == PERMISSION_MOVE {
            'move'
        } else if permission == PERMISSION_SPAWN {
            'spawn'
        } else if permission == PERMISSION_TRADE {
            'trade'
        } else if permission == PERMISSION_ADMIN {
            'admin'
        } else {
            'unknown'
        }
    }

    fn validate_session_duration(duration: u64) -> bool {
        duration >= MIN_SESSION_DURATION && duration <= MAX_SESSION_DURATION
    }

    fn validate_max_transactions(max_transactions: u32) -> bool {
        max_transactions > 0 && max_transactions <= MAX_TRANSACTIONS_PER_SESSION
    }

    fn validate_session_type(session_type: u8) -> bool {
        session_type <= SESSION_TYPE_ADMIN
    }

    fn get_default_permissions_for_type(session_type: u8) -> Array<u8> {
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
        } else {
            // Default to basic permissions
            permissions.append(PERMISSION_MOVE);
            permissions.append(PERMISSION_SPAWN);
        }
        permissions
    }

    fn calculate_optimal_session_duration(session_type: u8) -> u64 {
        if session_type == SESSION_TYPE_BASIC {
            3600 // 1 hour
        } else if session_type == SESSION_TYPE_PREMIUM {
            7200 // 2 hours
        } else if session_type == SESSION_TYPE_ADMIN {
            14400 // 4 hours
        } else {
            DEFAULT_SESSION_DURATION
        }
    }

    fn calculate_optimal_max_transactions(session_type: u8) -> u32 {
        if session_type == SESSION_TYPE_BASIC {
            50
        } else if session_type == SESSION_TYPE_PREMIUM {
            200
        } else if session_type == SESSION_TYPE_ADMIN {
            500
        } else {
            DEFAULT_MAX_TRANSACTIONS
        }
    }
}

