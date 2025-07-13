use starknet::ContractAddress;
use aqua_stark::models::transaction_model::{TransactionLog, EventTypeDetails};

#[starknet::interface]
pub trait ITransactionHistory<T> {
    fn register_event_type(
        ref self: T, event_name: ByteArray, event_logger: ContractAddress,
    ) -> u256;
    fn update_event_logger(ref self: T, event_type_id: u256, new_event_logger: ContractAddress);

    fn log_event(
        ref self: T, event_type_id: u256, player: ContractAddress, description: ByteArray,
    ) -> TransactionLog;

    fn get_event_types_count(self: @T) -> u256;
    fn get_all_event_types(self: @T) -> Span<EventTypeDetails>;
    fn get_event_type_details(self: @T, event_type_id: u256) -> EventTypeDetails;

    fn get_transaction_count(self: @T) -> u256;
    fn get_transaction_history(
        self: @T,
        player: Option<ContractAddress>,
        event_type_id: Option<u256>,
        start: Option<u32>,
        limit: Option<u32>,
        start_timestamp: Option<u64>,
        end_timestamp: Option<u64>,
    ) -> Span<TransactionLog>;
}
