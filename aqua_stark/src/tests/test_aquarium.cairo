#[cfg(test)]
mod tests {
    use aqua_stark::base::events::{AquariumCleaned, AquariumCreated, AquariumUpdated};
    use aqua_stark::models::aquarium_model::{Aquarium, AquariumTrait};
    use starknet::testing::set_caller_address;
    use starknet::{ContractAddress, contract_address_const};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    fn test_address() -> ContractAddress {
        contract_address_const::<'wheval'>()
    }

    #[test]
    fn test_aquarium_creation() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);

        assert(aquarium.id == 1, 'Wrong aquarium ID');
        assert(aquarium.owner == test_address(), 'Wrong owner');
        assert(aquarium.max_capacity == 10, 'Wrong max capacity');
        assert(aquarium.max_decorations == 5, 'Wrong max decorations');
        assert(aquarium.cleanliness == 100, 'Wrong initial cleanliness');
        assert(aquarium.fish_count == 0, 'Wrong initial fish count');
        assert(aquarium.decoration_count == 0, 'Wrong initial decoration count');
    }

    #[test]
    fn test_aquarium_cleaning() {
        set_caller_address(test_address());

        let mut aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);

        // Reduce cleanliness first
        aquarium.cleanliness = 50;

        // Clean the aquarium
        let cleaned_aquarium = AquariumTrait::clean(aquarium, 30);

        assert(cleaned_aquarium.cleanliness == 80, 'Cleaning failed');
    }

    #[test]
    fn test_aquarium_cleaning_max_cap() {
        set_caller_address(test_address());

        let mut aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);

        // Clean beyond 100
        let cleaned_aquarium = AquariumTrait::clean(aquarium, 50);

        assert(cleaned_aquarium.cleanliness == 100, 'Max cleanliness should be 100');
    }

    #[test]
    fn test_add_fish_to_aquarium() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);
        let updated_aquarium = AquariumTrait::add_fish(aquarium, 1);

        assert(updated_aquarium.fish_count == 1, 'Fish not added');
        assert(updated_aquarium.housed_fish.len() == 1, 'Fish array not updated');
    }

    #[test]
    fn test_remove_fish_from_aquarium() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);
        let aquarium_with_fish = AquariumTrait::add_fish(aquarium, 1);
        let updated_aquarium = AquariumTrait::remove_fish(aquarium_with_fish, 1);

        assert(updated_aquarium.fish_count == 0, 'Fish not removed');
        assert(updated_aquarium.housed_fish.len() == 0, 'Fish array not updated');
    }

    #[test]
    fn test_add_decoration_to_aquarium() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);
        let updated_aquarium = AquariumTrait::add_decoration(aquarium, 1);

        assert(updated_aquarium.decoration_count == 1, 'Decoration not added');
        assert(updated_aquarium.housed_decorations.len() == 1, 'Decoration array not updated');
    }

    #[test]
    fn test_aquarium_capacity_check() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 2, 5);
        let aquarium_with_fish1 = AquariumTrait::add_fish(aquarium, 1);
        let aquarium_with_fish2 = AquariumTrait::add_fish(aquarium_with_fish1, 2);

        assert(AquariumTrait::is_full(aquarium_with_fish2), 'Aquarium should be full');
    }

    #[test]
    #[should_panic(expected: ('Aquarium full',))]
    fn test_aquarium_overflow() {
        let aquarium = AquariumTrait::create_aquarium(1, test_address(), 1, 5);
        let aquarium_with_fish = AquariumTrait::add_fish(aquarium, 1);
        // This should panic
        AquariumTrait::add_fish(aquarium_with_fish, 2);
    }

    #[test]
    #[should_panic(expected: "Capacity below current fish count")]
    fn test_update_settings_capacity_below_fish_count() {
        let mut aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);

        // Add some fish
        aquarium = AquariumTrait::add_fish(aquarium, 1);
        aquarium = AquariumTrait::add_fish(aquarium, 2);

        // Try to set max_capacity below current fish count
        let new_max_capacity = 1; // Less than current 2 fish
        let new_max_decorations = 5; // Keep same

        AquariumTrait::update_settings(aquarium, new_max_capacity, new_max_decorations);
    }

    #[test]
    #[should_panic(expected: "Decoration cap below current count")]
    fn test_update_settings_decorations_below_count() {
        let mut aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);

        // Add some decorations
        aquarium = AquariumTrait::add_decoration(aquarium, 1);
        aquarium = AquariumTrait::add_decoration(aquarium, 2);
        aquarium = AquariumTrait::add_decoration(aquarium, 3);

        // Try to set max_decorations below current count
        let new_max_capacity = 10; // Keep same
        let new_max_decorations = 2; // Less than current 3 decorations

        AquariumTrait::update_settings(aquarium, new_max_capacity, new_max_decorations);
    }

    #[test]
    fn test_cleanliness_decay() {
        let mut aquarium = AquariumTrait::create_aquarium(1, test_address(), 10, 5);
        // Add some fish to cause decay
        aquarium = AquariumTrait::add_fish(aquarium, 1);
        aquarium = AquariumTrait::add_fish(aquarium, 2);

        // Simulate 24 hours passing
        let decayed_aquarium = AquariumTrait::update_cleanliness(aquarium, 24);

        // With 2 fish, 24 hours should cause significant decay
        assert(decayed_aquarium.cleanliness < 100, 'Cleanliness should decay');
    }
}
