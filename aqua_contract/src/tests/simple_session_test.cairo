use aqua_stark::models::session::{
    SessionKey, SessionAnalytics, SessionOperation, SESSION_STATUS_ACTIVE, SESSION_STATUS_EXPIRED,
    SESSION_STATUS_REVOKED, SESSION_TYPE_BASIC, SESSION_TYPE_PREMIUM, SESSION_TYPE_ADMIN,
    PERMISSION_MOVE, PERMISSION_SPAWN, PERMISSION_TRADE, PERMISSION_ADMIN,
};
use starknet::{ContractAddress, contract_address_const};

#[test]
fn test_session_system_complete() {
    // Test 1: Session Creation
    let session_id: felt252 = 123;
    let player: ContractAddress = contract_address_const::<'player'>();

    let session = SessionKey {
        session_id,
        player_address: player,
        created_at: 1000,
        expires_at: 2000,
        last_used: 1000,
        max_transactions: 100,
        used_transactions: 0,
        status: SESSION_STATUS_ACTIVE,
        is_valid: true,
        auto_renewal_enabled: true,
        session_type: SESSION_TYPE_BASIC,
        permissions: array![PERMISSION_MOVE, PERMISSION_SPAWN],
    };

    assert(session.session_id == 123, 'Session ID should match');
    assert(session.player_address == player, 'Player should match');
    assert(session.status == SESSION_STATUS_ACTIVE, 'Should be active');
    assert(session.is_valid, 'Should be valid');
    assert(session.used_transactions == 0, 'Start with 0 tx');

    // Test 2: Session Analytics
    let analytics = SessionAnalytics {
        session_id,
        total_transactions: 0,
        successful_transactions: 0,
        failed_transactions: 0,
        total_gas_used: 0,
        average_gas_per_tx: 0,
        last_activity: 1000,
        created_at: 1000,
    };

    assert(analytics.session_id == session_id, 'Analytics ID match');
    assert(analytics.total_transactions == 0, 'Start with 0 total tx');

    // Test 3: Session Operation
    let operation = SessionOperation {
        session_id,
        operation_id: 456,
        operation_type: 0, // CREATE
        timestamp: 1000,
        gas_used: 50000,
        success: true,
        error_code: Option::None,
    };

    assert(operation.session_id == session_id, 'Operation ID match');
    assert(operation.success, 'Operation should be successful');

    // Test 4: Constants Validation
    assert(SESSION_STATUS_ACTIVE == 0, 'Active status should be 0');
    assert(SESSION_STATUS_EXPIRED == 1, 'Expired status should be 1');
    assert(SESSION_STATUS_REVOKED == 2, 'Revoked status should be 2');

    assert(SESSION_TYPE_BASIC == 0, 'Basic type should be 0');
    assert(SESSION_TYPE_PREMIUM == 1, 'Premium type should be 1');
    assert(SESSION_TYPE_ADMIN == 2, 'Admin type should be 2');

    assert(PERMISSION_MOVE == 0, 'Move permission should be 0');
    assert(PERMISSION_SPAWN == 1, 'Spawn permission should be 1');
    assert(PERMISSION_TRADE == 2, 'Trade permission should be 2');
    assert(PERMISSION_ADMIN == 3, 'Admin permission should be 3');

    // Test 5: Session Validation Logic
    let current_time = 1500;
    let is_expired = current_time >= session.expires_at;
    assert(!is_expired, 'Not expired at 1500');

    let has_transactions_left = session.used_transactions < session.max_transactions;
    assert(has_transactions_left, 'Has tx left');

    let is_active = session.status == SESSION_STATUS_ACTIVE && session.is_valid;
    assert(is_active, 'Active and valid');
}
