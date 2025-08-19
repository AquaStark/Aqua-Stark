#[starknet::interface]
pub trait IInventory<TContractState> {
    fn add_item_to_inventory(
        ref self: TContractState,
        player_id: u64,
        item_id: u64,
        item_type: u8,
    );
    fn remove_item_from_inventory(
        ref self: TContractState,
        player_id: u64,
        item_id: u64,
        item_type: u8,
    );
    fn move_item_between_aquariums(
        ref self: TContractState,
        player_id: u64,
        item_id: u64,
        from_aquarium: u64,
        to_aquarium: u64,
        item_type: u8,
    );
    fn get_inventory(self: @TContractState, player_id: u64) -> super::player_model::Player;
}
