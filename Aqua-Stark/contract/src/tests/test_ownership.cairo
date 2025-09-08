use starknet::{ContractAddress, testing};
use crate::systems::ownership::Ownership;

#[starknet::contract]
mod MockContract {
    use starknet::ContractAddress;
    use crate::systems::ownership::Ownership;

    component!(path: Ownership, storage: ownable, event: OwnableEvent);

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableMixinImpl = Ownership::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = Ownership::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub ownable: Ownership::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: Ownership::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[generate_trait]
    pub impl PrivateImpl of PrivateTrait {
        fn mock_initializer(ref self: ContractState, owner: ContractAddress) {
            self.ownable.initializer(owner);
        }
        fn mock_owner(self: @ContractState) -> ContractAddress {
            self.ownable.owner()
        }
        fn mock_transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            self.ownable.transfer_ownership(new_owner);
        }
        fn mock_renounce_ownership(ref self: ContractState) {
            self.ownable.renounce_ownership();
        }
    }
}

type TestingState = Ownership::ComponentState<MockContract::ContractState>;

impl TestingStateDefault of Default<TestingState> {
    fn default() -> TestingState {
        Ownership::component_state_for_testing()
    }
}
use MockContract::PrivateTrait;

#[test]
fn test_ownership_component() {
    // Test the ownership component
    let mut state: MockContract::ContractState = MockContract::contract_state_for_testing();
    // define test data
    let owner: ContractAddress = 'owner'.try_into().unwrap();
    let second_owner = 'second_owner'.try_into().unwrap();

    // test initializer
    state.mock_initializer(owner); // add initial owner
    // check if owner matches
    assert(state.mock_owner() == owner, 'Unknown owner');

    //test transfer owner
    testing::set_contract_address(owner); // cheat caller
    state.mock_transfer_ownership(second_owner); // transfer ownership
    assert(state.mock_owner() == second_owner, 'Unknown new owner');

    // test renounce ownership
    testing::set_contract_address(second_owner); // cheat caller
    state.mock_renounce_ownership(); // renounce ownership
    assert(state.mock_owner() == 0.try_into().unwrap(), 'not zero owner');
}
