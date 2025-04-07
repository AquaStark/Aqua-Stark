#[starknet::interface]
trait IFishModel {
    fn update_age(days_passed: u32);
    fn get_details() -> (felt252, felt252, felt252, u32);
    fn get_id() -> felt252;
    fn get_name() -> felt252;
    fn get_species() -> felt252;
    fn get_age() -> u32;
    fn get_owner() -> starknet::ContractAddress;
}

#[starknet::contract]
pub mod FishModel {
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        id: felt252,
        name: felt252,
        species: felt252,
        age: u32, // Age in days
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        id: felt252,
        name: felt252,
        species: felt252,
        owner: ContractAddress,
    ) {
        self.id.write(id);
        self.name.write(name);
        self.species.write(species);
        self.age.write(0_u32);
        self.owner.write(owner);
    }

    #[external(v0)]
    fn update_age(ref self: ContractState, days_passed: u32) {
        assert_only_owner(@self);

        // Read the current age
        let current_age = self.age.read();
        // Add the days passed
        let new_age = current_age + days_passed;
        // Update the age in storage
        self.age.write(new_age);
    }

    #[external(v0)]
    fn get_details(self: @ContractState) -> (felt252, felt252, felt252, u32) {
        (self.id.read(), self.name.read(), self.species.read(), self.age.read())
    }

    #[external(v0)]
    fn get_id(self: @ContractState) -> felt252 {
        self.id.read()
    }

    #[external(v0)]
    fn get_name(self: @ContractState) -> felt252 {
        self.name.read()
    }

    #[external(v0)]
    fn get_species(self: @ContractState) -> felt252 {
        self.species.read()
    }

    #[external(v0)]
    fn get_age(self: @ContractState) -> u32 {
        self.age.read()
    }

    #[external(v0)]
    fn get_owner(self: @ContractState) -> ContractAddress {
        self.owner.read()
    }
}
