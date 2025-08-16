#[cfg(test)]
mod tests {
    use dojo::world::IWorldDispatcherTrait;
    use dojo::model::ModelStorage;
    use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
    use aqua_stark::interfaces::IShopCatalog::{
        IShopCatalog, IShopCatalogDispatcher, IShopCatalogDispatcherTrait,
    };
    use aqua_stark::interfaces::ITransactionHistory::{
        ITransactionHistoryDispatcher, ITransactionHistoryDispatcherTrait,
    };
    use aqua_stark::models::aquarium_model::{m_Aquarium, m_AquariumCounter, m_AquariumOwner};
    use aqua_stark::models::decoration_model::{m_Decoration, m_DecorationCounter};
    use aqua_stark::models::fish_model::{
        FishOwner, Species, Listing, m_Listing, m_Fish, m_FishCounter, m_FishOwner,
    };
    use aqua_stark::models::player_model::{
        m_AddressToUsername, m_Player, m_PlayerCounter, m_UsernameToAddress,
    };
    use aqua_stark::models::shop_model::{
        ShopItemModel, ShopCatalogModel, m_ShopItemModel, m_ShopCatalogModel,
    };
    use aqua_stark::models::transaction_model::{
        m_TransactionLog, m_EventTypeDetails, m_EventCounter, m_TransactionCounter,
    };
    use aqua_stark::models::auctions_model::{m_Auction, m_AuctionCounter};
    use aqua_stark::models::experience_model::{
        m_Experience, m_ExperienceConfig, m_ExperienceCounter,
    };
    use aqua_stark::interfaces::IExperience::{IExperienceDispatcher, IExperienceDispatcherTrait};
    use aqua_stark::systems::experience::experience;
    use aqua_stark::systems::AquaStark::AquaStark;
    use aqua_stark::systems::ShopCatalog::ShopCatalog;
    use aqua_stark::base::events;
    // use dojo::model::{ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{contract_address_const, testing, get_block_timestamp, ContractAddress};

    fn OWNER() -> ContractAddress {
        contract_address_const::<'owner'>()
    }

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_Auction::TEST_CLASS_HASH),
                TestResource::Model(m_AuctionCounter::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_PlayerCounter::TEST_CLASS_HASH),
                TestResource::Model(m_ShopItemModel::TEST_CLASS_HASH),
                TestResource::Model(m_ShopCatalogModel::TEST_CLASS_HASH),
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
                TestResource::Model(m_Listing::TEST_CLASS_HASH),
                TestResource::Model(m_Experience::TEST_CLASS_HASH),
                TestResource::Model(m_ExperienceConfig::TEST_CLASS_HASH),
                TestResource::Model(m_ExperienceCounter::TEST_CLASS_HASH),
                TestResource::Event(events::e_PlayerEventLogged::TEST_CLASS_HASH),
                TestResource::Event(events::e_EventTypeRegistered::TEST_CLASS_HASH),
                TestResource::Event(events::e_PlayerCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishBred::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishMoved::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationMoved::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishAddedToAquarium::TEST_CLASS_HASH),
                TestResource::Event(events::e_DecorationAddedToAquarium::TEST_CLASS_HASH),
                TestResource::Event(events::e_FishPurchased::TEST_CLASS_HASH),
                TestResource::Event(events::e_AuctionStarted::TEST_CLASS_HASH),
                TestResource::Event(events::e_BidPlaced::TEST_CLASS_HASH),
                TestResource::Event(events::e_AuctionEnded::TEST_CLASS_HASH),
                TestResource::Event(events::e_ExperienceEarned::TEST_CLASS_HASH),
                TestResource::Event(events::e_LevelUp::TEST_CLASS_HASH),
                TestResource::Event(events::e_RewardClaimed::TEST_CLASS_HASH),
                TestResource::Event(events::e_ExperienceConfigUpdated::TEST_CLASS_HASH),
                TestResource::Contract(AquaStark::TEST_CLASS_HASH),
                TestResource::Contract(ShopCatalog::TEST_CLASS_HASH),
                TestResource::Contract(experience::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"AquaStark")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
            ContractDefTrait::new(@"aqua_stark", @"ShopCatalog")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
                .with_init_calldata([OWNER().into()].span()),
            ContractDefTrait::new(@"aqua_stark", @"experience")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
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
        let caller = contract_address_const::<'aji'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
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
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let username = 'player';
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register(username);

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };

        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();

        // First Register player
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player_1');

        testing::set_contract_address(player2);
        actions_system.register('player_2');

        // Next Register Event
        let actions_system = ITransactionHistoryDispatcher { contract_address };
        testing::set_contract_address(OWNER());
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

    #[test]
    fn test_add_new_item_to_shop_catalog() {
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"ShopCatalog").unwrap();
        let shop_catalog_system = IShopCatalogDispatcher { contract_address };
        testing::set_contract_address(OWNER());

        // Add new item to shop catalog
        shop_catalog_system.add_new_item(100, 100, 'test');

        // Get shop item from shop catalog
        let shop_item: ShopItemModel = world.read_model(1_u256);
        assert(shop_item.price == 100, 'price mismatch');
        assert(shop_item.stock == 100, 'stock mismatch');
        assert(shop_item.description == 'test', 'description mismatch');
    }

    #[test]
    fn test_update_item_shop_catalog() {
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"ShopCatalog").unwrap();
        let shop_catalog_system = IShopCatalogDispatcher { contract_address };
        testing::set_contract_address(OWNER());

        // Add new item to shop catalog
        shop_catalog_system.add_new_item(100, 100, 'test');

        // Update item in shop catalog
        shop_catalog_system.update_item(1_u256, 200, 200, 'test2');

        // Get shop item from shop catalog
        let shop_item: ShopItemModel = world.read_model(1_u256);
        assert(shop_item.price == 200, 'price mismatch');
        assert(shop_item.stock == 200, 'stock mismatch');
        assert(shop_item.description == 'test2', 'description mismatch');
    }

    #[test]
    fn test_get_item_shop_catalog() {
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"ShopCatalog").unwrap();
        let shop_catalog_system = IShopCatalogDispatcher { contract_address };
        testing::set_contract_address(OWNER());

        // Add new item to shop catalog
        shop_catalog_system.add_new_item(100, 100, 'test');

        // Get item from shop catalog
        let item_retrieved = shop_catalog_system.get_item(1);
        assert(item_retrieved.price == 100, 'price mismatch');
        assert(item_retrieved.stock == 100, 'stock mismatch');
        assert(item_retrieved.description == 'test', 'description mismatch');
    }

    #[test]
    fn test_get_all_items_shop_catalog() {
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"ShopCatalog").unwrap();
        let shop_catalog_system = IShopCatalogDispatcher { contract_address };
        testing::set_contract_address(OWNER());

        // Add 2 new items to shop catalog
        shop_catalog_system.add_new_item(100, 100, 'test');
        shop_catalog_system.add_new_item(200, 200, 'test2');

        // Get all items from shop catalog
        let items_retrieved = shop_catalog_system.get_all_items();
        println!("items_retrieved: {:?}", items_retrieved);
        assert(items_retrieved.len() == 2, 'items mismatch');
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

        payload
    }

    #[test]
    fn test_list_fish() {
        let player = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(OWNER());
        actions_system.register('owner');

        testing::set_contract_address(player);
        actions_system.register('player');

        let aquarium = actions_system.new_aquarium(player, 10, 10);
        let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);
        let listing = actions_system.list_fish(fish.id, 100);
        assert(listing.is_active, 'Listing is not active');
        assert(listing.fish_id == fish.id, 'Fish ID mismatch');
        assert(listing.price == 100, 'Price mismatch');
    }

    #[test]
    #[should_panic]
    fn test_list_fish_not_owner() {
        let player = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(OWNER());
        actions_system.register('owner');

        testing::set_contract_address(player);
        actions_system.register('player');

        let aquarium = actions_system.new_aquarium(player, 10, 10);
        let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);

        testing::set_contract_address(OWNER());
        actions_system
            .list_fish(fish.id, 100); // should fail because owner is not the owner of the fish
    }

    #[test]
    fn test_purchase_fish() {
        let player = contract_address_const::<'player'>();
        let player2 = contract_address_const::<'player2'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };
        testing::set_contract_address(OWNER());
        actions_system.register('owner');

        testing::set_contract_address(player);
        actions_system.register('player');

        testing::set_contract_address(player2);
        actions_system.register('player2');

        // Create a new aquarium for the player
        testing::set_contract_address(player);
        let aquarium = actions_system.new_aquarium(player, 10, 10);

        let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);
        let listing = actions_system.list_fish(fish.id, 100);

        // Change caller to player2
        testing::set_contract_address(player2);
        // Purchase the fish
        actions_system.purchase_fish(listing.id);

        let fish = actions_system.get_fish(fish.id);
        assert(fish.owner == player2, 'Fish owner mismatch');
        let listing: Listing = actions_system.get_listing(listing.id);
        assert(!listing.is_active, 'Listing is not active');
    }

    #[test]
    #[should_panic]
    fn test_purchase_fish_fail_already_own_fish() {
        let player = contract_address_const::<'player'>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());
        world.dispatcher.grant_owner(0, OWNER());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let actions_system = IAquaStarkDispatcher { contract_address };

        testing::set_contract_address(player);
        actions_system.register('player');

        let aquarium = actions_system.new_aquarium(player, 10, 10);
        let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);
        let listing = actions_system.list_fish(fish.id, 100);

        testing::set_contract_address(player);
        actions_system
            .purchase_fish(listing.id); // should fail because player already owns the fish
    }
    // #[test]
// fn test_start_auction() {
//     let caller = contract_address_const::<'seller'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());
//     // world.grant_owner(0, seller);

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     // Register player and create a fish
//     testing::set_contract_address(caller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);

    //     // Start auction
//     let duration = 3600; // 1 hour
//     let reserve_price = 100;
//     let auction = actions_system.start_auction(fish.id, duration, reserve_price);

    //     //     // Verify auction details
//     assert(auction.auction_id == 0, 'Auction ID mismatch');
//     assert(auction.seller == caller, 'Seller mismatch');
//     assert(auction.fish_id == fish.id, 'Fish ID mismatch');
//     assert(auction.reserve_price == reserve_price, 'Reserve price mismatch');
//     assert(auction.highest_bid == 0, 'Initial bid should be 0');
//     assert(auction.highest_bidder == Option::None(()), 'Initial bidder should be none');
//     assert(auction.active, 'Auction should be active');

    //     //     // Verify fish is locked
//     let fish_owner: FishOwner = actions_system.get_fish_owner_for_auction(fish.id);
//     assert(fish_owner.locked, 'Fish should be locked');
// }

    // #[test]
// #[should_panic]
// fn test_start_auction_not_owner() {
//     let not_owner = contract_address_const::<'not_owner'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     // Owner creates fish
//     testing::set_contract_address(OWNER());
//     actions_system.register('owner');
//     let fish = actions_system.new_fish(1, Species::GoldFish);

    //     // Not owner tries to start auction
//     testing::set_contract_address(not_owner);
//     actions_system.start_auction(fish.id, 3600, 100);
// }

    // #[test]
// #[should_panic]
// fn test_start_auction_already_locked() {
//     let caller = contract_address_const::<'seller'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     testing::set_contract_address(caller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);

    //     // Start first auction
//     actions_system.start_auction(fish.id, 3600, 100);

    //     // Try to start another auction with same fish
//     actions_system.start_auction(fish.id, 3600, 100);
// }

    // #[test]
// fn test_place_bid() {
//     let seller = contract_address_const::<'seller'>();
//     let bidder = contract_address_const::<'bidder'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     // Seller creates fish and starts auction
//     testing::set_contract_address(seller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);
//     let auction = actions_system.start_auction(fish.id, 3600, 100);

    //     // Bidder places bid
//     testing::set_contract_address(bidder);
//     actions_system.register('bidder');
//     let bid_amount = 150;
//     actions_system.place_bid(auction.auction_id, bid_amount);

    //     // Verify auction updated
//     let updated_auction = actions_system.get_auction_by_id(auction.auction_id);
//     assert(updated_auction.highest_bid == bid_amount, 'Bid amount not updated');
//     assert(updated_auction.highest_bidder == Option::Some(bidder), 'Bidder not updated');
// }

    // #[test]
// #[should_panic]
// fn test_place_bid_too_low() {
//     let seller = contract_address_const::<'seller'>();
//     let bidder = contract_address_const::<'bidder'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     testing::set_contract_address(seller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);
//     let auction = actions_system.start_auction(fish.id, 3600, 100);

    //     testing::set_contract_address(bidder);
//     actions_system.register('bidder');

    //     // First valid bid
//     actions_system.place_bid(auction.auction_id, 150);

    //     // Second bid that's too low
//     actions_system.place_bid(auction.auction_id, 140);
// }

    // #[test]
// #[should_panic]
// fn test_place_bid_below_reserve() {
//     let seller = contract_address_const::<'seller'>();
//     let bidder = contract_address_const::<'bidder'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     testing::set_contract_address(seller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);
//     let auction = actions_system.start_auction(fish.id, 3600, 100);

    //     testing::set_contract_address(bidder);
//     actions_system.register('bidder');

    //     // Bid below reserve price
//     actions_system.place_bid(auction.auction_id, 90);
// }

    // #[test]
// fn test_end_auction_with_winner() {
//     let seller = contract_address_const::<'seller'>();
//     let bidder = contract_address_const::<'bidder'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     // Seller creates fish and starts auction
//     testing::set_contract_address(seller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);
//     let auction = actions_system.start_auction(fish.id, 3600, 100);

    //     // Bidder places bid
//     testing::set_contract_address(bidder);
//     actions_system.register('bidder');
//     let bid_amount = 150;
//     actions_system.place_bid(auction.auction_id, bid_amount);

    //     // Fast forward time to end auction
//     testing::set_block_timestamp(auction.end_time + 1);

    //     // End auction
//     testing::set_contract_address(seller);
//     actions_system.end_auction(auction.auction_id);

    //     // Verify auction is closed
//     let updated_auction = actions_system.get_auction_by_id(auction.auction_id);
//     assert(!updated_auction.active, 'Auction should be inactive');

    //     // Verify fish ownership transferred
//     let fish_owner = actions_system.get_fish_owner(fish.id);
//     assert(fish_owner == bidder, 'Fish should belong to bidder');

    //     // Verify fish is unlocked
//     let fish_owner_model: FishOwner = actions_system.get_fish_owner_for_auction(fish.id);
//     assert(!fish_owner_model.locked, 'Fish should be unlocked');
// }

    // #[test]
// fn test_end_auction_no_winner() {
//     let seller = contract_address_const::<'seller'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     // Seller creates fish and starts auction
//     testing::set_contract_address(seller);
//     actions_system.register('seller');
//     let fish = actions_system.new_fish(1, Species::GoldFish);
//     let auction = actions_system.start_auction(fish.id, 3600, 100);

    //     // Fast forward time to end auction
//     testing::set_block_timestamp(auction.end_time + 1);

    //     // End auction with no bids
//     actions_system.end_auction(auction.auction_id);

    //     // Verify auction is closed
//     let updated_auction = actions_system.get_auction_by_id(auction.auction_id);
//     assert(!updated_auction.active, 'Auction should be inactive');

    //     // Verify fish returned to seller
//     let fish_owner = actions_system.get_fish_owner(fish.id);
//     assert!(fish_owner == seller, "Fish should be returned to seller");

    //     // Verify fish is unlocked
//     let fish_owner_model: FishOwner = actions_system.get_fish_owner_for_auction(fish.id);
//     assert(!fish_owner_model.locked, 'Fish should be unlocked');
// }

    // #[test]
// fn test_get_active_auctions() {
//     let seller = contract_address_const::<'seller'>();
//     let ndef = namespace_def();
//     let mut world = spawn_test_world([ndef].span());
//     world.sync_perms_and_inits(contract_defs());

    //     let (contract_address, _) = world.dns(@"AquaStark").unwrap();
//     let actions_system = IAquaStarkDispatcher { contract_address };

    //     testing::set_contract_address(seller);
//     actions_system.register('seller');

    //     // Create 3 fish and start auctions
//     let fish1 = actions_system.new_fish(1, Species::GoldFish);
//     let auction1 = actions_system.start_auction(fish1.id, 3600, 100);

    //     let fish2 = actions_system.new_fish(1, Species::Betta);
//     let auction2 = actions_system.start_auction(fish2.id, 7200, 200);

    //     let fish3 = actions_system.new_fish(1, Species::AngelFish);
//     let auction3 = actions_system.start_auction(fish3.id, 1800, 50);

    //     // End one auction
//     testing::set_block_timestamp(auction3.end_time + 1);
//     actions_system.end_auction(auction3.auction_id);

    //     // Get active auctions
//     let active_auctions = actions_system.get_active_auctions();

    //     // Should return 2 active auctions (auction1 and auction2)
//     assert(active_auctions.len() == 2, 'Should have 2 active auctions');

    //     // Verify correct auctions are active
//     let mut found_auction1 = false;
//     let mut found_auction2 = false;

    //     for auction in active_auctions {
//         if auction.auction_id == auction1.auction_id {
//             found_auction1 = true;
//         }
//         if auction.auction_id == auction2.auction_id {
//             found_auction2 = true;
//         }
//     };

    //     assert!(found_auction1, "Auction1 not found in active auctions");
//     assert!(found_auction2, "Auction2 not found in active auctions");
// }
}
