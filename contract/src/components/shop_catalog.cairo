use starknet::ContractAddress;

const CATALOG_ID_TARGET: felt252 = 'CATALOG';

#[starknet::interface]
pub trait IShopCatalog<TContractState> {
    fn add_item(
        ref self: TContractState,
        name: felt252,
        price: u256,
        stock: u64,
        description: felt252
    ) -> u64;
    fn update_item(
        ref self: TContractState,
        item_id: u64,
        price: u256,
        stock: u64
    );
    fn get_item(self: @TContractState, item_id: u64) -> ShopItem;
    fn get_all_items(self: @TContractState) -> Array<ShopItem>;
}

#[dojo::contract]
pub mod ShopCatalog {
    use super::*;
    // use dojo::event::EventStorage;
    // use dojo::model::ModelStorage;
    use starknet::{get_caller_address, get_contract_address, contract_address_const};
    use core::array::ArrayTrait;
    use dojo_starter::entities::base::{
        ItemAdded, ItemUpdated, CustomErrors,
    };
    use dojo_starter::entities::shopCatalog::{ShopItem, ShopItemTrait};
    use dojo_starter::entities::base::CatalogCounter;
    use dojo_starter::entities::base::CatalogCounterTrait;
    use dojo_starter::entities::base::CustomErrors;
    use dojo_starter::entities::base::ItemAdded;
    use dojo_starter::entities::base::ItemUpdated;
    use dojo_starter::entities::base::CustomErrors;

    #[abi(embed_v0)]
    impl ShopCatalogImpl of IShopCatalog<ContractState> {
        fn add_item(
            ref self: ContractState,
            name: felt252,
            price: u256,
            stock: u64,
            description: felt252
        ) -> u64 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Validations
            assert(name != 0, CustomErrors::INVALID_NAME);
            assert(price > 0, CustomErrors::INVALID_PRICE);
            assert(stock >= 0, CustomErrors::INVALID_STOCK);

            // Generate new item ID
            let item_id = self.generate_item_id();

            // Create new ShopItem
            let item = ShopItem {
                id: item_id,
                name,
                price,
                stock,
                description,
                seller: caller,
            };

            // Write to world state
            world.write_model(@item);

            // Emit event
            let added_event = ItemAdded {
                id: item_id,
                name,
                price,
                stock,
                description,
                seller: caller,
            };
            world.emit_event(@added_event);

            item_id
        }

        fn update_item(
            ref self: ContractState,
            item_id: u64,
            price: u256,
            stock: u64
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current item state
            let mut item: ShopItem = world.read_model(item_id);

            // Validations
            assert(item.id == item_id, CustomErrors::INVALID_ITEM_ID);
            assert(item.seller == caller, CustomErrors::NOT_SELLER);
            assert(price > 0, CustomErrors::INVALID_PRICE);
            assert(stock >= 0, CustomErrors::INVALID_STOCK);

            // Update item
            item.price = price;
            item.stock = stock;

            // Write updated state
            world.write_model(@item);

            // Emit event
            let updated_event = ItemUpdated {
                id: item_id,
                price,
                stock,
                timestamp: starknet::get_block_timestamp(),
            };
            world.emit_event(@updated_event);
        }

        fn get_item(self: @ContractState, item_id: u64) -> ShopItem {
            let world = self.world_default();
            let item: ShopItem = world.read_model(item_id);
            assert(item.id == item_id, CustomErrors::INVALID_ITEM_ID);
            item
        }

        fn get_all_items(self: @ContractState) -> Array<ShopItem> {
            let world = self.world_default();
            let mut items = ArrayTrait::new();
            let counter: CatalogCounter = world.read_model(CATALOG_ID_TARGET);
            let mut i: u64 = 1;
            while i <= counter.nonce {
                let item: ShopItem = world.read_model(i);
                if item.id == i {
                    items.append(item);
                }
                i += 1;
            };
            items
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"shop_catalog")
        }

        fn generate_item_id(self: @ContractState) -> u64 {
            let mut world = self.world_default();
            let mut counter: CatalogCounter = world.read_model(CATALOG_ID_TARGET);
            let new_id = counter.nonce + 1;
            counter.nonce = new_id;
            world.write_model(@counter);
            new_id
        }
    }
}