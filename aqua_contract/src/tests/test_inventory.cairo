#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use starknet::ContractAddress;
    use starknet::testing::set_caller_address;
    use aqua_stark::models::player_model::Player;
    use aqua_stark::models::inventory_model::{InventoryItem, ItemType, LocationType};
    use aqua_stark::inventory::AquaInventory;
    use aqua_stark::base::events::{ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    fn test_address() -> ContractAddress {
        contract_address_const::<'player1'>()
    }

    // Helper to create a dummy player for tests
    fn create_test_player(id: u64) -> Player {
        Player {
            wallet: test_address(),
            id: id.into(),
            username: 'tester',
            inventory_ref: zero_address(),
            is_verified: true,
            aquarium_count: 0,
            fish_count: 0,
            decoration_count: 0,
            transaction_count: 0,
            registered_at: 0,
            player_fishes: ArrayTrait::new(),
            player_aquariums: ArrayTrait::new(),
            player_decorations: ArrayTrait::new(),
            transaction_history: ArrayTrait::new(),
        }
    }

    #[test]
    fn test_add_fish_to_inventory() {
        set_caller_address(test_address());
        let mut player = create_test_player(1);

        AquaInventory::add_item_to_inventory(ref player, 1, 101, 0);

        assert(player.fish_count == 1, 'Fish count not incremented');
        assert(player.player_fishes.len() == 1, 'Fish not added to array');
    }

    #[test]
    fn test_remove_fish_from_inventory() {
        set_caller_address(test_address());
        let mut player = create_test_player(1);

        AquaInventory::add_item_to_inventory(ref player, 1, 101, 0);
        AquaInventory::remove_item_from_inventory(ref player, 1, 101, 0);

        assert(player.fish_count == 0, 'Fish count not decremented');
        assert(player.player_fishes.len() == 0, 'Fish not removed from array');
    }

    #[test]
    fn test_add_decoration_to_inventory() {
        set_caller_address(test_address());
        let mut player = create_test_player(2);

        AquaInventory::add_item_to_inventory(ref player, 2, 201, 1);

        assert(player.decoration_count == 1, 'Decoration count not incremented');
        assert(player.player_decorations.len() == 1, 'Decoration not added to array');
    }

    #[test]
    fn test_add_aquarium_to_inventory() {
        set_caller_address(test_address());
        let mut player = create_test_player(3);

        AquaInventory::add_item_to_inventory(ref player, 3, 301, 2);

        assert(player.aquarium_count == 1, 'Aquarium count not incremented');
        assert(player.player_aquariums.len() == 1, 'Aquarium not added to array');
    }

    #[test]
    fn test_move_fish_between_aquariums() {
        set_caller_address(test_address());
        let mut player = create_test_player(4);

        // Add aquariums to player
        AquaInventory::add_item_to_inventory(ref player, 4, 401, 2);
        AquaInventory::add_item_to_inventory(ref player, 4, 402, 2);

        // Add fish to first aquarium
        AquaInventory::add_item_to_inventory(ref player, 4, 501, 0);

        // Move fish between aquariums
        AquaInventory::move_item_between_aquariums(ref player, 4, 501, 401, 402, 0);

        // Just assert event/flow worked; detailed aquarium model tests already cover array ops
        assert(player.fish_count == 1, 'Fish count should remain 1 after move');
    }

    #[test]
    #[should_panic(expected: ('INVALID_ITEM_TYPE',))]
    fn test_invalid_item_type() {
        set_caller_address(test_address());
        let mut player = create_test_player(5);

        AquaInventory::add_item_to_inventory(ref player, 5, 999, 99); // invalid type
    }
}

