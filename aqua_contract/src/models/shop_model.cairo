use starknet::ContractAddress;

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct ShopItemModel {
    #[key]
    pub id: u256,
    pub price: u256,
    pub stock: u256,
    pub description: felt252,
}

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct ShopCatalogModel {
    #[key]
    pub id: ContractAddress,
    pub owner: ContractAddress,
    pub shopItems: u256,
    pub latest_item_id: u256,
}
