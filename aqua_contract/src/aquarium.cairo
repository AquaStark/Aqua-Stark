use starknet::ContractAddress;

#[starknet::interface]
pub trait IAquarium<TContractState> {
    fn create_aquarium(
        ref self: TContractState, owner: ContractAddress, max_capacity: u32, max_decorations: u32,
    ) -> u256;
    fn update_aquarium_settings(
        ref self: TContractState, aquarium_id: u256, max_capacity: u32, max_decorations: u32,
    );
    fn clean_aquarium(ref self: TContractState, aquarium_id: u256, amount: u32);
    fn update_aquarium_cleanliness(ref self: TContractState, aquarium_id: u256, hours_passed: u32);
    fn add_fish_to_aquarium(ref self: TContractState, aquarium_id: u256, fish_id: u256);
    fn remove_fish_from_aquarium(ref self: TContractState, aquarium_id: u256, fish_id: u256);
    fn add_decoration_to_aquarium(ref self: TContractState, aquarium_id: u256, decoration_id: u256);
    fn remove_decoration_from_aquarium(
        ref self: TContractState, aquarium_id: u256, decoration_id: u256,
    );
    fn get_aquarium(
        self: @TContractState, aquarium_id: u256,
    ) -> aqua_stark::models::aquarium_model::Aquarium;
    fn get_aquarium_cleanliness(self: @TContractState, aquarium_id: u256) -> u32;
    fn get_aquarium_capacity(self: @TContractState, aquarium_id: u256) -> u32;
    fn get_aquarium_fish_count(self: @TContractState, aquarium_id: u256) -> u32;
    fn is_aquarium_full(self: @TContractState, aquarium_id: u256) -> bool;
    fn get_aquarium_owner(self: @TContractState, aquarium_id: u256) -> ContractAddress;
}


#[dojo::contract]
pub mod Aquarium {
    use dojo::world::IWorldDispatcherTrait;
    use aqua_stark::models::aquarium_model::{
        Aquarium as AquariumModel, AquariumTrait, AquariumCounter, AquariumOwner,
    };
    use aqua_stark::models::player_model::Player;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;
    use aqua_stark::base::events::{
        AquariumCreated, AquariumUpdated, AquariumCleaned, AquariumCleanlinessDecayed,
        FishAddedToAquarium, DecorationAddedToAquarium, FishRemovedFromAquarium,
        DecorationRemovedFromAquarium,
    };


    #[abi(embed_v0)]
    pub impl AquariumImpl of super::IAquarium<ContractState> {
        fn create_aquarium(
            ref self: ContractState,
            owner: ContractAddress,
            max_capacity: u32,
            max_decorations: u32,
        ) -> u256 {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Only allow the owner to create aquarium for themselves for now
            assert(caller == owner, 'Only owner can create');

            let aquarium_id = self.create_aquarium_id();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);
            aquarium =
                AquariumTrait::create_aquarium(aquarium_id, owner, max_capacity, max_decorations);

            let mut aquarium_owner: AquariumOwner = world.read_model(aquarium_id);
            aquarium_owner.owner = caller;

            let mut player: Player = world.read_model(caller);
            player.aquarium_count += 1;
            player.player_aquariums.append(aquarium.id);

            world.write_model(@player);
            world.write_model(@aquarium_owner);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @AquariumCreated {
                        aquarium_id,
                        owner,
                        max_capacity,
                        max_decorations,
                        timestamp: get_block_timestamp(),
                    },
                );

            aquarium_id
        }

        fn update_aquarium_settings(
            ref self: ContractState, aquarium_id: u256, max_capacity: u32, max_decorations: u32,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can update');

            let old_max_capacity = aquarium.max_capacity;
            let old_max_decorations = aquarium.max_decorations;

            aquarium = AquariumTrait::update_settings(aquarium, max_capacity, max_decorations);

            world.write_model(@aquarium);

            world
                .emit_event(
                    @AquariumUpdated {
                        aquarium_id,
                        owner: caller,
                        old_max_capacity,
                        new_max_capacity: max_capacity,
                        old_max_decorations,
                        new_max_decorations: max_decorations,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn clean_aquarium(ref self: ContractState, aquarium_id: u256, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can clean');

            let old_cleanliness = aquarium.cleanliness;
            aquarium = AquariumTrait::clean(aquarium, amount);

            world.write_model(@aquarium);

            world
                .emit_event(
                    @AquariumCleaned {
                        aquarium_id,
                        owner: caller,
                        amount_cleaned: amount,
                        old_cleanliness,
                        new_cleanliness: aquarium.cleanliness,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn update_aquarium_cleanliness(
            ref self: ContractState, aquarium_id: u256, hours_passed: u32,
        ) {
            let mut world = self.world_default();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            let old_cleanliness = aquarium.cleanliness;
            aquarium = AquariumTrait::update_cleanliness(aquarium, hours_passed);

            world.write_model(@aquarium);

            world
                .emit_event(
                    @AquariumCleanlinessDecayed {
                        aquarium_id,
                        hours_passed,
                        old_cleanliness,
                        new_cleanliness: aquarium.cleanliness,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn add_fish_to_aquarium(ref self: ContractState, aquarium_id: u256, fish_id: u256) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can add fish');
            assert(aquarium.housed_fish.len() < aquarium.max_capacity, 'Aquarium full');

            aquarium = AquariumTrait::add_fish(aquarium, fish_id);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @FishAddedToAquarium { aquarium_id, fish_id, timestamp: get_block_timestamp() },
                );
        }

        fn remove_fish_from_aquarium(ref self: ContractState, aquarium_id: u256, fish_id: u256) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can remove fish');

            aquarium = AquariumTrait::remove_fish(aquarium, fish_id);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @FishRemovedFromAquarium {
                        aquarium_id, fish_id, timestamp: get_block_timestamp(),
                    },
                );
        }

        fn add_decoration_to_aquarium(
            ref self: ContractState, aquarium_id: u256, decoration_id: u256,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can add deco');
            assert(
                aquarium.housed_decorations.len() < aquarium.max_decorations,
                'Aquarium deco limit reached',
            );

            aquarium = AquariumTrait::add_decoration(aquarium, decoration_id);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @DecorationAddedToAquarium {
                        aquarium_id, decoration_id, timestamp: get_block_timestamp(),
                    },
                );
        }

        fn remove_decoration_from_aquarium(
            ref self: ContractState, aquarium_id: u256, decoration_id: u256,
        ) {
            let mut world = self.world_default();
            let caller = get_caller_address();
            let mut aquarium: AquariumModel = world.read_model(aquarium_id);

            assert(aquarium.owner == caller, 'Only owner can remove deco');

            aquarium = AquariumTrait::remove_decoration(aquarium, decoration_id);
            world.write_model(@aquarium);

            world
                .emit_event(
                    @DecorationRemovedFromAquarium {
                        aquarium_id, decoration_id, timestamp: get_block_timestamp(),
                    },
                );
        }

        fn get_aquarium(self: @ContractState, aquarium_id: u256) -> AquariumModel {
            let world = self.world_default();
            world.read_model(aquarium_id)
        }

        fn get_aquarium_cleanliness(self: @ContractState, aquarium_id: u256) -> u32 {
            let aquarium = self.get_aquarium(aquarium_id);
            AquariumTrait::get_cleanliness(aquarium)
        }

        fn get_aquarium_capacity(self: @ContractState, aquarium_id: u256) -> u32 {
            let aquarium = self.get_aquarium(aquarium_id);
            AquariumTrait::get_capacity(aquarium)
        }

        fn get_aquarium_fish_count(self: @ContractState, aquarium_id: u256) -> u32 {
            let aquarium = self.get_aquarium(aquarium_id);
            AquariumTrait::get_fish_count(aquarium)
        }

        fn is_aquarium_full(self: @ContractState, aquarium_id: u256) -> bool {
            let aquarium = self.get_aquarium(aquarium_id);
            AquariumTrait::is_full(aquarium)
        }

        fn get_aquarium_owner(self: @ContractState, aquarium_id: u256) -> ContractAddress {
            let aquarium = self.get_aquarium(aquarium_id);
            aquarium.owner
        }
    }

    // Internal implementation for helper functions
    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn create_aquarium_id(ref self: ContractState) -> u256 {
            let mut world = self.world_default();
            let mut aquarium_counter: AquariumCounter = world.read_model('v0');
            let new_val = aquarium_counter.current_val + 1;
            aquarium_counter.current_val = new_val;
            world.write_model(@aquarium_counter);
            new_val
        }
    }
}
