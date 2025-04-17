use core::option::OptionTrait;
use core::traits::TryInto;
use core::result::ResultTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::testing::{set_caller_address, set_contract_address};
use array::ArrayTrait;

// Import the Aquarium model for testing
use contract::models::aquarium_model::{
    AquariumModel, IAquariumModelDispatcher, IAquariumModelDispatcherTrait,
};

// Address constants for testing
fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn deploy_aquarium_model(
    id: felt252, name: felt252, capacity: u32, owner: ContractAddress,
) -> (ContractAddress, IAquariumModelDispatcher) {
    // Set up constructor calldata with relevant arguments
    let mut calldata = ArrayTrait::new();
    calldata.append(id);
    calldata.append(name);
    calldata.append(capacity.into());
    calldata.append(owner.into());

    // Deploy the AquariumModel contract
    let (contract_address, _) = AquariumModel::deploy(@calldata).unwrap();
    (contract_address, IAquariumModelDispatcher { contract_address })
}

#[test]
fn test_aquarium_model_constructor() {
    // Deploy a new aquarium model
    let owner = OWNER();
    let (contract_address, aquarium_model) = deploy_aquarium_model('aqua1', 'Reef Tank', 3, owner);

    // Get aquarium details and verify
    let (id, name, cleanliness, capacity, fish_count) = aquarium_model.get_details();

    assert(id == 'aqua1', 'Incorrect ID');
    assert(name == 'Reef Tank', 'Incorrect name');
    assert(cleanliness == 100, 'Incorrect cleanliness');
    assert(capacity == 3, 'Incorrect capacity');
    assert(fish_count == 0, 'Incorrect fish count');
}

#[test]
fn test_aquarium_model_getters() {
    // Deploy a new aquarium model
    let owner = OWNER();
    let (contract_address, aquarium_model) = deploy_aquarium_model(
        'aqua2', 'Tropical Tank', 5, owner,
    );

    // Test all getter functions
    assert(aquarium_model.get_id() == 'aqua2', 'get_id incorrect');
    assert(aquarium_model.get_name() == 'Tropical Tank', 'get_name incorrect');
    assert(aquarium_model.get_cleanliness() == 100, 'get_cleanliness incorrect');
    assert(aquarium_model.get_capacity() == 5, 'get_capacity incorrect');
    assert(aquarium_model.get_fish_count() == 0, 'get_fish_count incorrect');
    assert(aquarium_model.get_owner() == owner, 'get_owner incorrect');
    assert(!aquarium_model.is_full(), 'is_full should be false');
}
