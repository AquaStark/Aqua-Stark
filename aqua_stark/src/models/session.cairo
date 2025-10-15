use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct SessionKey {
    #[key]
    pub session_id: felt252,
    #[key]
    pub player_address: ContractAddress,
    pub created_at: u64,
    pub expires_at: u64,
    pub last_used: u64,
    pub max_transactions: u32,
    pub used_transactions: u32,
    pub status: u8, // 0: Active, 1: Expired, 2: Revoked, 3: Suspended
    pub is_valid: bool,
    pub auto_renewal_enabled: bool,
    pub session_type: u8, // 0: Basic, 1: Premium, 2: Admin
    pub permissions: Array<u8> // Array of permission flags
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct SessionAnalytics {
    #[key]
    pub session_id: felt252,
    pub total_transactions: u32,
    pub successful_transactions: u32,
    pub failed_transactions: u32,
    pub total_gas_used: u64,
    pub average_gas_per_tx: u64,
    pub last_activity: u64,
    pub created_at: u64,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct SessionOperation {
    #[key]
    pub session_id: felt252,
    #[key]
    pub operation_id: felt252,
    pub operation_type: u8, // 0: Create, 1: Use, 2: Renew, 3: Revoke
    pub timestamp: u64,
    pub gas_used: u64,
    pub success: bool,
    pub error_code: Option<u8>,
}

// Session Status Constants
pub const SESSION_STATUS_ACTIVE: u8 = 0;
pub const SESSION_STATUS_EXPIRED: u8 = 1;
pub const SESSION_STATUS_REVOKED: u8 = 2;
pub const SESSION_STATUS_SUSPENDED: u8 = 3;

// Session Type Constants
pub const SESSION_TYPE_BASIC: u8 = 0;
pub const SESSION_TYPE_PREMIUM: u8 = 1;
pub const SESSION_TYPE_ADMIN: u8 = 2;

// Operation Type Constants
pub const OPERATION_TYPE_CREATE: u8 = 0;
pub const OPERATION_TYPE_USE: u8 = 1;
pub const OPERATION_TYPE_RENEW: u8 = 2;
pub const OPERATION_TYPE_REVOKE: u8 = 3;

// Permission Constants
pub const PERMISSION_MOVE: u8 = 0;
pub const PERMISSION_SPAWN: u8 = 1;
pub const PERMISSION_TRADE: u8 = 2;
pub const PERMISSION_ADMIN: u8 = 3;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_session_status_constants() {
        assert(SESSION_STATUS_ACTIVE == 0, 'Invalid active status');
        assert(SESSION_STATUS_EXPIRED == 1, 'Invalid expired status');
        assert(SESSION_STATUS_REVOKED == 2, 'Invalid revoked status');
        assert(SESSION_STATUS_SUSPENDED == 3, 'Invalid suspended status');
    }

    #[test]
    fn test_session_type_constants() {
        assert(SESSION_TYPE_BASIC == 0, 'Invalid basic type');
        assert(SESSION_TYPE_PREMIUM == 1, 'Invalid premium type');
        assert(SESSION_TYPE_ADMIN == 2, 'Invalid admin type');
    }

    #[test]
    fn test_operation_type_constants() {
        assert(OPERATION_TYPE_CREATE == 0, 'Invalid create operation');
        assert(OPERATION_TYPE_USE == 1, 'Invalid use operation');
        assert(OPERATION_TYPE_RENEW == 2, 'Invalid renew operation');
        assert(OPERATION_TYPE_REVOKE == 3, 'Invalid revoke operation');
    }
}
