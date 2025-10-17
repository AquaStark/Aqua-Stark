// SPDX-License-Identifier: MIT
use starknet::ContractAddress;

#[starknet::interface]
pub trait IExternal<ContractState> {
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256);
}
#[starknet::contract]
pub mod AquaCoin {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{
        IERC20Dispatcher, IERC20DispatcherTrait, IERC20Metadata,
    };
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{ContractAddress, get_contract_address};
    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub erc20: ERC20Component::Storage,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        custom_decimals: u8,
        stark_address: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        recipient: ContractAddress,
        owner: ContractAddress,
        decimals: u8,
        stark_address: ContractAddress,
    ) {
        self.erc20.initializer(format!("AquaCoin"), format!("AQC"));
        self.ownable.initializer(owner);
        self.custom_decimals.write(decimals);
        self.stark_address.write(stark_address);
    }

    #[abi(embed_v0)]
    impl CustomERC20MetadataImpl of IERC20Metadata<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc20.name()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.erc20.symbol()
        }

        fn decimals(self: @ContractState) -> u8 {
            self.custom_decimals.read() // Return custom value
        }
    }

    // Keep existing implementations
    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ExternalImpl of super::IExternal<ContractState> {
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            let token = self.stark_address.read();
            let contract_address = get_contract_address();
            let success = IERC20Dispatcher { contract_address: token }
                .transfer(contract_address, amount);
            assert(success, 'STARK transfer failed');
            self.erc20.mint(recipient, amount);
        }
    }
}
