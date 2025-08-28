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
    Player, // Stored in the player's general inventory
    Aquarium: u64 // Stored inside a specific aquarium (by ID)
}

#[derive(Drop, Serde)]
#[dojo::model]
pub struct InventoryItem {
    #[key]
    pub id: u256, // Unique identifier for the inventory entry
    pub player_id: u64, // Owner of the item
    pub item_type: ItemType, // Type of the item
    pub item_id: u64, // Unique identifier of the specific item
    pub location: LocationType // Current location of the item
}

