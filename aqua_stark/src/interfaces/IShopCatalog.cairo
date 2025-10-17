// define the interface
use aqua_stark::models::shop_model::ShopItemModel;
#[starknet::interface]
pub trait IShopCatalog<T> {
    fn add_new_item(self: @T, price: u256, stock: u256, description: felt252) -> u256;
    fn update_item(self: @T, id: u256, price: u256, stock: u256, description: felt252);
    fn get_item(self: @T, id: u256) -> ShopItemModel;
    fn get_all_items(self: @T) -> Array<ShopItemModel>;
}
