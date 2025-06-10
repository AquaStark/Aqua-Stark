// dojo decorator
#[dojo::contract]
pub mod AquaStark {
    use aqua_stark_od::interfaces::IAquaStark::IAquaStark;
    use aqua_stark_od::models::fish_model::{Fish, FishCounter, FishOwner, FishTrait, Species};

    use dojo::model::ModelStorage;
    use starknet::{ContractAddress, get_caller_address};


    #[abi(embed_v0)]
    impl AquaStarkImpl of IAquaStark<ContractState> {
        fn create_fish_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut fish_counter: FishCounter = world.read_model('v0');
            let new_val = fish_counter.current_val + 1;
            fish_counter.current_val = new_val;
            world.write_model(@fish_counter);
            new_val
        }

        fn new_fish(ref self: ContractState, owner: ContractAddress, species: Species) -> Fish {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let fish_id = self.create_fish_id();
            let mut fish: Fish = world.read_model(fish_id);

            fish = FishTrait::create_fish_by_species(fish, caller, species);

            let mut fish_owner: FishOwner = world.read_model(fish_id);
            fish_owner.owner = caller;

            world.write_model(@fish_owner);
            world.write_model(@fish);
            fish
        }

        fn get_fish(ref self: ContractState, id: u256) -> Fish {
            let mut world = self.world_default();
            let fish: Fish = world.read_model(id);
            fish
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

