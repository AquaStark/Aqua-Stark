#[derive(Drop, Serde, Copy, Clone, PartialEq, Introspect)]
pub enum ItemType {
    Fish,
    Decoration,
    Aquarium,
}
impl ItemTypeFelt252 of Into<ItemType, felt252> {
    fn into(self: ItemType) -> felt252 {
        match self {
            ItemType::Fish => 0,
            ItemType::Decoration => 1,
            ItemType::Aquarium => 2,
        }
    }
}

#[derive(Drop, Serde, Copy, Clone, PartialEq, Introspect)]
pub enum LocationType {
    Player,
    Aquarium: u64,
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct InventoryItem {
    #[key]
    pub id: u256,
    pub player_id: u64,
    pub item_type: ItemType,
    pub item_id: u64,
    pub location: LocationType,
}

