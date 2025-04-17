use contract::models::aquarium_model::{IAquariumModelDispatcher, IAquariumModelDispatcherTrait};
use contract::components::fish_state::{IFishStateDispatcher, IFishStateDispatcherTrait};
use starknet::ContractAddress;

#[starknet::interface]
trait IAquariumState {
    fn add_fish(fish_id: felt252, fish_state_address: starknet::ContractAddress) -> bool;
    fn remove_fish(fish_id: felt252) -> bool;
    fn clean(amount: u32);
    fn update_cleanliness(hours_passed: u32);
    fn damage_fish_in_dirty_water(fish_ids: Array<felt252>, hours_passed: u32);
    fn remove_dead(fish_ids: Array<felt252>) -> u32;
    fn get_cleanliness() -> u32;
    fn get_capacity() -> u32;
    fn get_fish_count() -> u32;
    fn get_model() -> ContractAddress;
    fn is_full() -> bool;
}

#[starknet::contract]
mod AquariumState {
    use starknet::{ContractAddress, get_caller_address};
    use contract::models::aquarium_model::{IAquariumModelDispatcher, IAquariumModelDispatcherTrait};
    use contract::components::fish_state::{IFishStateDispatcher, IFishStateDispatcherTrait};
    use core::array::ArrayTrait;
    use core::traits::Into;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use core::result::ResultTrait;
    use core::hash::{Hash, HashStateTrait};
    use core::dictionaries::Felt252DictTrait;

    #[storage]
    struct Storage {
        model_address: ContractAddress,
        owner: ContractAddress,
        cleanliness: u32, // 0-100, where 0 is very dirty and 100 is perfectly clean
        capacity: u32, // Maximum number of fish
        fish_count: u32 // Current number of fish
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        FishAdded: FishAdded,
        FishRemoved: FishRemoved,
        AquariumCleaned: AquariumCleaned,
        CleanlinessUpdated: CleanlinessUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct FishAdded {
        fish_id: felt252,
        fish_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct FishRemoved {
        fish_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct AquariumCleaned {
        amount: u32,
        new_cleanliness: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct CleanlinessUpdated {
        hours_passed: u32,
        new_cleanliness: u32,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, model_address: ContractAddress, owner: ContractAddress,
    ) {
        self.model_address.write(model_address);
        self.owner.write(owner);
    }

    #[external(v0)]
    fn add_fish(ref self: ContractState, fish_id: felt252, fish_address: ContractAddress) -> bool {
        assert_only_owner(@self);

        // Check if aquarium is at capacity
        let current_count = self.fish_count.read();
        if current_count >= self.capacity.read() {
            return false;
        }

        // Add fish to mapping
        self.fish.write(fish_id, fish_address);
        self.fish_count.write(current_count + 1);

        self.emit(FishAdded { fish_id, fish_address });
        return true;
    }

    #[external(v0)]
    fn remove_fish(ref self: ContractState, fish_id: felt252) -> bool {
        assert_only_owner(@self);

        // Check if fish exists (0 address means no fish)
        let fish_address = self.fish.read(fish_id);
        if fish_address == ContractAddress::zero() {
            return false;
        }

        // Remove fish from mapping by setting to zero address
        self.fish.write(fish_id, ContractAddress::zero());
        let current_count = self.fish_count.read();
        self.fish_count.write(current_count - 1);

        self.emit(FishRemoved { fish_id });
        return true;
    }

    #[external(v0)]
    fn clean(ref self: ContractState, amount: u32) {
        assert_only_owner(@self);

        let current_cleanliness = self.cleanliness.read();
        // Cannot exceed 100
        let new_cleanliness = if current_cleanliness + amount > 100 {
            100_u32
        } else {
            current_cleanliness + amount
        };

        self.cleanliness.write(new_cleanliness);
        self.emit(AquariumCleaned { amount, new_cleanliness });
    }

    #[external(v0)]
    fn update_cleanliness(ref self: ContractState, hours_passed: u32) {
        assert_only_owner(@self);

        let current_cleanliness = self.cleanliness.read();
        let fish_count = self.fish_count.read();

        // Aquarium gets dirtier over time, proportional to the number of fish
        let cleanliness_decrease = (hours_passed * fish_count * 5)
            / 10; // 0.5 cleanliness points per hour per fish

        // Cannot go below 0
        let new_cleanliness = if cleanliness_decrease > current_cleanliness {
            0_u32
        } else {
            current_cleanliness - cleanliness_decrease
        };

        self.cleanliness.write(new_cleanliness);
        self.emit(CleanlinessUpdated { hours_passed, new_cleanliness });

        // Dirty water affects fish health if cleanliness is below 30
        if new_cleanliness < 30 { // Since we can't iterate over a LegacyMap directly, we need to have fish IDs stored
        // elsewhere or pass them in. This is a limitation of the current implementation.
        // In a full implementation, we might store fish IDs in an array that we could iterate over.
        }
    }

    #[external(v0)]
    fn damage_fish_in_dirty_water(
        ref self: ContractState, fish_ids: Array<felt252>, hours_passed: u32,
    ) {
        assert_only_owner(@self);

        let cleanliness = self.cleanliness.read();
        if cleanliness < 30 {
            let damage_amount = hours_passed * 2;

            let mut i = 0;
            let len = fish_ids.len();
            while i < len {
                let fish_id = *fish_ids.at(i);
                let fish_address = self.fish.read(fish_id);

                if fish_address != ContractAddress::zero() {
                    // Call damage on the fish contract
                    let fish_dispatcher = IFishDispatcher { contract_address: fish_address };
                    fish_dispatcher.damage(damage_amount);
                }

                i += 1;
            }
        }
    }

    #[external(v0)]
    fn get_cleanliness(self: @ContractState) -> u32 {
        self.cleanliness.read()
    }

    #[external(v0)]
    fn get_capacity(self: @ContractState) -> u32 {
        self.capacity.read()
    }

    #[external(v0)]
    fn get_fish_count(self: @ContractState) -> u32 {
        self.fish_count.read()
    }

    #[external(v0)]
    fn is_full(self: @ContractState) -> bool {
        self.fish_count.read() >= self.capacity.read()
    }

    #[external(v0)]
    fn remove_dead(ref self: ContractState, fish_ids: Array<felt252>) -> u32 {
        assert_only_owner(@self);

        let mut removed_count = 0_u32;

        let mut i = 0;
        let len = fish_ids.len();
        while i < len {
            let fish_id = *fish_ids.at(i);
            let fish_address = self.fish.read(fish_id);

            if fish_address != ContractAddress::zero() {
                // Check if fish is dead
                let fish_dispatcher = IFishDispatcher { contract_address: fish_address };
                if fish_dispatcher.is_dead() {
                    // Remove the fish
                    self.fish.write(fish_id, ContractAddress::zero());
                    removed_count += 1;

                    self.emit(FishRemoved { fish_id });
                }
            }

            i += 1;
        }

        // Update fish count
        let current_count = self.fish_count.read();
        self.fish_count.write(current_count - removed_count);

        removed_count
    }

    #[external(v0)]
    fn get_model(self: @ContractState) -> ContractAddress {
        self.model_address.read()
    }

    fn assert_only_owner(self: @ContractState) {
        let caller = get_caller_address();
        assert(caller == self.owner.read(), 'Not the owner');
    }
}
