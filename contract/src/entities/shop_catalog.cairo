use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde)]
#[dojo::model]
pub struct ShopItem {
    #[key]
    id: u64,
    name: felt252,
    price: u256,
    stock: u64,
    description: felt252,
    seller: ContractAddress,
}

#[derive(Model, Copy, Drop, Serde)]
#[dojo::model]
pub struct CatalogCounter {
    #[key]
    id: felt252,
    nonce: u64,
}
