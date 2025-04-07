use core::option::OptionTrait;
use core::traits::TryInto;
use core::result::ResultTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::testing::{set_caller_address, set_contract_address};
use array::ArrayTrait;

// Import the components and models for testing
use contract::components::aquarium_state::{
    AquariumState, IAquariumStateDispatcher, IAquariumStateDispatcherTrait,
};
use contract::models::aquarium_model::{
    AquariumModel, IAquariumModelDispatcher, IAquariumModelDispatcherTrait,
};

// Address constants for testing
fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'user'>()
}

// Helper functions for deployment
fn deploy_aquarium_model(
    id: felt252, name: felt252, capacity: u32, owner: ContractAddress,
) -> (ContractAddress, IAquariumModelDispatcher) {
    let mut calldata = ArrayTrait::new();
    calldata.append(id);
    calldata.append(name);
    calldata.append(capacity.into());
    calldata.append(owner.into());

    let (contract_address, _) = AquariumModel::deploy(@calldata).unwrap();
    (contract_address, IAquariumModelDispatcher { contract_address })
}

fn deploy_aquarium_state(
    model_address: ContractAddress, owner: ContractAddress,
) -> (ContractAddress, IAquariumStateDispatcher) {
    let mut calldata = ArrayTrait::new();
    calldata.append(model_address.into());
    calldata.append(owner.into());

    let (contract_address, _) = AquariumState::deploy(@calldata).unwrap();
    (contract_address, IAquariumStateDispatcher { contract_address })
}

#[test]
fn test_aquarium_state_construction() {
    // Deploy an aquarium model
    let owner = OWNER();
    let (model_address, _) = deploy_aquarium_model('aqua1', 'Reef Tank', 3, owner);

    // Deploy an aquarium component that uses this model
    let (component_address, aquarium_state) = deploy_aquarium_state(model_address, owner);

    // Verify component is linked to the model
    assert(aquarium_state.get_model() == model_address, 'Model address mismatch');
}

#[test]
#[should_panic(expected: 'Not the owner')]
fn test_unauthorized_access() {
    // Deploy an aquarium model
    let owner = OWNER();
    let user = USER();
    let (model_address, _) = deploy_aquarium_model('aqua1', 'Reef Tank', 3, owner);

    // Deploy an aquarium component that uses this model
    let (component_address, aquarium_state) = deploy_aquarium_state(model_address, owner);

    // Try to call a restricted function as non-owner
    set_caller_address(user);
    aquarium_state.clean(10);
}
