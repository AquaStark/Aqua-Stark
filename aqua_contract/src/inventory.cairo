use starknet::{ContractAddress};

use super::models::player_model::Player;
use super::models::inventory_model::{InventoryItem, ItemType, LocationType,};

use super::base::events::{
    ItemAddedToInventory,
    ItemRemovedFromInventory,
    ItemMovedBetweenAquariums,
};

#[starknet::interface]
pub trait IInventory<TContractState> {
    fn add_item_to_inventory(
        ref self: TContractState,
        player_wallet: ContractAddress,
        item_id: u64,
        item_type: u8,     // 0=Fish,1=Decoration,2=Aquarium
    );

    fn remove_item_from_inventory(
        ref self: TContractState,
        player_wallet: ContractAddress,
        item_id: u64,
        item_type: u8,
    );

    fn move_item_between_aquariums(
        ref self: TContractState,
        player_wallet: ContractAddress,
        item_id: u64,
        from_aquarium: u64,
        to_aquarium: u64,
        item_type: u8,     // 0=Fish,1=Decoration (moving aquariums themselves usually not supported)
    );

    fn get_player(self: @TContractState, player_wallet: ContractAddress) -> Player;
}

#[dojo::contract]
pub mod AquaInventory {  
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;
    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;

    use super::{
        Player,
        InventoryItem, ItemType, LocationType,
        ItemAddedToInventory, ItemRemovedFromInventory, ItemMovedBetweenAquariums,
    };
    use starknet::ContractAddress;

    // ---- helpers ----
    fn as_item_type(item_type: u8) -> ItemType {
        match item_type {
            0 => ItemType::Fish,
            1 => ItemType::Decoration,
            2 => ItemType::Aquarium,
            _ => panic('INVALID_ITEM_TYPE'),
        }
    }

    fn iid(player_wallet: ContractAddress, item_id: u64, item_type: ItemType) -> u64 {
        let t: u64 = match item_type {
            ItemType::Fish => 0_u64,
            ItemType::Decoration => 1_u64,
            ItemType::Aquarium => 2_u64,
        };
        (player_wallet.to_u256().low ^ item_id ^ t)
    }

    #[abi(embed_v0)]
    pub impl AquaInventoryImpl of super::IInventory<ContractState> {
        fn add_item_to_inventory(
            ref self: ContractState,
            player_wallet: ContractAddress,
            item_id: u64,
            item_type: u8,
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
                ItemType::Fish => { player.fish_count += 1; },
                ItemType::Decoration => { player.decoration_count += 1; },
                ItemType::Aquarium => { player.aquarium_count += 1; },
            }
            world.write_model(@player);
            let player_id = player.id.try_into().unwrap_or(0_u64);

            world
            .emit_event(
                @ItemAddedToInventory {
                    player_id, 
                    item_id, 
                    item_type,
                }
            );
        }

        fn remove_item_from_inventory(
            ref self: ContractState,
            player_wallet: ContractAddress,
            item_id: u64,
            item_type: u8,
        ) {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(player_wallet);

            let it = as_item_type(item_type);
            let key = iid(player_wallet, item_id, it);

            let existing: InventoryItem = world.read_model(key);
            assert(existing.player_id == player.id.try_into().unwrap_or(0_u64), 'NOT_OWNER');

            world.erase_model(@key);

            // Decrement counters
            match it {
                ItemType::Fish => { if player.fish_count > 0 { player.fish_count -= 1; } },
                ItemType::Decoration => { if player.decoration_count > 0 { player.decoration_count -= 1; } },
                ItemType::Aquarium => { if player.aquarium_count > 0 { player.aquarium_count -= 1; } },
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
            assert(!(matches!(it, ItemType::Aquarium)), 'CANNOT_MOVE_AQUARIUM');

            let key = iid(player_wallet, item_id, it);
            let mut item: InventoryItem = world.read_model(key);
            assert(item.player_id == player.id.try_into().unwrap_or(0_u64), 'NOT_OWNER');

            
            match item.location {
                LocationType::Aquarium(current) => {
                    assert(current == from_aquarium, 'WRONG_FROM_AQUARIUM');
                },
                LocationType::Player => {
                    assert(false, 'ITEM_NOT_IN_FROM_AQUARIUM');
                },
            }

            item.location = LocationType::Aquarium(to_aquarium);
            world.write_model(@item);
            let player_id = player.id.try_into().unwrap_or(0_u64);

            world.emit_event(@ItemMovedBetweenAquariums {
                player_id, item_id, from_aquarium, to_aquarium, item_type
            });
        }

        fn get_player(self: @ContractState, player_wallet: ContractAddress) -> Player {
            let world = self.world_default();
            world.read_model(player_wallet)
        }
    }
}
