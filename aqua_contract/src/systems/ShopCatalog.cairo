#[dojo::contract]
pub mod ShopCatalog {
    use dojo::model::{ModelStorage};
    use starknet::get_contract_address;
    use aqua_stark::models::shop_model::{ShopItemModel, ShopCatalogModel};
    use aqua_stark::interfaces::IShopCatalog::IShopCatalog;

    #[abi(embed_v0)]
    impl ShopCatalogImpl of IShopCatalog<ContractState> {
        fn add_new_item(
            self: @ContractState, price: u256, stock: u256, description: felt252,
        ) -> u256 {
            // only owner can add
            self.assert_only_owner();
            // inputs must be non-zero
            assert(price > 0, 'Invalid price');
            assert(stock > 0, 'Invalid stock');

            let mut world = self.world(@"aqua_stark");

            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            shop_catalog.shopItems += 1;
            shop_catalog.latest_item_id += 1;

            let shop_item = ShopItemModel {
                id: shop_catalog.latest_item_id,
                price: price,
                stock: stock,
                description: description,
            };
            world.write_model(@shop_catalog);
            world.write_model(@shop_item);
            shop_item.id
        }

        fn update_item(
            self: @ContractState, id: u256, price: u256, stock: u256, description: felt252,
        ) {
            self.assert_only_owner();
            assert(price > 0, 'Invalid price');
            assert(stock > 0, 'Invalid stock');

            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            assert(shop_catalog.latest_item_id >= id, 'Item does not exist');

            let mut shop_item: ShopItemModel = world.read_model(id);
            shop_item.price = price;
            shop_item.stock = stock;
            shop_item.description = description;
            world.write_model(@shop_item);
        }

        fn get_item(self: @ContractState, id: u256) -> ShopItemModel {
            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            assert(shop_catalog.latest_item_id >= id, 'Item does not exist');

            let mut shop_item: ShopItemModel = world.read_model(id);
            shop_item
        }

        fn get_all_items(self: @ContractState) -> Array<ShopItemModel> {
            let mut world = self.world(@"aqua_stark");
            let mut shop_catalog: ShopCatalogModel = world.read_model(get_contract_address());
            let mut items: Array<ShopItemModel> = array![];
            for i in 1..shop_catalog.latest_item_id {
                let mut shop_item: ShopItemModel = world.read_model(i);
                items.append(shop_item);
            };
            items
        }
    }
}
