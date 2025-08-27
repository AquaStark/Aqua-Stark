use starknet::ContractAddress;

#[starknet::interface]
pub trait ITransaction<TContractState> {
    // Transaction lifecycle management
    fn initiate_transaction(
        ref self: TContractState,
        player: ContractAddress,
        event_type_id: u256,
        payload: Array<felt252>,
    ) -> u256;

    fn process_transaction(
        ref self: TContractState,
        transaction_id: u256,
    ) -> bool;

    fn confirm_transaction(
        ref self: TContractState,
        transaction_id: u256,
        confirmation_hash: felt252,
    ) -> bool;

    // Transaction status queries
    fn get_transaction_status(self: @TContractState, transaction_id: u256) -> felt252;
    fn is_transaction_confirmed(self: @TContractState, transaction_id: u256) -> bool;
}