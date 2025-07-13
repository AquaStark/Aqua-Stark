#[cfg(test)]
mod tests {
    use dojo::world::IWorldDispatcherTrait;
    use aqua_stark::interfaces::IAquaStark::{
        IAquaStark, IAquaStarkDispatcher, IAquaStarkDispatcherTrait,
    };
    use aqua_stark::interfaces::ITransactionHistory::{
        ITransactionHistory, ITransactionHistoryDispatcher, ITransactionHistoryDispatcherTrait,
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
    use aqua_stark::models::transaction_model::{
        TransactionLog, EventTypeDetails, EventCounter, TransactionCounter, m_TransactionLog,
        m_EventTypeDetails, m_EventCounter, m_TransactionCounter,
    };


    use aqua_stark::systems::AquaStark::AquaStark;
    use aqua_stark::base::events;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{contract_address_const, testing, get_block_timestamp, ContractAddress};


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
                TestResource::Model(m_TransactionLog::TEST_CLASS_HASH),
                TestResource::Model(m_EventTypeDetails::TEST_CLASS_HASH),
                TestResource::Model(m_EventCounter::TEST_CLASS_HASH),
                TestResource::Model(m_TransactionCounter::TEST_CLASS_HASH),
                TestResource::Event(AquaStark::e_PlayerEventLogged::TEST_CLASS_HASH),
                TestResource::Event(AquaStark::e_EventTypeRegistered::TEST_CLASS_HASH),
                TestResource::Event(events::e_PlayerCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishBred::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishMoved::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationMoved::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishAddedToAquarium::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationAddedToAquarium::TEST_CLASS_HASH),
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

    fn test_get_fish_family_tree() {
        // Initialize test environment
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);
        actions_system.register('Aji');
        let parent_1 = actions_system.new_fish(1, Species::GoldFish);
        let parent_2 = actions_system.new_fish(1, Species::Betta);
        let offspring_id = actions_system.breed_fishes(parent_1.id, parent_2.id);
        let family_tree = actions_system.get_fish_family_tree(offspring_id);
        assert(family_tree.len() == 1, 'Family tree length mismatch');
        assert(*family_tree[0].parent1 == parent_1.id, 'Parent 1 ID mismatch');
        assert(*family_tree[0].parent2 == parent_2.id, 'Parent 2 ID mismatch');
    }

    #[test]
    fn test_get_fish_ancestor_three_generations() {
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);

        actions_system.register('Aji');

        let parent_1 = actions_system.new_fish(1, Species::GoldFish);
        let parent_2 = actions_system.new_fish(1, Species::Betta);
        let parent_3 = actions_system.new_fish(1, Species::AngelFish);
        let parent_4 = actions_system.new_fish(1, Species::GoldFish);

        let offspring_id = actions_system.breed_fishes(parent_1.id, parent_2.id);

        let grandchild_id = actions_system.breed_fishes(offspring_id, parent_3.id);

        let great_grandchild_id = actions_system.breed_fishes(grandchild_id, parent_4.id);

        // Adjusted order: newest first
        let ancestor_0 = actions_system.get_fish_ancestor(grandchild_id, 0);
        assert(ancestor_0.parent1 == parent_1.id, 'Gen 0 Parent 1 mismatch');
        assert(ancestor_0.parent2 == parent_2.id, 'Gen 0 Parent 2 mismatch');

        let ancestor_1 = actions_system.get_fish_ancestor(grandchild_id, 1);
        assert(ancestor_1.parent1 == offspring_id, 'Gen 1 Parent 1 mismatch');
        assert(ancestor_1.parent2 == parent_3.id, 'Gen 1 Parent 2 mismatch');

        let ancestor_2 = actions_system.get_fish_ancestor(great_grandchild_id, 2);
        assert(ancestor_2.parent1 == grandchild_id, 'Gen 2 Parent 1 mismatch');
        assert(ancestor_2.parent2 == parent_4.id, 'Gen 2 Parent 2 mismatch');
    }

    #[test]
    #[should_panic]
    fn test_get_fish_ancestor_out_of_bounds() {
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(caller);

        actions_system.register('Aji');

        let parent_1 = actions_system.new_fish(1, Species::GoldFish);
        let parent_2 = actions_system.new_fish(1, Species::Betta);

        let offspring_id = actions_system.breed_fishes(parent_1.id, parent_2.id);

        let grandchild_id = actions_system.breed_fishes(parent_1.id, offspring_id);

        // This should panic: only 2 generations recorded (0 and 1)
        let _ = actions_system.get_fish_ancestor(grandchild_id, 2);
     }

    #[test]
    fn test_register_event() {
        world.dispatcher.grant_owner(0, caller);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(caller);
        let id = actions_system.register_event_type("Purchase Event");

        let event_details = actions_system.get_event_type_details(id);

        assert(event_details.type_id == id, 'Event ID mismatch');
        assert(event_details.name == "Purchase Event", 'Event Name mismatch');
        assert(event_details.total_logged == 0, 'Total logged mismatch');
        assert(event_details.transaction_history.len() == 0, 'Txn History count mismatch');
    }

    #[derive(Serde, Drop, Clone, Copy)]
    pub struct DummyEvent {
        pub fish_id: u256,
        pub aquarium_id: u256,
        pub player: ContractAddress,
        pub species: Species,
        pub timestamp: u64,
    }

    #[test]
    fn test_log_event_successfully() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id = actions_system.register_event_type("NewFishCreated");

        let payload = get_dummy_payload();

        let txn_log = actions_system.log_event(event_id, player, payload.clone());

        assert(txn_log.player == player, 'txn player mismatch');
        assert(txn_log.event_type_id == event_id, 'txn event id mismatch');
        assert(txn_log.payload == payload, 'txn payload mismatch');
    }

    #[test]
    fn test_get_transaction_history_successfully_by_player_address() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        let txn_log_1 = actions_system.log_event(event_id_1, player, payload.clone());

        let txn_log_2 = actions_system.log_event(event_id_2, player, payload.clone());

        let player_txn = actions_system
            .get_transaction_history(
                Option::Some(player),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
                Option::None,
            );
        assert(player_txn.len() == 2, 'player_txn count mismatch');
        assert(player_txn.at(0).event_type_id == @txn_log_1.event_type_id, 'event id mismatch');
        assert(player_txn.at(0).id == @txn_log_1.id, 'txn id mismatch');
        assert(player_txn.at(0).payload == @txn_log_1.payload, 'txn payload mismatch');
        assert(player_txn.at(0).player == @txn_log_1.player, 'txn player mismatch');
        assert(player_txn.at(1).event_type_id == @txn_log_2.event_type_id, 'event id mismatch');
        assert(player_txn.at(1).id == @txn_log_2.id, 'txn id mismatch');
        assert(player_txn.at(1).payload == @txn_log_2.payload, 'txn payload mismatch');
        assert(player_txn.at(1).player == @txn_log_2.player, 'txn player mismatch');
    }

    #[test]
    fn test_get_transaction_history_successfully_by_event_id() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        actions_system.log_event(event_id_1, player, payload.clone());

        let txn_log_2 = actions_system.log_event(event_id_2, player, payload.clone());

        let event_txn = actions_system
            .get_transaction_history(
                Option::None,
                Option::Some(event_id_2),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
            );

        assert(event_txn.len() == 1, 'count mismatch');
        assert(event_txn.at(0).event_type_id == @txn_log_2.event_type_id, 'event id mismatch');
        assert(event_txn.at(0).id == @txn_log_2.id, 'txn id mismatch');
        assert(event_txn.at(0).payload == @txn_log_2.payload, 'txn payload mismatch');
        assert(event_txn.at(0).player == @txn_log_2.player, 'txn player mismatch');
    }

    #[test]
    fn test_get_transaction_history_successfully_by_event_type_and_player() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        let txn_log_1 = actions_system.log_event(event_id_1, player, payload.clone());

        let _ = actions_system.log_event(event_id_2, player, payload.clone());

        let event_txn = actions_system
            .get_transaction_history(
                Option::Some(player),
                Option::Some(event_id_1),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
            );

        assert(event_txn.len() == 1, 'count mismatch');
        assert(event_txn.at(0).event_type_id == @txn_log_1.event_type_id, 'event id mismatch');
        assert(event_txn.at(0).id == @txn_log_1.id, 'txn id mismatch');
        assert(event_txn.at(0).payload == @txn_log_1.payload, 'txn payload mismatch');
        assert(event_txn.at(0).player == @txn_log_1.player, 'txn player mismatch');
    }

    #[test]
    fn test_get_transaction_history_with_no_filters_returns_all() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };

        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        actions_system.log_event(event_id_1, player, payload.clone());

        actions_system.log_event(event_id_2, player2, payload.clone());

        actions_system.log_event(event_id_1, player2, payload.clone());

        let tx_log_4 = actions_system.log_event(event_id_2, player, payload.clone());

        let event_txn = actions_system
            .get_transaction_history(
                Option::None, Option::None, Option::None, Option::None, Option::None, Option::None,
            );

        assert(event_txn.len() == 4, 'count mismatch');
        assert(event_txn.at(3).event_type_id == @tx_log_4.event_type_id, 'event id mismatch');
        assert(event_txn.at(3).id == @tx_log_4.id, 'txn id mismatch');
        assert(event_txn.at(3).payload == @tx_log_4.payload, 'txn payload mismatch');
        assert(event_txn.at(3).player == @tx_log_4.player, 'txn player mismatch');
    }

    #[test]
    fn test_get_transaction_history_with_unmatched_event_type() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        actions_system.log_event(event_id_1, player, payload.clone());

        actions_system.log_event(event_id_2, player2, payload.clone());

        let event_txn = actions_system
            .get_transaction_history(
                Option::None,
                Option::Some(5),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
            );

        assert(event_txn.len() == 0, 'count mismatch');
    }

    #[test]
    fn test_get_transaction_history_with_unmatched_player() {
        // Initialize test environment
        let owner = contract_address_const::<'owner'>();
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, owner);

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(owner);
        let event_id_1 = actions_system.register_event_type("NewFishCreated");
        let event_id_2 = actions_system.register_event_type("NewAquariumCreated");

        let payload = get_dummy_payload();

        actions_system.log_event(event_id_1, player, payload.clone());

        actions_system.log_event(event_id_2, player2, payload.clone());

        let event_txn = actions_system
            .get_transaction_history(
                Option::Some(contract_address_const::<'player5'>()),
                Option::None,
                Option::None,
                Option::None,
                Option::None,
                Option::None,
            );

        assert(event_txn.len() == 0, 'count mismatch');
    }

    fn get_dummy_payload() -> Array<felt252> {
        let new_event = DummyEvent {
            fish_id: 100,
            aquarium_id: 12,
            species: Species::Betta,
            player: contract_address_const::<0>(),
            timestamp: get_block_timestamp(),
        };

        let mut payload: Array<felt252> = array![];

        new_event.fish_id.serialize(ref payload);
        new_event.aquarium_id.serialize(ref payload);
        new_event.species.serialize(ref payload);
        new_event.timestamp.serialize(ref payload);
    }
}

