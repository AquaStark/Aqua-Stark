use starknet::ContractAddress;
use starknet::contract_address_const;
use dojo::test_utils::{deploy_contract, deploy_world};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use shop_catalog::{ShopCatalog, IShopCatalogDispatcher, IShopCatalogDispatcherTrait};
use shop_catalog::ShopCatalog::{ShopItem, ItemAdded, ItemUpdated, CustomErrors};

#[test]
#[available_gas(2000000)]
fn test_add_item() {
    let world = deploy_world();
    let caller = contract_address_const::<0x123>();
    starknet::testing::set_caller_address(caller);

    let contract = deploy_contract(world, ShopCatalog::TEST_CLASS_HASH);
    let dispatcher = IShopCatalogDispatcher { contract_address: contract };

    // Add item
    let name = 'Sword';
    let price = 100_u256;
    let stock = 10_u64;
    let description = 'A sharp blade';
    let item_id = dispatcher.add_item(name, price, stock, description);

    // Verify item
    let item = dispatcher.get_item(item_id);
    assert(item.id == 1, 'Invalid item ID');
    assert(item.name == name, 'Invalid name');
    assert(item.price == price, 'Invalid price');
    assert(item.stock == stock, 'Invalid stock');
    assert(item.description == description, 'Invalid description');
    assert(item.seller == caller, 'Invalid seller');

    // Verify event
    // Note: Event verification requires additional setup in Dojo test utils
}

#[test]
#[available_gas(2000000)]
#[should_panic(expected = ('Price must be positive',))]
fn test_add_item_invalid_price() {
    let world = deploy_world();
    let caller = contract_address_const::<0x123>();
    starknet::testing::set_caller_address(caller);

    let contract = deploy_contract(world, ShopCatalog::TEST_CLASS_HASH);
    let dispatcher = IShopCatalogDispatcher { contract_address: contract };

    dispatcher.add_item('Sword', 0_u256, 10_u64, 'A sharp blade');
}

#[test]
#[available_gas(2000000)]
fn test_update_item() {
    let world = deploy_world();
    let caller = contract_address_const::<0x123>();
    starknet::testing::set_caller_address(caller);

    let contract = deploy_contract(world, ShopCatalog::TEST_CLASS_HASH);
    let dispatcher = IShopCatalogDispatcher { contract_address: contract };

    // Add item
    let item_id = dispatcher.add_item('Sword', 100_u256, 10_u64, 'A sharp blade');

    // Update item
    let new_price = 150_u256;
    let new_stock = 5_u64;
    dispatcher.update_item(item_id, new_price, new_stock);

    // Verify update
    let item = dispatcher.get_item(item_id);
    assert(item.price == new_price, 'Invalid updated price');
    assert(item.stock == new_stock, 'Invalid updated stock');
}

#[test]
#[available_gas(2000000)]
#[should_panic(expected = ('Caller is not the seller',))]
fn test_update_item_not_seller() {
    let world = deploy_world();
    let seller = contract_address_const::<0x123>();
    let other = contract_address_const::<0x456>();
    starknet::testing::set_caller_address(seller);

    let contract = deploy_contract(world, ShopCatalog::TEST_CLASS_HASH);
    let dispatcher = IShopCatalogDispatcher { contract_address: contract };

    // Add item as seller
    let item_id = dispatcher.add_item('Sword', 100_u256, 10_u64, 'A sharp blade');

    // Try to update as other
    starknet::testing::set_caller_address(other);
    dispatcher.update_item(item_id, 150_u256, 5_u64);
}

#[test]
#[available_gas(2000000)]
fn test_get_all_items() {
    let world = deploy_world();
    let caller = contract_address_const::<0x123>();
    starknet::testing::set_caller_address(caller);

    let contract = deploy_contract(world, ShopCatalog::TEST_CLASS_HASH);
    let dispatcher = IShopCatalogDispatcher { contract_address: contract };

    // Add multiple items
    dispatcher.add_item('Sword', 100_u256, 10_u64, 'A sharp blade');
    dispatcher.add_item('Shield', 200_u256, 5_u64, 'A sturdy shield');

    // Get all items
    let items = dispatcher.get_all_items();
    assert(items.len() == 2, 'Invalid number of items');
    assert(*items[0].name == 'Sword', 'Invalid first item');
    assert(*items[1].name == 'Shield', 'Invalid second item');
}