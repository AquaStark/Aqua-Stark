#[derive(Drop, Serde)]
#[dojo::model]
pub struct Listing {
    #[key]
    pub id: felt252,
    pub fish_id: u256,
    pub price: u256,
    pub is_active: bool,
}
