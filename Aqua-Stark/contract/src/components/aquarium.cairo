use starknet::ContractAddress;

const AQUARIUM_ID_TARGET: felt252 = 'AQUARIUM';

#[starknet::interface]
pub trait IAquariumState<TContractState> {
    fn create_aquarium(ref self: TContractState, owner: ContractAddress, max_capacity: u32) -> u64;
    fn add_fish(ref self: TContractState, aquarium_id: u64, fish_id: u64) -> bool;
    fn remove_fish(ref self: TContractState, aquarium_id: u64, fish_id: u64) -> bool;
    fn clean(ref self: TContractState, aquarium_id: u64, amount: u32);
    fn update_cleanliness(ref self: TContractState, aquarium_id: u64, hours_passed: u32);
    fn get_cleanliness(self: @TContractState, aquarium_id: u64) -> u32;
    fn get_capacity(self: @TContractState, aquarium_id: u64) -> u32;
    fn get_fish_count(self: @TContractState, aquarium_id: u64) -> u32;
    fn is_full(self: @TContractState, aquarium_id: u64) -> bool;
}

#[dojo::contract]
pub mod AquariumState {
    use aqua_stark::entities::aquarium::Aquarium;
    use aqua_stark::entities::base::{
        AquariumCleaned, AquariumCreated, CleanlinessUpdated, CustomErrors, FishAdded, FishRemoved,
        Id,
    };
    use core::array::ArrayTrait;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::get_caller_address;
    use super::*;
    // use dojo::model::{ModelStorage, ModelValueStorage};
    // use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    #[abi(embed_v0)]
    impl AquariumStateImpl of IAquariumState<ContractState> {
        fn create_aquarium(
            ref self: ContractState, owner: ContractAddress, max_capacity: u32,
        ) -> u64 {
            let mut world = self.world_default();

            // Generate new aquarium ID
            let aquarium_id = self.generate_aquarium_id();

            // Create new aquarium
            let aquarium = Aquarium {
                id: aquarium_id,
                owner,
                max_capacity,
                cleanliness: 100_u32,
                housed_fish: ArrayTrait::new(),
            };

            // Write to world state
            world.write_model(@aquarium);

            // Emit event
            let created_event = AquariumCreated { id: aquarium.id, owner, max_capacity };
            world.emit_event(@created_event);

            aquarium_id
        }

        fn add_fish(ref self: ContractState, aquarium_id: u64, fish_id: u64) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current aquarium state
            let mut aquarium: Aquarium = world.read_model(aquarium_id);

            // Check ownership
            assert(aquarium.owner == caller, CustomErrors::NOT_OWNER);

            assert(!self.is_full(aquarium_id), CustomErrors::AQUARIUM_FULL);

            // Add fish
            aquarium.housed_fish.append(fish_id);

            // Write updated state
            world.write_model(@aquarium);

            // Emit event
            let fish_added_event = FishAdded { aquarium_id, fish_id };
            world.emit_event(@fish_added_event);

            true
        }

        fn remove_fish(ref self: ContractState, aquarium_id: u64, fish_id: u64) -> bool {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current aquarium state
            let mut aquarium: Aquarium = world.read_model(aquarium_id);

            // Check ownership
            assert(aquarium.owner == caller, CustomErrors::NOT_OWNER);

            assert(aquarium.housed_fish.len() > 0, CustomErrors::AQUARIUM_EMPTY);

            // Find and remove fish
            let mut found = false;
            let mut i = 0;
            let len = aquarium.housed_fish.len();
            let mut new_fish_array = ArrayTrait::new();

            while i < len {
                let current_fish = aquarium.housed_fish.at(i);
                if current_fish != @fish_id {
                    new_fish_array.append(*current_fish);
                } else {
                    found = true;
                }
                i += 1;
            }

            if found {
                aquarium.housed_fish = new_fish_array;
                // Write updated state
                world.write_model(@aquarium);
            }

            let removed_event = FishRemoved { aquarium_id, fish_id };
            world.emit_event(@removed_event);

            true
        }

        fn clean(ref self: ContractState, aquarium_id: u64, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Read current aquarium state
            let mut aquarium: Aquarium = world.read_model(aquarium_id);

            // Check ownership
            assert(aquarium.owner == caller, CustomErrors::NOT_OWNER);

            // Update cleanliness
            let new_cleanliness = if aquarium.cleanliness + amount > 100 {
                100_u32
            } else {
                aquarium.cleanliness + amount
            };

            aquarium.cleanliness = new_cleanliness;

            // Write updated state
            world.write_model(@aquarium);

            // Emit event
            let cleaned_event = AquariumCleaned { aquarium_id, amount, new_cleanliness };
            world.emit_event(@cleaned_event);
        }

        fn update_cleanliness(ref self: ContractState, aquarium_id: u64, hours_passed: u32) {
            let mut world = self.world_default();

            // Read current aquarium state
            let mut aquarium: Aquarium = world.read_model(aquarium_id);

            // Calculate cleanliness decrease
            let cleanliness_decrease = (hours_passed * aquarium.housed_fish.len() * 5) / 10;

            // Update cleanliness
            let new_cleanliness = if cleanliness_decrease > aquarium.cleanliness {
                0_u32
            } else {
                aquarium.cleanliness - cleanliness_decrease
            };

            aquarium.cleanliness = new_cleanliness;
            world.write_model(@aquarium);

            let updated_event = CleanlinessUpdated { aquarium_id, hours_passed, new_cleanliness };
            world.emit_event(@updated_event);
        }

        fn get_cleanliness(self: @ContractState, aquarium_id: u64) -> u32 {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium.cleanliness
        }

        fn get_capacity(self: @ContractState, aquarium_id: u64) -> u32 {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium.max_capacity
        }

        fn get_fish_count(self: @ContractState, aquarium_id: u64) -> u32 {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium.housed_fish.len()
        }

        fn is_full(self: @ContractState, aquarium_id: u64) -> bool {
            let mut world = self.world_default();
            let aquarium: Aquarium = world.read_model(aquarium_id);
            aquarium.housed_fish.len() >= aquarium.max_capacity
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            // self.world(@"aquastark")
            self.world(@"aqua_stark")
        }

        fn generate_aquarium_id(self: @ContractState) -> u64 {
            let mut world = self.world_default();
            let mut aquarium_id: Id = world.read_model(AQUARIUM_ID_TARGET);
            let new_id = aquarium_id.nonce + 1;
            aquarium_id.nonce = new_id;
            world.write_model(@aquarium_id);
            new_id
        }
    }
}
