#[cfg(test)]
pub mod Test {
    use super::*;
    use dojo::world::WorldStorageTrait;
    use dojo::model::ModelStorage;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{contract_address_const, testing};

    use aqua_stark::models::inventory_model::{InventoryItem, m_InventoryItem, ItemType};
    use aqua_stark::models::player_model::{m_Player, Player};

    use aqua_stark::interfaces::IInventory::{IInventoryDispatcher, IInventoryDispatcherTrait};
    use aqua_stark::inventory::AquaInventory;
    use aqua_stark::base::events::{
        ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums,
        e_ItemAddedToInventory, e_ItemRemovedFromInventory, e_ItemMovedBetweenAquariums,
    };

    fn namespace_def() -> NamespaceDef {
        NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                // Models
                TestResource::Model(m_InventoryItem::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                // Events
                TestResource::Event(e_ItemAddedToInventory::TEST_CLASS_HASH),
                TestResource::Event(e_ItemRemovedFromInventory::TEST_CLASS_HASH),
                TestResource::Event(e_ItemMovedBetweenAquariums::TEST_CLASS_HASH),
                // Contract
                TestResource::Contract(AquaInventory::TEST_CLASS_HASH),
            ]
                .span(),
        }
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"AquaInventory")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ]
            .span()
    }

    #[test]
    fn test_add_item_to_inventory() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaInventory").unwrap();
        let mut inventory_system = IInventoryDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        // Add a fish item to inventory
        inventory_system.add_item_to_inventory(player, 1, 0); // (player, item_id, item_type=fish)
        let key = AquaInventory::iid(player, 1, ItemType::Fish);

        let item: InventoryItem = world.read_model(key);
        assert!(item.item_id == 1, "Item ID mismatch");
    }

    #[test]
    fn test_remove_item_from_inventory() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaInventory").unwrap();
        let mut inventory_system = IInventoryDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        inventory_system.add_item_to_inventory(player, 42, 1); // Decoration

        inventory_system.remove_item_from_inventory(player, 42_u64, 1);
        let test_player = inventory_system.get_player(player);

        assert!(test_player.decoration_count == 0, "Item should have been removed");
    }

    #[test]
    fn get_player() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaInventory").unwrap();
        let inventory_system = IInventoryDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        let test_player = inventory_system.get_player(player);

        assert!(test_player.wallet == player, "Player wallet mismatch");
    }
}

