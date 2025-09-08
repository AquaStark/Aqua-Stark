use aqua_stark::components::experience::{
    IPlayerExperienceDispatcher, IPlayerExperienceDispatcherTrait,
};
use aqua_stark::components::fish::{IFishStateDispatcher, IFishStateDispatcherTrait};
use aqua_stark::components::playerstate::{IPlayerStateDispatcher, IPlayerStateDispatcherTrait};
use aqua_stark::entities::player::Player;
use aqua_stark::tests::test_utils::setup;
use dojo::model::ModelStorage;
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

fn FISH_SYSTEM() -> ContractAddress {
    contract_address_const::<'fish_system'>()
}

#[test]
fn test_full_integration_experience_system() {
    let mut world = setup();
    testing::set_contract_address(OWNER());

    // Initialize all systems
    let (exp_address, _) = world.dns(@"PlayerExperience").unwrap();
    let experience_system = IPlayerExperienceDispatcher { contract_address: exp_address };

    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_system = IPlayerStateDispatcher { contract_address: player_address };

    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    // 1. Register a player
    let player_id = player_system.register(PLAYER1(), USERNAME1());
    assert(player_id == 1, 'Player should be registered');

    // 2. Add fish system as experience granter (simulating game integration)
    experience_system.add_experience_granter(FISH_SYSTEM());

    // 3. Simulate fish-related experience gains
    testing::set_contract_address(FISH_SYSTEM());

    // Creating a fish grants 50 XP
    experience_system.grant_experience(PLAYER1(), 50);

    // Feeding fish grants 10 XP
    experience_system.grant_experience(PLAYER1(), 10);

    // Fish growing grants 25 XP
    experience_system.grant_experience(PLAYER1(), 25);

    // Fish breeding grants 100 XP
    experience_system.grant_experience(PLAYER1(), 100);

    // 4. Check final player state
    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 185, 'Should have 185 total XP');
    assert(player.level == 2, 'Should be level 2');

    // 5. Check progression data
    let (current_exp_in_level, exp_needed_for_next) = experience_system
        .get_level_progress(PLAYER1());
    assert(current_exp_in_level == 85, 'Should have 85 XP in current level');
    assert(exp_needed_for_next == 65, 'Should need 65 XP for next level');

    // 6. Grant enough XP to reach level 3
    experience_system.grant_experience(PLAYER1(), 65);

    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 250, 'Should have 250 total XP');
    assert(player.level == 3, 'Should be level 3');
}

#[test]
fn test_multiple_system_integration() {
    let mut world = setup();
    testing::set_contract_address(OWNER());

    // Initialize systems
    let (exp_address, _) = world.dns(@"PlayerExperience").unwrap();
    let experience_system = IPlayerExperienceDispatcher { contract_address: exp_address };

    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_system = IPlayerStateDispatcher { contract_address: player_address };

    // Register player
    player_system.register(PLAYER1(), USERNAME1());

    // Add multiple experience granters (simulating different game systems)
    let quest_system = contract_address_const::<'quest_system'>();
    let achievement_system = contract_address_const::<'achievement_system'>();
    let auction_system = contract_address_const::<'auction_system'>();

    experience_system.add_experience_granter(quest_system);
    experience_system.add_experience_granter(achievement_system);
    experience_system.add_experience_granter(auction_system);

    // Grant experience from different systems
    testing::set_contract_address(quest_system);
    experience_system.grant_experience(PLAYER1(), 75); // Quest completion

    testing::set_contract_address(achievement_system);
    experience_system.grant_experience(PLAYER1(), 50); // Achievement unlock

    testing::set_contract_address(auction_system);
    experience_system.grant_experience(PLAYER1(), 25); // Successful auction

    // Check total experience
    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 150, 'Should have 150 total XP from all systems');
    assert(player.level == 2, 'Should be level 2');
}

#[test]
fn test_level_progression_realistic_scenario() {
    let mut world = setup();
    testing::set_contract_address(OWNER());

    let (exp_address, _) = world.dns(@"PlayerExperience").unwrap();
    let experience_system = IPlayerExperienceDispatcher { contract_address: exp_address };

    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_system = IPlayerStateDispatcher { contract_address: player_address };

    // Register player
    player_system.register(PLAYER1(), USERNAME1());

    // Simulate realistic gameplay progression
    let mut total_exp = 0_u64;
    let mut expected_level = 1_u32;

    // Early game activities (small XP gains)
    let activities = array![
        10,
        15,
        20,
        25,
        30, // Basic activities: 100 XP total -> Level 2
        35,
        40,
        45,
        50,
        55, // More activities: 225 XP total -> Level 3
        60,
        65,
        70,
        75,
        80 // Advanced activities
    ];

    let mut i = 0;
    loop {
        if i >= activities.len() {
            break;
        }

        let exp_gain = *activities.at(i);
        experience_system.grant_experience(PLAYER1(), exp_gain.into());
        total_exp += exp_gain.into();

        let current_level = experience_system.get_player_level(PLAYER1());
        let current_exp = experience_system.get_player_experience(PLAYER1());

        assert(current_exp == total_exp, 'Experience should accumulate correctly');

        i += 1;
    }

    // Final checks
    let player: Player = world.read_model(PLAYER1());
    assert(player.experience == 875, 'Should have 875 total XP');
    assert(player.level >= 3, 'Should be at least level 3');

    // Verify query functions work correctly
    assert(
        experience_system.get_player_experience(PLAYER1()) == 875, 'Query should return correct XP',
    );
    assert(
        experience_system.get_player_level(PLAYER1()) == player.level,
        'Query should return correct level',
    );
}
