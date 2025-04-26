use dojo::test_utils::spawn_test_world;
use dojo::world::IWorldDispatcher;
use starknet::ContractAddress;

use super::components::player_level::PlayerLevel;
use super::systems::player_level::IPlayerLevelDispatcher;
use super::systems::player_level::IPlayerLevelDispatcherTrait;

#[test]
fn test_player_leveling_system() {
    // Initialize world and systems
    let world = spawn_test_world();
    let player_id = 1;

    // Initialize player level
    let initial_player_level = PlayerLevel { 
        player_id, 
        experience: 0, 
        level: 0 
    };
    set!(world, (initial_player_level));

    // Deploy player level system
    let contract = IPlayerLevelDispatcher { contract_address: world.contract_address };

    // Test: Initial state
    let (exp, level) = contract.get_player_stats(player_id);
    assert(exp == 0, 'Initial exp should be 0');
    assert(level == 0, 'Initial level should be 0');

    // Test: Small experience gain (not enough to level up)
    let new_level = contract.grant_experience(player_id, 50);
    assert(new_level == 0, 'Should still be level 0');

    // Test: Level up to level 1
    let new_level = contract.grant_experience(player_id, 50); // Total: 100
    assert(new_level == 1, 'Should be level 1');

    // Test: Multiple level ups
    let new_level = contract.grant_experience(player_id, 200); // Total: 300
    assert(new_level == 3, 'Should be level 3');

    // Test: Final stats verification
    let (final_exp, final_level) = contract.get_player_stats(player_id);
    assert(final_exp == 300, 'Final exp should be 300');
    assert(final_level == 3, 'Final level should be 3');
}

#[test]
fn test_experience_thresholds() {
    // Initialize world and systems
    let world = spawn_test_world();
    let player_id = 1;

    // Initialize player level
    let initial_player_level = PlayerLevel { 
        player_id, 
        experience: 0, 
        level: 0 
    };
    set!(world, (initial_player_level));

    // Deploy player level system
    let contract = IPlayerLevelDispatcher { contract_address: world.contract_address };

    // Test level thresholds
    // Level 0: 0 exp
    // Level 1: 100 exp
    // Level 2: 150 exp
    // Level 3: 225 exp
    // Level 4: 337 exp

    // Test: Level 0 -> 1
    let level = contract.grant_experience(player_id, 100);
    assert(level == 1, 'Should reach level 1');

    // Test: Level 1 -> 2
    let level = contract.grant_experience(player_id, 50);
    assert(level == 2, 'Should reach level 2');

    // Test: Level 2 -> 3
    let level = contract.grant_experience(player_id, 75);
    assert(level == 3, 'Should reach level 3');

    // Verify final stats
    let (exp, level) = contract.get_player_stats(player_id);
    assert(exp == 225, 'Should have 225 exp');
    assert(level == 3, 'Should be level 3');
}