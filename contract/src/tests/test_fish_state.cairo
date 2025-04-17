use core::option::OptionTrait;
use core::traits::TryInto;
use core::result::ResultTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::testing::{set_caller_address, set_contract_address};
use array::ArrayTrait;

// Import the components and models for testing
use contract::components::fish_state::{FishState, IFishStateDispatcher, IFishStateDispatcherTrait};
use contract::models::fish_model::{FishModel, IFishModelDispatcher, IFishModelDispatcherTrait};

// Address constants for testing
fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'user'>()
}

// Helper functions for deployment
fn deploy_fish_model(
    id: felt252, name: felt252, species: felt252, owner: ContractAddress,
) -> (ContractAddress, IFishModelDispatcher) {
    let mut calldata = ArrayTrait::new();
    calldata.append(id);
    calldata.append(name);
    calldata.append(species);
    calldata.append(owner.into());

    let (contract_address, _) = FishModel::deploy(@calldata).unwrap();
    (contract_address, IFishModelDispatcher { contract_address })
}

fn deploy_fish_state(
    model_address: ContractAddress, owner: ContractAddress,
) -> (ContractAddress, IFishStateDispatcher) {
    let mut calldata = ArrayTrait::new();
    calldata.append(model_address.into());
    calldata.append(owner.into());

    let (contract_address, _) = FishState::deploy(@calldata).unwrap();
    (contract_address, IFishStateDispatcher { contract_address })
}

#[test]
fn test_fish_state_construction() {
    // Deploy a fish model
    let owner = OWNER();
    let (model_address, _) = deploy_fish_model('fish1', 'Nemo', 'Clownfish', owner);

    // Deploy a fish component that uses this model
    let (component_address, fish_state) = deploy_fish_state(model_address, owner);

    // Verify component is linked to the model
    assert(fish_state.get_model() == model_address, 'Model address mismatch');
}

#[test]
#[should_panic(expected: 'Not the owner')]
fn test_unauthorized_access() {
    // Deploy a fish model
    let owner = OWNER();
    let user = USER();
    let (model_address, _) = deploy_fish_model('fish1', 'Nemo', 'Clownfish', owner);

    // Deploy a fish component that uses this model
    let (component_address, fish_state) = deploy_fish_state(model_address, owner);

    // Try to call a restricted function as non-owner
    set_caller_address(user);
    fish_state.feed(10);
}
