use aqua_stark::components::aquarium::{IAquariumStateDispatcher, IAquariumStateDispatcherTrait};
use aqua_stark::components::fish::{IFishStateDispatcher, IFishStateDispatcherTrait};
use aqua_stark::entities::fish::Fish;
use aqua_stark::tests::test_utils::setup;
use dojo::model::ModelStorage;
use dojo::world::WorldStorageTrait;
use starknet::{ContractAddress, contract_address_const, testing};

fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'user'>()
}

#[test]
fn test_fish_creation() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create Fish model instance and fetch from world state
    let fish_id = fish_system.create_fish(caller, 1_u32);
    assert(fish_id == 1_u64, 'Fish ID should be 1');

    // Verify fish initialization details
    let fish: Fish = world.read_model(fish_id);
    assert(fish.owner == caller, 'Fish owner should match');
    assert(fish.fish_type == 1_u32, 'Fish type should match');
    assert(fish.age == 0_u32, 'Initial age should be 0');
    assert(fish.hunger_level == 100_u32, 'Initial hunger should be 100');
    assert(fish.health == 100_u32, 'Initial health should be 100');
    assert(fish.growth == 0_u32, 'Initial growth should be 0');
}

#[test]
fn test_fish_feeding() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create fish instance
    let fish_id = fish_system.create_fish(caller, 1_u32);

    // Test feeding functionality
    fish_system.feed(fish_id, 30_u32);
    assert(fish_system.get_hunger_level(fish_id) == 70_u32, 'Hunger should decrease');

    // Test update hunger over time
    fish_system.update_hunger(fish_id, 10_u32);
    assert(fish_system.get_hunger_level(fish_id) == 50_u32, 'Hunger should decrease');
}

#[test]
fn test_fish_growth() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create fish instance
    let fish_id = fish_system.create_fish(caller, 1_u32);

    // Test growth functionality
    fish_system.grow(fish_id, 30_u32);
    assert(fish_system.get_growth_rate(fish_id) == 30_u32, 'Growth should increase by 30');

    // Test max growth cap
    fish_system.grow(fish_id, 80_u32);
    assert(fish_system.get_growth_rate(fish_id) == 100_u32, 'Growth should be capped at 100');
}

#[test]
fn test_fish_health() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create fish instance
    let fish_id = fish_system.create_fish(caller, 1_u32);

    // Test damage functionality
    fish_system.damage(fish_id, 30_u32);
    assert(fish_system.get_health(fish_id) == 70_u32, 'Health should decrease by 30');

    // Test healing functionality
    fish_system.heal(fish_id, 20_u32);
    assert(fish_system.get_health(fish_id) == 90_u32, 'Health should increase by 20');

    // Test death (health reaching 0)
    fish_system.damage(fish_id, 100_u32);
    assert(fish_system.get_health(fish_id) == 0_u32, 'Health should be 0 after damage');
}

#[test]
fn test_fish_regeneration() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState and AquariumState contracts
    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    let (aquarium_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address: aquarium_address };

    // Create fish and damage it
    let fish_id = fish_system.create_fish(caller, 1_u32);
    fish_system.damage(fish_id, 30_u32);
    let damaged_health = fish_system.get_health(fish_id);

    // Create clean aquarium (cleanliness > 80%)
    let aquarium_id = aquarium_system.create_aquarium(caller, 3_u32);
    let aquarium_cleanliness = aquarium_system.get_cleanliness(aquarium_id);

    // Test health regeneration in clean water
    fish_system.regenerate_health(fish_id, aquarium_cleanliness);
    let regenerated_health = fish_system.get_health(fish_id);

    assert(regenerated_health > damaged_health, 'Fish should regen in clean env');
}

#[test]
fn test_fish_age() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create fish instance
    let fish_id = fish_system.create_fish(caller, 1_u32);

    // Test age update
    fish_system.update_age(fish_id, 5_u32);

    // Verify fish age
    let fish: Fish = world.read_model(fish_id);
    assert(fish.age == 5_u32, 'Fish age should be 5 days');
}

#[test]
#[should_panic(expected: ('CALLER NOT OWNER', 'ENTRYPOINT_FAILED'))]
fn test_unauthorized_access() {
    // Initialize test environment with world and different users
    let mut world = setup();
    let owner = contract_address_const::<0x1>();
    let user = contract_address_const::<0x2>();

    // Initialize FishState contract
    let (contract_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address };

    // Create fish as owner
    testing::set_contract_address(owner);
    let fish_id = fish_system.create_fish(owner, 1_u32);

    // Try to feed fish as non-owner (should panic)
    testing::set_contract_address(user);
    fish_system.feed(fish_id, 10_u32);
}
