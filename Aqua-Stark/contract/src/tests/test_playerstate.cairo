use aqua_stark::components::playerstate::IPlayerStateDispatcherTrait;
use aqua_stark::entities::player::Player;
use aqua_stark::tests::test_utils::initialize_player_contacts;
use dojo::model::ModelStorage;
use starknet::{ContractAddress, contract_address_const, testing};


fn PLAYER1() -> ContractAddress {
    contract_address_const::<'player1'>()
}

fn USERNAME1() -> felt252 {
    'username1'
}

fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0>()
}


#[test]
fn test_register_player_success() {
    let (mut world, player_registry) = initialize_player_contacts();

    testing::set_contract_address(PLAYER1());

    let player_id = player_registry.register(PLAYER1(), USERNAME1());
    assert(player_id == 1_u64, 'Player_ID_1');

    let player: Player = world.read_model(PLAYER1());
    assert(player.wallet == PLAYER1(), 'Wallet_should_match');
    assert(player.id == player_id, 'ID_should_match');
    assert(player.is_verified == false, 'Player_should_not_verified');
    assert(player.registered_at > 0, 'Registered_time_set');
    assert(player.experience == 0, 'Initial_experience_should_be_0');
    assert(player.level == 1, 'Initial_level_should_be_1');
}


#[test]
#[should_panic(expected: ('ALREADY_REGISTERED', 'ENTRYPOINT_FAILED'))]
fn test_register_player_fails_if_already_registered() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    let _ = player_registry.register(PLAYER1(), USERNAME1());
    let _ = player_registry.register(PLAYER1(), USERNAME1());
}

#[test]
fn test_is_player_registered() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    assert(player_registry.is_player_registered(PLAYER1()) == false, 'Should_not_registered_yet');
    let _ = player_registry.register(PLAYER1(), USERNAME1());
    assert(player_registry.is_player_registered(PLAYER1()) == true, 'Should_registered_after_call');
}

#[test]
fn test_get_player_id() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    let player_id = player_registry.register(PLAYER1(), USERNAME1());
    let fetched_id = player_registry.get_player_id(PLAYER1());
    assert(fetched_id == player_id, 'Fetched_ID_should_match_ID');
}

#[test]
fn test_is_player_verified_flag() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    let _ = player_registry.register(PLAYER1(), USERNAME1());
    let verified = player_registry.is_player_verified(PLAYER1());
    assert(verified == false, 'player_not_verified');
}

#[test]
fn test_verifing_player_flag() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    let _ = player_registry.register(PLAYER1(), USERNAME1());
    let status = player_registry.is_player_verified(PLAYER1());
    assert(status == false, 'player_not_verified');
    let verified = player_registry.verify_player(PLAYER1());
    assert(verified == true, 'player_is_verified');
}

#[test]
fn test_get_player_data() {
    let (_, player_registry) = initialize_player_contacts();
    testing::set_contract_address(PLAYER1());

    let player_id = player_registry.register(PLAYER1(), USERNAME1());
    let (id, experience, level, is_verified) = player_registry.get_player_data(PLAYER1());

    assert(id == player_id, 'ID_should_match');
    assert(experience == 0, 'Initial_experience_should_be_0');
    assert(level == 1, 'Initial_level_should_be_1');
    assert(is_verified == false, 'Should_not_be_verified');
}
