#[dojo::contract]
pub mod AquaInventory {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use aqua_stark::interfaces::IInventory::IInventory;
    use starknet::{ContractAddress};
    use aqua_stark::models::player_model::Player;
    use aqua_stark::models::inventory_model::{InventoryItem, ItemType, LocationType};

    use aqua_stark::base::events::{
        ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums,
    };

    // ---- helpers ----
    pub fn as_item_type(item_type: u8) -> ItemType {
        match item_type {
            0 => ItemType::Fish,
            1 => ItemType::Decoration,
            2 => ItemType::Aquarium,
            _ => panic!("INVALID_ITEM_TYPE"),
        }
    }
    pub fn iid(player_wallet: ContractAddress, item_id: u64, item_type: ItemType) -> u256 {
        let addr_felt: felt252 = player_wallet.try_into().unwrap();
        let t: u256 = match item_type {
            ItemType::Fish => 0_u256,
            ItemType::Decoration => 1_u256,
            ItemType::Aquarium => 2_u256,
        };
        addr_felt.into() ^ item_id.into() ^ t
    }


    #[abi(embed_v0)]
    pub impl AquaInventoryImpl of IInventory<ContractState> {
        fn add_item_to_inventory(
            ref self: ContractState, player_wallet: ContractAddress, item_id: u64, item_type: u8,
        ) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_wallet);

            let it = as_item_type(item_type);
            let key = iid(player_wallet, item_id, it);

            let item = InventoryItem {
                id: key,
                player_id: player.id.try_into().unwrap_or(0_u64),
                item_type: it,
                item_id: item_id,
                location: LocationType::Player,
            };
            world.write_model(@item);

            // Increment counters
            match it {
                ItemType::Fish => {
                    player.fish_count += 1;
                    player.player_fishes.append(key);
                },
                ItemType::Decoration => {
                    player.decoration_count += 1;
                    player.player_decorations.append(key);
                },
                ItemType::Aquarium => {
                    player.aquarium_count += 1;
                    player.player_aquariums.append(key);
                },
            }
            world.write_model(@player);
            let player_id = player.id.try_into().unwrap_or(0_u64);

            world.emit_event(@ItemAddedToInventory { player_id, item_id, item_type });
        }

        fn remove_item_from_inventory(
            ref self: ContractState, player_wallet: ContractAddress, item_id: u64, item_type: u8,
        ) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_wallet);

            let it = as_item_type(item_type);
            let key = iid(player_wallet, item_id, it);

            let existing: InventoryItem = world.read_model(key);
            assert(existing.player_id == player.id.try_into().unwrap_or(0_u64), 'NOT_OWNER');

            world.erase_model(@existing);

            // Decrement counters
            match it {
                ItemType::Fish => {
                    if player.fish_count > 0 {
                        player.fish_count -= 1;
                        player.player_fishes = self.remove_id_from_array(player.player_fishes, key);
                    }
                },
                ItemType::Decoration => {
                    if player.decoration_count > 0 {
                        player.decoration_count -= 1;
                        player
                            .player_decorations = self
                            .remove_id_from_array(player.player_decorations, key);
                    }
                },
                ItemType::Aquarium => {
                    if player.aquarium_count > 0 {
                        player.aquarium_count -= 1;
                        player
                            .player_aquariums = self
                            .remove_id_from_array(player.player_aquariums, key);
                    }
                },
            }
            world.write_model(@player);
            let player_id = player.id.try_into().unwrap_or(0_u64);

            world.emit_event(@ItemRemovedFromInventory { player_id, item_id, item_type });
        }

        fn move_item_between_aquariums(
            ref self: ContractState,
            player_wallet: ContractAddress,
            item_id: u64,
            from_aquarium: u64,
            to_aquarium: u64,
            item_type: u8,
        ) {
            let mut world = self.world_default();
            let player: Player = world.read_model(player_wallet);

            let it = as_item_type(item_type);
            if let ItemType::Aquarium = it {
                panic!("CANNOT_MOVE_AQUARIUM");
            }
            let key = iid(player_wallet, item_id, it);
            let mut item: InventoryItem = world.read_model(key);
            assert(item.player_id == player.id.try_into().unwrap_or(0_u64), 'NOT_OWNER');

            match item.location {
                LocationType::Aquarium(current) => {
                    assert(current == from_aquarium, 'WRONG_FROM_AQUARIUM');
                },
                LocationType::Player => { assert(false, 'ITEM_NOT_IN_FROM_AQUARIUM'); },
            }

            item.location = LocationType::Aquarium(to_aquarium);
            world.write_model(@item);
            let player_id = player.id.try_into().unwrap_or(0_u64);

            world
                .emit_event(
                    @ItemMovedBetweenAquariums {
                        player_id, item_id, from_aquarium, to_aquarium, item_type,
                    },
                );
        }

        fn get_player(self: @ContractState, player_wallet: ContractAddress) -> Player {
            let world = self.world_default();
            world.read_model(player_wallet)
        }
    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn remove_id_from_array(self: @ContractState, arr: Array<u256>, id: u256) -> Array<u256> {
            let mut new_arr = ArrayTrait::new();
            let mut i = 0;
            let len = arr.len();

            while i < len {
                let current = arr.at(i);
                if *current != id {
                    new_arr.append(*current);
                }
                i += 1;
            };
            new_arr
        }
    }
}
