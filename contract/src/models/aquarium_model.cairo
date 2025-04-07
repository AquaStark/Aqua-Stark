use starknet::ContractAddress;

#[starknet::interface]
trait IAquariumModel {
    fn get_details() -> (felt252, felt252);
    fn get_id() -> felt252;
    fn get_name() -> felt252;
    fn get_fish(fish_id: felt252) -> ContractAddress;
    fn get_owner() -> ContractAddress;
}

#[starknet::contract]
pub mod AquariumModel {
    use starknet::{
        ContractAddress, get_caller_address,
        storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess},
    };

    #[storage]
    struct Storage {
        id: felt252,
        name: felt252,
        fish: Map<felt252, ContractAddress>,
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, id: felt252, name: felt252, capacity: u32, owner: ContractAddress,
    ) {
        self.id.write(id);
        self.name.write(name);
        self.cleanliness.write(100_u32);
        self.capacity.write(capacity);
        self.fish_count.write(0_u32);
        self.owner.write(owner);
    }

    #[external(v0)]
    fn get_details(self: @ContractState) -> (felt252, felt252) {
        (
            self.id.read(),
            self.name.read(),
            self.cleanliness.read(),
            self.capacity.read(),
            self.fish_count.read(),
        )
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
    fn get_fish(self: @ContractState, fish_id: felt252) -> ContractAddress {
        self.fish.read(fish_id)
    }

    #[external(v0)]
    fn get_owner(self: @ContractState) -> ContractAddress {
        self.owner.read()
    }
}
