use starknet::ContractAddress;

#[starknet::interaface]
pub trait IOwnership<TState> {
    fn owner(self: @TState) -> ContractAddress;
    fn transfer_ownership(ref self: TState, new_owner: ContractAddress);
    fn renounce_ownership(ref self: TState);
}

#[starknet::component]
pub mod Ownership {
    use core::num::traits::Zero;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_caller_address};
    use super::IOwnership;

    #[storage]
    pub struct Storage {
        pub Ownable_owner: ContractAddress
    }

    #[event]
    #[derive(Drop, Debug, PartialEq, starknet::Event)]
    pub enum Event {
        OwnershipTransferred: OwnershipTransferred,
        OwnershipTransferStarted: OwnershipTransferStarted,
    }

    /// Emitted when `new_owner` is set as owner of the contract.
    /// `new_owner` can be set to zero only if the ownership is renounced.
    #[derive(Drop, Debug, PartialEq, starknet::Event)]
    pub struct OwnershipTransferred {
        #[key]
        pub previous_owner: ContractAddress,
        #[key]
        pub new_owner: ContractAddress,
    }

    /// Emitted when `transfer_ownership` is called on a contract that implements `IOwnableTwoStep`.
    /// `previous_owner` is the address of the current owner.
    /// `new_owner` is the address of the pending owner.
    #[derive(Drop, Debug, PartialEq, starknet::Event)]
    pub struct OwnershipTransferStarted {
        #[key]
        pub previous_owner: ContractAddress,
        #[key]
        pub new_owner: ContractAddress,
    }

    pub mod Errors {
        pub const NOT_OWNER: felt252 = 'Caller is not the owner';
        pub const ZERO_ADDRESS_OWNER: felt252 = 'New owner is the zero address';
    }

    #[embeddable_as(OwnableImpl)]
    impl Ownable<
        TContractState, +HasComponent<TContractState>,
    > of IOwnership<ComponentState<TContractState>> {
        /// Returns the address of the current owner.
        fn owner(self: @ComponentState<TContractState>) -> ContractAddress {
            self.Ownable_owner.read()
        }

        /// Transfers ownership of the contract to a new address.
        fn transfer_ownership(
            ref self: ComponentState<TContractState>, new_owner: ContractAddress,
        ) {
            assert(!new_owner.is_zero(), Errors::ZERO_ADDRESS_OWNER);
            self.assert_only_owner();
            self._transfer_ownership(new_owner);
        }

        /// Leaves the contract without an owner. It will not be possible to call
        /// `assert_only_owner` functions anymore. Can only be called by the current owner.
        fn renounce_ownership(ref self: ComponentState<TContractState>) {
            self.assert_only_owner();
            self._transfer_ownership(Zero::zero());
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>,
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>, owner: ContractAddress) {
            assert(!owner.is_zero(), Errors::ZERO_ADDRESS_OWNER);
            self._transfer_ownership(owner);
        }
        fn assert_only_owner(self: @ComponentState<TContractState>) {
            let owner = self.Ownable_owner.read();
            let caller = get_caller_address();
            assert(caller == owner, Errors::NOT_OWNER);
        }
        fn _transfer_ownership(
            ref self: ComponentState<TContractState>, new_owner: ContractAddress,
        ) {
            self.Ownable_pending_owner.write(Zero::zero());

            let previous_owner: ContractAddress = self.Ownable_owner.read();
            self.Ownable_owner.write(new_owner);
            self.emit(OwnershipTransferred { previous_owner, new_owner });
        }
    }
}
