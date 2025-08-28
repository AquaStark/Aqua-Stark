use starknet::ContractAddress;
use aqua_stark::models::player_model::Player;

#[starknet::interface]
pub trait IInventory<TContractState> {
    fn add_item_to_inventory(
        ref self: TContractState,
        player_wallet: ContractAddress,
        item_id: u64,
        item_type: u8 // 0=Fish,1=Decoration,2=Aquarium
    );

    fn remove_item_from_inventory(
        ref self: TContractState, player_wallet: ContractAddress, item_id: u64, item_type: u8,
    );

    fn move_item_between_aquariums(
        ref self: TContractState,
        player_wallet: ContractAddress,
        item_id: u64,
        from_aquarium: u64,
        to_aquarium: u64,
        item_type: u8 // 0=Fish,1=Decoration (moving aquariums themselves usually not supported)
    );

    fn get_player(self: @TContractState, player_wallet: ContractAddress) -> Player;
}
