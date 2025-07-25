use starknet::ContractAddress;
use aqua_stark::models::transaction_model::{TransactionLog, EventTypeDetails};

#[starknet::interface]
pub trait ITransactionHistory<TContractState> {
    fn register_event_type(ref self: TContractState, event_name: ByteArray) -> u256;

    fn log_event(
        ref self: TContractState,
        event_type_id: u256,
        player: ContractAddress,
        payload: Array<felt252>,
    ) -> TransactionLog;

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
}
