#[dojo::contract]
pub mod Inventory {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::ContractAddress;

    use aqua_stark::models::player_model::Player;
    use aqua_stark::models::aquarium_model::Aquarium;
    use aqua_stark::models::fish_model::Fish;
    use aqua_stark::models::decoration_model::Decoration;
    

    use aqua_stark::base::events::{
        ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums
    };

    use aqua_stark::interfaces::IInventory;
    #[abi(embed_v0)]
    impl InventoryImpl of IInventory<ContractState> {
        
        /// Add a fish or decoration to player's inventory
        fn add_item_to_inventory(
            ref self: ContractState,
            player_id: u64,
            item_id: u64,
            item_type: u8, // 0 = Fish, 1 = Decoration
        ) {
            let mut world = self.world_default();

            let mut player: Player = world.read_model(player_id);

            match item_type {
                0 => {
                    let fish: Fish = world.read_model(item_id);
                    assert(fish.owner == player.wallet, 'NOT_OWNER');
                    player.player_fishes.append(item_id);
                    player.fish_count += 1;
                },
                1 => {
                    let decoration: Decoration = world.read_model(item_id);
                    assert(decoration.owner == player.wallet, 'NOT_OWNER');
                    player.player_decorations.append(item_id);
                    player.decoration_count += 1;
                },
                _ => panic_with_felt252('INVALID_ITEM_TYPE'),
            };

            world.write_model(@player);

            let event = ItemAddedToInventory { player_id, item_id, item_type };
            world.emit_event(@event);
        }

        /// Remove item from player's inventory
        fn remove_item_from_inventory(
            ref self: ContractState,
            player_id: u64,
            item_id: u64,
            item_type: u8,
        ) {
            let mut world = self.world_default();

            let mut player: Player = world.read_model(player_id);

            match item_type {
                0 => {
                    // Remove fish from array
                    player.player_fishes = self.remove_id_from_array(player.player_fishes, item_id);
                    player.fish_count -= 1;
                },
                1 => {
                    player.player_decorations =
                        self.remove_id_from_array(player.player_decorations, item_id);
                    player.decoration_count -= 1;
                },
                _ => panic_with_felt252('INVALID_ITEM_TYPE'),
            };

            world.write_model(@player);

            let event = ItemRemovedFromInventory { player_id, item_id, item_type };
            world.emit_event(@event);
        }

        /// Move item (fish/decoration) between aquariums
        fn move_item_between_aquariums(
            ref self: ContractState,
            player_id: u64,
            item_id: u64,
            from_aquarium: u64,
            to_aquarium: u64,
            item_type: u8,
        ) {
            let mut world = self.world_default();

            let mut from: Aquarium = world.read_model(from_aquarium);
            let mut to: Aquarium = world.read_model(to_aquarium);

            assert(from.owner == to.owner, 'MUST_BE_SAME_OWNER');

            match item_type {
                0 => {
                    // Move fish
                    from.housed_fish = self.remove_id_from_array(from.housed_fish, item_id);
                    to.housed_fish.append(item_id);
                },
                1 => {
                    from.housed_decorations =
                        self.remove_id_from_array(from.housed_decorations, item_id);
                    to.housed_decorations.append(item_id);
                },
                _ => panic_with_felt252('INVALID_ITEM_TYPE'),
            };

            world.write_model(@from);
            world.write_model(@to);

            let event = ItemMovedBetweenAquariums {
                player_id, item_id, from: from_aquarium, to: to_aquarium, item_type
            };
            world.emit_event(@event);
        }

        /// Query player's full inventory
        fn get_inventory(self: @ContractState, player_id: u64) -> Player {
            let mut world = self.world_default();
            world.read_model(player_id)
        }
    }

    // ----------------------------
    // Internal Helpers
    // ----------------------------
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn remove_id_from_array(arr: Array<u64>, id: u64) -> Array<u64> {
            let mut new_arr = ArrayTrait::new();
            let mut i = 0;
            let len = arr.len();

            while i < len {
                let current = arr.at(i);
                if *current != id {
                    new_arr.append(*current);
                }
                i += 1;
            }
            new_arr
        }
    }
}
