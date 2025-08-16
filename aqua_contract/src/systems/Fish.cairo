// dojo decorator
#[dojo::contract]
pub mod Fish {
    use starknet::ContractAddress;
    use aqua_stark::interfaces::IFish::IFish;
    use aqua_stark::models::fish_model::{Fish, FishParents, Species, Listing, FishOwner};
    use aqua_stark::models::trade_model::FishLock;

    #[abi(embed_v0)]
    impl FishImpl of IFish<ContractState> {

    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }
    }
}