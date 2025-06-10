use aqua_stark::components::experience::{
    IPlayerExperienceDispatcher, IPlayerExperienceDispatcherTrait,
};
use aqua_stark::components::playerstate::{IPlayerStateDispatcher, IPlayerStateDispatcherTrait};
use aqua_stark::entities::player::Player;
use aqua_stark::tests::test_utils::setup;
use dojo::model::ModelStorage;
use dojo::world::WorldStorageTrait;
use starknet::{ContractAddress, contract_address_const, testing};

fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn PLAYER1() -> ContractAddress {
    contract_address_const::<'player1'>()
}

fn USERNAME1() -> felt252 {
    'username1'
}

fn PLAYER2() -> ContractAddress {
    contract_address_const::<'player2'>()
}
fn USERNAME2() -> felt252 {
    'username2'
}

fn GRANTER() -> ContractAddress {
    contract_address_const::<'granter'>()
}

fn setup_experience_system() -> (
    dojo::world::WorldStorage, IPlayerExperienceDispatcher, IPlayerStateDispatcher,
) {
    let mut world = setup();

    // Deploy experience contract
    let (exp_address, _) = world.dns(@"PlayerExperience").unwrap();
    let experience_system = IPlayerExperienceDispatcher { contract_address: exp_address };

    // Deploy player state contract
    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_system = IPlayerStateDispatcher { contract_address: player_address };

    (world, experience_system, player_system)
}

#[test]
fn test_experience_thresholds() {
    let (world, experience_system, _) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Test level thresholds
    assert(experience_system.get_experience_threshold(1) == 0, 'Level 1 should be 0 XP');
    assert(experience_system.get_experience_threshold(2) == 100, 'Level 2 should be 100 XP');
    assert(experience_system.get_experience_threshold(3) == 250, 'Level 3 should be 250 XP');

    // Test level calculation
    assert(experience_system.calculate_level_from_experience(0) == 1, 'Should be level 1');
    assert(experience_system.calculate_level_from_experience(50) == 1, 'Should be level 1');
    assert(experience_system.calculate_level_from_experience(100) == 2, 'Should be level 2');
    assert(experience_system.calculate_level_from_experience(200) == 2, 'Should be level 2');
    assert(experience_system.calculate_level_from_experience(250) == 3, 'Should be level 3');
}

#[test]
fn test_grant_experience() {
    let (mut world, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register a player
    let player_id = player_system.register(PLAYER1(), USERNAME1());
    assert(player_id == 1, 'Player ID should be 1');

    // Grant experience as owner (should work)
    experience_system.grant_experience(PLAYER1(), 150);

    // Check player data
    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 150, 'Experience should be 150');
    assert(player.level == 2, 'Should be level 2');

    // Grant more experience
    experience_system.grant_experience(PLAYER1(), 100);

    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 250, 'Experience should be 250');
    assert(player.level == 3, 'Should be level 3');
}

#[test]
#[should_panic(expected: ('PLAYER_NOT_REGISTERED', 'ENTRYPOINT_FAILED'))]
fn test_grant_experience_unregistered_player() {
    let (_, experience_system, _) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Try to grant experience to unregistered player
    experience_system.grant_experience(PLAYER1(), 100);
}

#[test]
#[should_panic(expected: ('UNAUTHORIZED_EXPERIENCE_GRANT', 'ENTRYPOINT_FAILED'))]
fn test_unauthorized_experience_grant() {
    let (_, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register a player
    player_system.register(PLAYER1(), USERNAME1());

    // Try to grant experience as unauthorized user
    testing::set_contract_address(PLAYER2());
    experience_system.grant_experience(PLAYER1(), 100);
}

#[test]
fn test_authorized_granter() {
    let (mut world, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register a player
    player_system.register(PLAYER1(), USERNAME1());

    // Add authorized granter
    experience_system.add_experience_granter(GRANTER());

    // Grant experience as authorized granter
    testing::set_contract_address(GRANTER());
    experience_system.grant_experience(PLAYER1(), 100);

    // Check player data
    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 100, 'Experience should be 100');
    assert(player.level == 2, 'Should be level 2');
}

#[test]
fn test_remove_granter() {
    let (_, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register a player and add granter
    player_system.register(PLAYER1(), USERNAME1());
    experience_system.add_experience_granter(GRANTER());

    // Remove granter
    experience_system.remove_experience_granter(GRANTER());

    // Try to grant experience as removed granter (should fail)
    testing::set_contract_address(GRANTER());
    let result = std::panic::catch_unwind(
        || {
            experience_system.grant_experience(PLAYER1(), 100);
        },
    );
    assert(result.is_err(), 'Should fail after removal');
}

#[test]
fn test_level_progress() {
    let (_, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register and give experience to player
    player_system.register(PLAYER1(), USERNAME1());
    experience_system.grant_experience(PLAYER1(), 120); // Level 2 with 20 extra XP

    let (current_exp_in_level, exp_needed_for_next) = experience_system
        .get_level_progress(PLAYER1());
    assert(current_exp_in_level == 20, 'Should have 20 XP in current level');
    assert(exp_needed_for_next == 130, 'Should need 130 XP for next level');
}

#[test]
fn test_max_level() {
    let (mut world, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register player
    player_system.register(PLAYER1(), USERNAME1());

    // Grant massive experience to reach max level
    experience_system.grant_experience(PLAYER1(), 1000000);

    let player: Player = world.read_model(PLAYER1());
    assert(player.level <= 100, 'Should not exceed max level');

    // Test max level progress
    let (current_exp_in_level, exp_needed_for_next) = experience_system
        .get_level_progress(PLAYER1());
    if player.level == 100 {
        assert(current_exp_in_level == 0, 'Max level should have 0 progress');
        assert(exp_needed_for_next == 0, 'Max level should need 0 XP');
    }
}

#[test]
fn test_query_functions() {
    let (_, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register and give experience to player
    player_system.register(PLAYER1(), USERNAME1());
    experience_system.grant_experience(PLAYER1(), 180);

    // Test query functions
    assert(experience_system.get_player_level(PLAYER1()) == 2, 'Should be level 2');
    assert(experience_system.get_player_experience(PLAYER1()) == 180, 'Should have 180 XP');
    assert(
        experience_system.get_experience_for_next_level(PLAYER1()) == 250, 'Next level at 250 XP',
    );
}

#[test]
fn test_multiple_experience_grants() {
    let (mut world, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register player
    player_system.register(PLAYER1(), USERNAME1());

    // Grant experience in small increments
    experience_system.grant_experience(PLAYER1(), 25);
    experience_system.grant_experience(PLAYER1(), 25);
    experience_system.grant_experience(PLAYER1(), 25);
    experience_system.grant_experience(PLAYER1(), 25);

    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 100, 'Should have 100 total XP');
    assert(player.level == 2, 'Should be level 2');

    // Grant more to trigger another level up
    experience_system.grant_experience(PLAYER1(), 150);

    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 250, 'Should have 250 total XP');
    assert(player.level == 3, 'Should be level 3');
}

#[test]
fn test_experience_integration_ready() {
    let (_, experience_system, player_system) = setup_experience_system();
    testing::set_contract_address(OWNER());

    // Register player
    player_system.register(PLAYER1(), USERNAME1());

    // Test that system is ready for external integration
    assert(experience_system.can_grant_experience(OWNER()), 'Owner should be able to grant');

    // Add multiple granters (simulating different game systems)
    let fish_system = contract_address_const::<'fish_system'>();
    let quest_system = contract_address_const::<'quest_system'>();
    let achievement_system = contract_address_const::<'achievement_system'>();

    experience_system.add_experience_granter(fish_system);
    experience_system.add_experience_granter(quest_system);
    experience_system.add_experience_granter(achievement_system);

    assert(experience_system.can_grant_experience(fish_system), 'Fish system should be authorized');
    assert(
        experience_system.can_grant_experience(quest_system), 'Quest system should be authorized',
    );
    assert(
        experience_system.can_grant_experience(achievement_system),
        'Achievement system should be authorized',
    );
}
