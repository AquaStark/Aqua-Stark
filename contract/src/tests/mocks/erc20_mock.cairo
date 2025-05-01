use starknet::{ContractAddress};

#[starknet::interface]
pub trait IERC20MockPublic<TState> {
    fn mint(ref self: TState, recipient: ContractAddress, amount: u256);
}


#[dojo::contract]
pub mod erc20_mock {
    use starknet::ContractAddress;

    //-----------------------------------
    // OpenZeppelin start
    //
    use openzeppelin_token::erc20::ERC20Component;
    use openzeppelin_token::erc20::ERC20HooksEmptyImpl;
    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
    }
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
    }
    //
    // OpenZeppelin end
    //-----------------------------------

    //*******************************
    fn TOKEN_NAME() -> ByteArray {
        ("Test ERC20")
    }
    fn TOKEN_SYMBOL() -> ByteArray {
        ("T20")
    }
    //*******************************

    fn dojo_init(ref self: ContractState) {
        self.erc20.initializer(TOKEN_NAME(), TOKEN_SYMBOL());
    }


    //-----------------------------------
    // Public
    //
    use super::{IERC20MockPublic};
    #[abi(embed_v0)]
    impl ERC20MockPublicImpl of IERC20MockPublic<ContractState> {
        fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.erc20.mint(recipient, amount);
        }
    }
}
