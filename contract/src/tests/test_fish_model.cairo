use core::option::OptionTrait;
use core::traits::TryInto;
use core::result::ResultTrait;
use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::testing::{set_caller_address, set_contract_address, set_block_timestamp};
use array::ArrayTrait;

// Import the Fish model for testing
use contract::models::fish_model::{FishModel, IFishModelDispatcher, IFishModelDispatcherTrait};

// Address constants for testing
fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn deploy_fish_model(
    id: felt252, name: felt252, species: felt252, owner: ContractAddress,
) -> (ContractAddress, IFishModelDispatcher) {
    // Set up constructor calldata with relevant arguments
    let mut calldata = ArrayTrait::new();
    calldata.append(id);
    calldata.append(name);
    calldata.append(species);
    calldata.append(owner.into());

    // Deploy the FishModel contract
    let (contract_address, _) = FishModel::deploy(@calldata).unwrap();
    (contract_address, IFishModelDispatcher { contract_address })
}

#[test]
fn test_fish_model_constructor() {
    // Deploy a new fish model
    let owner = OWNER();
    let (contract_address, fish_model) = deploy_fish_model('fish1', 'Nemo', 'Clownfish', owner);

    // Get fish details and verify
    let (id, name, species, hunger, growth, health, age) = fish_model.get_details();

    assert(id == 'fish1', 'Incorrect ID');
    assert(name == 'Nemo', 'Incorrect name');
    assert(species == 'Clownfish', 'Incorrect species');
    assert(hunger == 100, 'Incorrect hunger');
    assert(growth == 0, 'Incorrect growth');
    assert(health == 100, 'Incorrect health');
    assert(age == 0, 'Incorrect age');
}

#[test]
fn test_fish_model_getters() {
    // Deploy a new fish model
    let owner = OWNER();
    let (contract_address, fish_model) = deploy_fish_model('fish2', 'Dory', 'Blue Tang', owner);

    // Test all getter functions
    assert(fish_model.get_id() == 'fish2', 'get_id incorrect');
    assert(fish_model.get_name() == 'Dory', 'get_name incorrect');
    assert(fish_model.get_species() == 'Blue Tang', 'get_species incorrect');
    assert(fish_model.get_hunger() == 100, 'get_hunger incorrect');
    assert(fish_model.get_growth() == 0, 'get_growth incorrect');
    assert(fish_model.get_health() == 100, 'get_health incorrect');
    assert(fish_model.get_age() == 0, 'get_age incorrect');
    assert(fish_model.get_owner() == owner, 'get_owner incorrect');
    assert(!fish_model.is_dead(), 'is_dead should be false');
}
