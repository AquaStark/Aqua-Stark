#[cfg(test)]
mod tests {
    use aqua_stark::interfaces::IAquaStark::{
        IAquaStark, IAquaStarkDispatcher, IAquaStarkDispatcherTrait,
    };
    use aqua_stark::models::aquarium_model::{
        Aquarium, AquariumCounter, AquariumOwner, m_Aquarium, m_AquariumCounter, m_AquariumOwner,
    };
    use aqua_stark::models::decoration_model::{
        Decoration, DecorationCounter, m_Decoration, m_DecorationCounter,
    };
    use aqua_stark::models::fish_model::{
        Fish, FishCounter, FishOwner, FishTrait, Pattern, Species, m_Fish, m_FishCounter,
        m_FishOwner,
    };
    use aqua_stark::models::player_model::{
        AddressToUsername, Player, PlayerCounter, UsernameToAddress, m_AddressToUsername, m_Player,
        m_PlayerCounter, m_UsernameToAddress,
    };
    use aqua_stark::systems::AquaStark::AquaStark;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{ContractAddress, contract_address_const, get_caller_address, testing};


    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_PlayerCounter::TEST_CLASS_HASH),
                TestResource::Model(m_UsernameToAddress::TEST_CLASS_HASH),
                TestResource::Model(m_AddressToUsername::TEST_CLASS_HASH),
                TestResource::Model(m_Aquarium::TEST_CLASS_HASH),
                TestResource::Model(m_AquariumCounter::TEST_CLASS_HASH),
                TestResource::Model(m_AquariumOwner::TEST_CLASS_HASH),
                TestResource::Model(m_Fish::TEST_CLASS_HASH),
                TestResource::Model(m_FishCounter::TEST_CLASS_HASH),
                TestResource::Model(m_FishOwner::TEST_CLASS_HASH),
                TestResource::Model(m_Decoration::TEST_CLASS_HASH),
                TestResource::Model(m_DecorationCounter::TEST_CLASS_HASH),
                TestResource::Event(AquaStark::e_PlayerCreated::TEST_CLASS_HASH),
                TestResource::Contract(AquaStark::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"AquaStark")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
        ]
            .span()
    }


    #[test]
    fn test_register_player() {
        // Initialize test environment
        // let caller = starknet::contract_address_const::<0x0>();
        let caller_1 = contract_address_const::<'aji'>();
        // let caller_2 = contract_address_const::<'ajiii'>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        let username = 'Aji';
        // let username1 = 'Ajii';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(caller_1);
        actions_system.register(username);

        let player = actions_system.get_player(caller_1);
        let fish = actions_system.get_fish(1);
        let aquarium = actions_system.get_aquarium(1);
        let decoration = actions_system.get_decoration(1);

        assert(fish.owner == caller_1, 'Fish Error');
        assert(decoration.owner == caller_1, 'Decoration Error');
        assert(aquarium.owner == caller_1, 'Aquarium Error');
        assert(player.id == 1, 'Incorrect id');
        assert(player.username == 'Aji', 'incorrect username');
        assert(player.wallet == caller_1, 'invalid address');
        assert(player.fish_count == 1, 'invalid fish count');
        assert(player.aquarium_count == 1, 'invalid aquarium count');
        assert(player.decoration_count == 1, 'invalid aquarium count');
    }

    #[test]
    fn test_create_aquarium() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let aquarium = actions_system.new_aquarium(caller, 10, 10);
        let player = actions_system.get_player(caller);
        assert(aquarium.owner == caller, 'Aquarium owner mismatch');
        assert(aquarium.max_capacity == 10, 'Aquarium capacity mismatch');
        assert(player.aquarium_count == 2, 'Player aquarium count mismatch');
        assert(*player.player_aquariums[1] == aquarium.id, 'Player aquarium ID mismatch');
    }
    #[test]
    fn test_create_fish() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let fish = actions_system.new_fish(1, Species::GoldFish);
        let player = actions_system.get_player(caller);
        assert(fish.owner == caller, 'Fish owner mismatch');
        assert(fish.species == Species::GoldFish, 'Fish species mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_create_decoration() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let aquarium = actions_system.new_aquarium(caller, 10, 10);
        let decoration = actions_system.new_decoration(aquarium.id, 'Pebbles', 'Shiny rocks', 0, 0);
        let player = actions_system.get_player(caller);
        assert(decoration.owner == caller, 'Decoration owner mismatch');
        assert(decoration.name == 'Pebbles', 'Decoration name mismatch');
        assert(player.decoration_count == 2, 'Player deco count mismatch');
        assert(*player.player_decorations[1] == decoration.id, 'Player decoration ID mismatch');
    }

    #[test]
    fn test_create_fish_offspring() {
        // Initialize test environment
        // let caller = starknet::contract_address_const::<0x0>();
        let caller_1 = contract_address_const::<'aji'>();
        // let caller_2 = contract_address_const::<'ajiii'>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        let username = 'Aji';
        // let username1 = 'Ajii';

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(caller_1);
        actions_system.register(username);
        let parent_2 = actions_system.new_fish(1, Species::Betta);
        assert(parent_2.owner == caller_1, 'Parent Fish Error');
        assert(parent_2.species == Species::Betta, 'Parent Fish Species Error');
        assert(parent_2.id == 2, 'Parent Fish ID Error');
        assert(parent_2.owner == caller_1, 'Parent Fish Owner Error');

        let offsping = actions_system.breed_fishes(1, parent_2.id);

        let player = actions_system.get_player(caller_1);

        // Retrieve the offspring fish

        let offspring_fish = actions_system.get_fish(offsping);

        assert(offspring_fish.owner == caller_1, 'Offspring Fish Error');
        assert(offspring_fish.species == Species::Hybrid, 'Offspring Fish Species Error');
        assert(player.fish_count == 3, 'Player fish count mismatch ');
        assert(*player.player_fishes[2] == offspring_fish.id, 'Player offspring fish ID ');

        let (parent1_id, parent2_id) = actions_system.get_parents(offspring_fish.id);
        assert(parent1_id == 1, 'Parent 1 ID mismatch');
        assert(parent2_id == parent_2.id, 'Parent 2 ID mismatch');

        let parent1k = actions_system.get_fish_offspring(1);
        let parent2k = actions_system.get_fish_offspring(parent_2.id);
        assert(parent1k.len() == 1, '1 offspring mismatch');
        assert(parent2k.len() == 1, '2 offspring mismatch');
        assert(*parent1k[0].id == offspring_fish.id, 'Parent 1 offspring ID mismatch');
        assert(*parent2k[0].id == offspring_fish.id, 'Parent 2 offspring ID mismatch');
    }

    #[test]
    fn test_move_fish_to_aquarium() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);

        actions_system.register('Aji');
        let aquarium = actions_system.new_aquarium(caller, 10, 10);

        let fish = actions_system.new_fish(1, Species::GoldFish);

        let move_result = actions_system.move_fish_to_aquarium(fish.id, 1, aquarium.id);

        let updated_fish = actions_system.get_fish(fish.id);
        let updated_aquarium = actions_system.get_aquarium(aquarium.id);
        let player = actions_system.get_player(caller);

        assert(move_result, 'Fish move failed');
        assert(updated_fish.aquarium_id == aquarium.id, 'Fish aquarium ID mismatch');
        assert(updated_aquarium.fish_count == 1, 'Aquarium fish count mismatch');
        assert(*updated_aquarium.housed_fish[0] == updated_fish.id, 'Aquarium fish ID mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == updated_fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_move_decoration_to_aquarium() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let aquarium = actions_system.new_aquarium(caller, 10, 10);
        let decoration = actions_system.new_decoration(1, 'Pebbles', 'Shiny rocks', 0, 0);
        let move_result = actions_system.move_decoration_to_aquarium(decoration.id, 1, aquarium.id);

        let updated_decoration = actions_system.get_decoration(decoration.id);
        let updated_aquarium = actions_system.get_aquarium(aquarium.id);
        let player = actions_system.get_player(caller);
        assert(move_result, 'Decoration move failed');
        assert(updated_decoration.aquarium_id == aquarium.id, 'Decoration ID mismatch');
        assert(updated_aquarium.decoration_count == 1, 'decoration count mismatch');
        assert(
            *updated_aquarium.housed_decorations[0] == updated_decoration.id,
            'decoration ID mismatch',
        );
        assert(player.decoration_count == 2, 'Player count mismatch');
        assert(*player.player_decorations[1] == updated_decoration.id, 'Player ID mismatch');
    }

    #[test]
    fn test_get_player_fishes() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let fish1 = actions_system.new_fish(1, Species::GoldFish);
        let fish2 = actions_system.new_fish(1, Species::Betta);
        let player_fishes = actions_system.get_player_fishes(caller);
        assert(player_fishes.len() == 3, 'Player fishes count mismatch');
        assert(*player_fishes[1].id == fish1.id, 'Player fish 1 ID mismatch');
        assert(*player_fishes[2].id == fish2.id, 'Player fish 2 ID mismatch');
    }
}

