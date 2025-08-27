use starknet::ContractAddress;
use aqua_stark::models::transaction_model::{TransactionLog, EventTypeDetails};

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

    // Event type management
    fn register_event_type(ref self: TContractState, event_name: ByteArray) -> u256;

    fn log_event(
        ref self: TContractState,
        event_type_id: u256,
        player: ContractAddress,
        payload: Array<felt252>,
    ) -> TransactionLog;

    // Query functions
    fn get_event_types_count(self: @TContractState) -> u256;
    fn get_all_event_types(self: @TContractState) -> Span<EventTypeDetails>;
    fn get_event_type_details(self: @TContractState, event_type_id: u256) -> EventTypeDetails;

    fn get_transaction_count(self: @TContractState) -> u256;
    fn get_transaction_history(
        self: @TContractState,
        player: Option<ContractAddress>,
        event_type_id: Option<u256>,
        start: Option<u32>,
        limit: Option<u32>,
        start_timestamp: Option<u64>,
        end_timestamp: Option<u64>,
    ) -> Span<TransactionLog>;

    // Transaction status queries
    fn get_transaction_status(self: @TContractState, transaction_id: u256) -> felt252;
    fn is_transaction_confirmed(self: @TContractState, transaction_id: u256) -> bool;
}