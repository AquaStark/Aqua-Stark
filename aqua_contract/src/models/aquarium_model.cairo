use starknet::{ContractAddress, get_caller_address};

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct Aquarium {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub max_capacity: u32,
    pub cleanliness: u32, // 0-100 scale
    pub housed_fish: Array<u64>,
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct AquariumCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct AquariumOwner {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
}
#[derive(Serde, Clone, Drop, Introspect)]
#[dojo::model]
pub struct AquariumFishes {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub current_fish_count: u256,
    pub max_fish_count: u256,
}

pub trait AquariumTrait {
    fn create_aquarium(aquarium_id: u256, owner: ContractAddress, max_capacity: u32) -> Aquarium;
    fn add_fish(aquarium: Aquarium, fish_id: u64) -> Aquarium;
    fn remove_fish(aquarium: Aquarium, fish_id: u64) -> Aquarium;
    fn clean(aquarium: Aquarium, amount: u32) -> Aquarium;
    fn update_cleanliness(aquarium: Aquarium, hours_passed: u32) -> Aquarium;
    fn get_cleanliness(aquarium: Aquarium) -> u32;
    fn get_capacity(aquarium: Aquarium) -> u32;
    fn get_fish_count(aquarium: Aquarium) -> u32;
    fn is_full(aquarium: Aquarium) -> bool;
}

impl AquariumImpl of AquariumTrait {
    fn create_aquarium(aquarium_id: u256, owner: ContractAddress, max_capacity: u32) -> Aquarium {
        // Create new aquarium
        let aquarium = Aquarium {
            id: aquarium_id,
            owner,
            max_capacity,
            cleanliness: 100_u32,
            housed_fish: ArrayTrait::new(),
        };
        aquarium
    }
    fn add_fish(mut aquarium: Aquarium, fish_id: u64) -> Aquarium {
        let is_full: bool = aquarium.housed_fish.len() >= aquarium.max_capacity;
        assert(!is_full, 'Aquarium full');
        aquarium.housed_fish.append(fish_id);
        aquarium
    }

    fn remove_fish(mut aquarium: Aquarium, fish_id: u64) -> Aquarium {
        let is_empty: bool = aquarium.housed_fish.len() == 0;
        assert(!is_empty, 'Aquarium is empty');
        // Find and remove fish
        let mut found = false;
        let mut i = 0;
        let len = aquarium.housed_fish.len();
        let mut new_fish_array = ArrayTrait::new();

        while i < len {
            let current_fish = aquarium.housed_fish.at(i);
            if current_fish != @fish_id {
                new_fish_array.append(*current_fish);
            } else {
                found = true;
            }
            i += 1;
        };

        if found {
            aquarium.housed_fish = new_fish_array;
        }
        aquarium
    }

    fn clean(mut aquarium: Aquarium, amount: u32) -> Aquarium {
        // Check ownership
        assert(aquarium.owner == get_caller_address(), 'CustomErrors::NOT_OWNER');

        // Update cleanliness
        let new_cleanliness = if aquarium.cleanliness + amount > 100 {
            100_u32
        } else {
            aquarium.cleanliness + amount
        };

        aquarium.cleanliness = new_cleanliness;
        aquarium
    }

    fn update_cleanliness(mut aquarium: Aquarium, hours_passed: u32) -> Aquarium {
        // Calculate cleanliness decrease
        let cleanliness_decrease = (hours_passed * aquarium.housed_fish.len() * 5) / 10;

        // Update cleanliness
        let new_cleanliness = if cleanliness_decrease > aquarium.cleanliness {
            0_u32
        } else {
            aquarium.cleanliness - cleanliness_decrease
        };

        aquarium.cleanliness = new_cleanliness;

        aquarium
    }
    fn get_cleanliness(aquarium: Aquarium) -> u32 {
        aquarium.cleanliness
    }
    fn get_capacity(aquarium: Aquarium) -> u32 {
        aquarium.max_capacity
    }

    fn get_fish_count(aquarium: Aquarium) -> u32 {
        aquarium.housed_fish.len()
    }

    fn is_full(aquarium: Aquarium) -> bool {
        aquarium.housed_fish.len() >= aquarium.max_capacity
    }
}
#[cfg(test)]
mod tests {
    use core::array::ArrayTrait;
    use starknet::contract_address_const;
    use super::{*, Aquarium};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_aquarium_creation() {
        // Create a new aquarium
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 10,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };

        // Assert that the max capacity is correctly set
        assert(aquarium.max_capacity == 10, 'Aquarium capacity should match');
    }

    #[test]
    fn test_add_fish() {
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 10,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };
        let former_count: u32 = AquariumTrait::get_fish_count(aquarium.clone());
        let new: Aquarium = AquariumTrait::add_fish(aquarium, 1);
        let new_count: u32 = AquariumTrait::get_fish_count(new);
        assert(former_count == 0, 'wrong former');
        assert(new_count == 1, 'wrong new');
    }
    #[test]
    fn test_remove_fish() {
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 3,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };

        let new: Aquarium = AquariumTrait::add_fish(aquarium, 1);
        let new_2: Aquarium = AquariumTrait::add_fish(new, 2);
        let new_3: Aquarium = AquariumTrait::remove_fish(new_2.clone(), 2);
        let new_count: u32 = AquariumTrait::get_fish_count(new_3);
        assert(new_count == 1, 'failed update');
    }

    #[test]
    fn test_aquarium_cleaning() {
        // Initialize an aquarium with a cleanliness of 50
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 3,
            cleanliness: 50,
            housed_fish: ArrayTrait::new(),
        };

        // Clean the aquarium by adding 20 to cleanliness
        let cleaned_aquarium: Aquarium = AquariumTrait::clean(aquarium, 20);

        // Get the updated cleanliness
        let cleanliness: u32 = AquariumTrait::get_cleanliness(cleaned_aquarium);

        // Assert the cleanliness is now 70
        assert(cleanliness == 70, 'cleaniness Logic wrong');
    }


    #[test]
    fn test_update_aquarium_cleaning() {
        // Create an aquarium with capacity of 3 and initial cleanliness of 100
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 3,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };

        // Add three fish to the aquarium
        let aquarium_after_1 = AquariumTrait::add_fish(aquarium, 1);
        let aquarium_after_2 = AquariumTrait::add_fish(aquarium_after_1, 2);
        let aquarium_after_3 = AquariumTrait::add_fish(aquarium_after_2.clone(), 3);

        // Update the aquarium's cleanliness by reducing it by 24
        let updated_aquarium = AquariumTrait::update_cleanliness(aquarium_after_3, 24);

        // Check that cleanliness is updated correctly
        let cleanliness: u32 = AquariumTrait::get_cleanliness(updated_aquarium.clone());
        assert(cleanliness == 64, 'Cleanliness logic is incorrect');

        // Check if the aquarium is full
        let is_full: bool = AquariumTrait::is_full(updated_aquarium);
        assert(is_full, 'Aquariumbe full but is not');
    }


    #[test]
    #[should_panic(expected: ('Aquarium full',))]
    fn test_aquarium_overflow() {
        // Create an aquarium with a capacity of 2
        let aquarium = Aquarium {
            id: 1,
            owner: zero_address(),
            max_capacity: 2,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };

        // Add the first fish
        let aquarium_after_1 = AquariumTrait::add_fish(aquarium, 1);

        // Add the second fish
        let aquarium_after_2 = AquariumTrait::add_fish(aquarium_after_1, 2);

        // Attempt to add a third fish (should panic)
        let aquarium_after_3 = AquariumTrait::add_fish(aquarium_after_2.clone(), 3);

        // Update cleanliness
        let updated_aquarium = AquariumTrait::update_cleanliness(aquarium_after_3, 24);

        // Check cleanliness value
        let cleanliness: u32 = AquariumTrait::get_cleanliness(updated_aquarium.clone());
        assert(cleanliness == 64, 'Cleanliness logic is incorrect');

        // Check if the aquarium is full
        let is_full: bool = AquariumTrait::is_full(updated_aquarium);
        assert(is_full, 'Aquariumbe full but is not');
    }
}
