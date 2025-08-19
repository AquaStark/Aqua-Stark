#[cfg(test)]
mod tests {
    use starknet::testing::{set_caller_address, set_contract_address};
    use starknet::ContractAddress;

    use dojo::world::WorldContractTrait;
    use dojo::test_utils::deploy_world;

    use aqua_stark::systems::Inventory::InventoryImpl;
    use aqua_stark::interfaces::IInventory;
    use aqua_stark::models::player_model::Player;
    use aqua_stark::models::fish_model::Fish;
    use aqua_stark::models::aquarium_model::Aquarium;
    use aqua_stark::models::decoration_model::Decoration;

    use aqua_stark::base::events::{
        ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums
    };

    #[test]
    fn test_add_item_to_inventory() {
        let mut world = deploy_world();

        let player_id: u64 = 1;
        let wallet: ContractAddress = ContractAddress::from_felt(0x123);
        let mut player = Player {
            wallet,
            id: player_id,
            username: 'bernard',
            inventory_ref: 'inv_ref',
            is_verified: true,
            aquarium_count: 0,
            fish_count: 0,
            player_fishes: ArrayTrait::new(),
            player_aquariums: ArrayTrait::new(),
            player_decorations: ArrayTrait::new(),
            decoration_count: 0,
            registered_at: 0,
        };
        world.write_model(@player);

        let fish_id: u64 = 101;
        let fish = Fish {
            id: fish_id,
            owner: wallet,
            ..Default::default()
        };
        world.write_model(@fish);

        set_caller_address(wallet);

        let mut contract = world.as_contract_state();
        contract.add_item_to_inventory(player_id, fish_id, 0);

        let updated: Player = world.read_model(player_id);
        assert(updated.fish_count == 1, 'fish not added');
        assert(updated.player_fishes.len() == 1, 'fish array not updated');
    }

    #[test]
    fn test_remove_item_from_inventory() {
        let mut world = deploy_world();
        let player_id: u64 = 2;
        let wallet: ContractAddress = ContractAddress::from_felt(0x456);

        let mut player = Player {
            wallet,
            id: player_id,
            username: 'karaba',
            inventory_ref: 'inv_ref',
            is_verified: true,
            aquarium_count: 0,
            fish_count: 1,
            player_fishes: ArrayTrait::new(),
            player_aquariums: ArrayTrait::new(),
            player_decorations: ArrayTrait::new(),
            decoration_count: 0,
            registered_at: 0,
        };
        player.player_fishes.append(201);
        world.write_model(@player);

        set_caller_address(wallet);

        let mut contract = world.as_contract_state();
        contract.remove_item_from_inventory(player_id, 201, 0);

        let updated: Player = world.read_model(player_id);
        assert(updated.fish_count == 0, 'fish not removed');
        assert(updated.player_fishes.len() == 0, 'fish array not cleared');
    }

    #[test]
    fn test_move_item_between_aquariums() {
        let mut world = deploy_world();
        let player_id: u64 = 3;
        let wallet: ContractAddress = ContractAddress::from_felt(0x789);

        let mut player = Player {
            wallet,
            id: player_id,
            username: 'bernardk',
            inventory_ref: 'inv_ref',
            is_verified: true,
            aquarium_count: 2,
            fish_count: 1,
            player_fishes: ArrayTrait::new(),
            player_aquariums: ArrayTrait::new(),
            player_decorations: ArrayTrait::new(),
            decoration_count: 0,
            registered_at: 0,
        };
        world.write_model(@player);

        let mut a1 = Aquarium {
            id: 301,
            owner: wallet,
            max_capacity: 10,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
            housed_decorations: ArrayTrait::new(),
            max_decorations: 5,
            fish_count: 1,
            decoration_count: 0,
        };
        a1.housed_fish.append(401);
        world.write_model(@a1);

        let a2 = Aquarium {
            id: 302,
            owner: wallet,
            max_capacity: 10,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
            housed_decorations: ArrayTrait::new(),
            max_decorations: 5,
            fish_count: 0,
            decoration_count: 0,
        };
        world.write_model(@a2);

        set_caller_address(wallet);

        let mut contract = world.as_contract_state();
        contract.move_item_between_aquariums(player_id, 401, 301, 302, 0);

        let moved_from: Aquarium = world.read_model(301);
        let moved_to: Aquarium = world.read_model(302);

        assert(moved_from.housed_fish.len() == 0, 'fish not removed from old aquarium');
        assert(moved_to.housed_fish.len() == 1, 'fish not added to new aquarium');
    }
}
