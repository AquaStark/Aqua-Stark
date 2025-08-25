use aqua_stark::components::aquarium::{IAquariumStateDispatcher, IAquariumStateDispatcherTrait};
use aqua_stark::components::fish::{IFishStateDispatcher, IFishStateDispatcherTrait};
use aqua_stark::entities::aquarium::Aquarium;
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
fn test_aquarium_creation() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize AquariumState contract
    let (contract_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address };

    // Cretae Aquarium model instance and fetch from world state
    let aquarium_id = aquarium_system.create_aquarium(caller, 10_u32);
    assert(aquarium_id == 1_u64, 'Aquarium ID should be 1');

    // Verify aquarium initialization details
    let aquarium: Aquarium = world.read_model(aquarium_id);
    assert(aquarium.owner == caller, 'Aquarium owner should match');
    assert(aquarium.max_capacity == 10_u32, 'Aquarium capacity should match');
    assert(aquarium.cleanliness == 100_u32, 'Aquarium cleanliness != 100');
    assert(aquarium.housed_fish.len() == 0_u32, 'Aquarium should be empty');
}

#[test]
fn test_aquarium_fish_management() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize AquariumState and FishState contracts
    let (aquarium_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address: aquarium_address };

    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    // Create aquarium and fish instances
    let aquarium_id = aquarium_system.create_aquarium(caller, 3_u32);
    let fish_id = fish_system.create_fish(caller, 1_u32);

    // Test adding fish to aquarium
    let success = aquarium_system.add_fish(aquarium_id, fish_id);
    assert(success, 'Should add fish successfully');
    assert(aquarium_system.get_fish_count(aquarium_id) == 1_u32, 'Fish count should be 1');

    // Test removing fish from aquarium
    let success = aquarium_system.remove_fish(aquarium_id, fish_id);
    assert(success, 'Should remove fish successfully');
    assert(aquarium_system.get_fish_count(aquarium_id) == 0_u32, 'Fish count should be 0');
}

#[test]
#[should_panic(expected: ('AQUARIUM IS FULL', 'ENTRYPOINT_FAILED'))]
fn test_aquarium_capacity() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize AquariumState and FishState contracts
    let (aquarium_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address: aquarium_address };

    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    // Create aquarium with capacity of 2
    let aquarium_id = aquarium_system.create_aquarium(caller, 2_u32);

    // Create three fish instances
    let fish1_id = fish_system.create_fish(caller, 1_u32);
    let fish2_id = fish_system.create_fish(caller, 1_u32);
    let fish3_id = fish_system.create_fish(caller, 1_u32);

    // Add first two fish (should succeed)
    aquarium_system.add_fish(aquarium_id, fish1_id);
    aquarium_system.add_fish(aquarium_id, fish2_id);

    // Verify aquarium is full
    assert(aquarium_system.is_full(aquarium_id), 'Aquarium should be full');

    // Try to add third fish (should fail)
    let success = aquarium_system.add_fish(aquarium_id, fish3_id);
    assert(!success, 'Should not exceed capacity');
}

#[test]
fn test_aquarium_cleanliness() {
    // Initialize test environment with world and caller
    let mut world = setup();
    let caller = contract_address_const::<0x0>();

    // Initialize AquariumState contract
    let (aquarium_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address: aquarium_address };

    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    // Create aquarium instance
    let aquarium_id = aquarium_system.create_aquarium(caller, 3_u32);

    // Create two fish instances
    let fish1_id = fish_system.create_fish(caller, 1_u32);
    let fish2_id = fish_system.create_fish(caller, 1_u32);

    // Populate aquarium with fishes
    aquarium_system.add_fish(aquarium_id, fish1_id);
    aquarium_system.add_fish(aquarium_id, fish2_id);

    // Test cleaning functionality
    aquarium_system.clean(aquarium_id, 30_u32);
    assert(aquarium_system.get_cleanliness(aquarium_id) == 100_u32, 'Cleanliness should be at max');

    // Test cleanliness degradation over time
    aquarium_system.update_cleanliness(aquarium_id, 10_u32);
    assert(aquarium_system.get_cleanliness(aquarium_id) == 90_u32, 'Should be 10 after 10 hours');
}

#[test]
#[should_panic(expected: ('CALLER NOT OWNER', 'ENTRYPOINT_FAILED'))]
fn test_unauthorized_access() {
    // Initialize test environment with world and different users
    let mut world = setup();
    let owner = contract_address_const::<0x1>();
    let user = contract_address_const::<0x2>();

    // Initialize AquariumState contract
    let (contract_address, _) = world.dns(@"AquariumState").unwrap();
    let aquarium_system = IAquariumStateDispatcher { contract_address };

    // Create aquarium as owner
    testing::set_contract_address(owner);
    let aquarium_id = aquarium_system.create_aquarium(owner, 3_u32);

    // Try to clean aquarium as non-owner (should panic)
    testing::set_contract_address(user);
    aquarium_system.clean(aquarium_id, 10_u32);
}

#[test]
fn test_aquarium_start() {
    
}
