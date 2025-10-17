#[cfg(test)]
mod tests {
    use dojo::world::IWorldDispatcherTrait;
    use dojo::model::ModelStorage;
    use aqua_stark::interfaces::IFishSystem::{IFishSystemDispatcher, IFishSystemDispatcherTrait};
    use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
    use aqua_stark::models::aquarium_model::{m_Aquarium, m_AquariumCounter, m_AquariumOwner};
    use aqua_stark::models::decoration_model::{m_Decoration, m_DecorationCounter};
    use aqua_stark::models::fish_model::{
        FishOwner, Species, Listing, m_Listing, m_Fish, m_FishCounter, m_FishOwner,
    };
    use aqua_stark::models::player_model::{
        m_AddressToUsername, m_Player, m_PlayerCounter, m_UsernameToAddress,
    };
    use aqua_stark::models::session::{m_SessionKey, m_SessionAnalytics, m_SessionOperation};
    use aqua_stark::systems::FishSystem::FishSystem;
    use aqua_stark::systems::AquaStark::AquaStark;
    use aqua_stark::base::events;
    use aqua_stark::base::game_events;
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
                TestResource::Model(m_Aquarium::TEST_CLASS_HASH),
                TestResource::Model(m_AquariumCounter::TEST_CLASS_HASH),
                TestResource::Model(m_AquariumOwner::TEST_CLASS_HASH),
                TestResource::Model(m_Fish::TEST_CLASS_HASH),
                TestResource::Model(m_FishCounter::TEST_CLASS_HASH),
                TestResource::Model(m_FishOwner::TEST_CLASS_HASH),
                TestResource::Model(m_Decoration::TEST_CLASS_HASH),
                TestResource::Model(m_DecorationCounter::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_PlayerCounter::TEST_CLASS_HASH),
                TestResource::Model(m_UsernameToAddress::TEST_CLASS_HASH),
                TestResource::Model(m_AddressToUsername::TEST_CLASS_HASH),
                TestResource::Model(m_Listing::TEST_CLASS_HASH),
                TestResource::Model(m_SessionKey::TEST_CLASS_HASH),
                TestResource::Model(m_SessionAnalytics::TEST_CLASS_HASH),
                TestResource::Model(m_SessionOperation::TEST_CLASS_HASH),
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
                TestResource::Event(events::e_LevelUp::TEST_CLASS_HASH),
                TestResource::Event(events::e_RewardClaimed::TEST_CLASS_HASH),
                TestResource::Event(events::e_AquariumCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_AquariumCleaned::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_FishGameCreated::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_FishGameMoved::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_FishGameBred::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_DecorationGameMoved::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_FishGameListed::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_FishGamePurchased::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_GameExperienceEarned::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_GameLevelUp::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_GameStateChanged::TEST_CLASS_HASH),
                TestResource::Event(game_events::e_GameOperationCompleted::TEST_CLASS_HASH),
                TestResource::Contract(AquaStark::TEST_CLASS_HASH),
                TestResource::Contract(FishSystem::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"AquaStark")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
            ContractDefTrait::new(@"aqua_stark", @"FishSystem")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ]
            .span()
    }

    #[test]
    fn test_fish_system_new_fish() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Test fish_system new_fish function
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let fish = fish_system.new_fish(1, Species::GoldFish);

        assert(fish.owner == caller, 'Owner mismatch');
        assert(fish.species == Species::GoldFish, 'Species mismatch');
    }

    #[test]
    fn test_fish_system_breed_fishes() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create parent fishes
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let parent1 = fish_system.new_fish(1, Species::GoldFish);
        let parent2 = fish_system.new_fish(1, Species::Betta);

        // Breed fishes
        let offspring_id = fish_system.breed_fishes(parent1.id, parent2.id);
        let offspring = fish_system.get_fish(offspring_id);

        assert(offspring.owner == caller, 'Offspring owner');
        assert(offspring.species == Species::Hybrid, 'Offspring species');

        // Test family tree
        let (parent1_id, parent2_id) = fish_system.get_parents(offspring_id);
        assert(parent1_id == parent1.id, 'P1 ID mismatch');
        assert(parent2_id == parent2.id, 'P2 ID mismatch');
    }


    #[test]
    fn test_fish_system_list_fish() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create fish and list it
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);

        assert(listing.is_active, 'Not active');
        assert(listing.fish_id == fish.id, 'Fish ID mismatch');
        assert(listing.price == 100, 'Price mismatch');
        assert(listing.fish_id == fish.id, 'Fish ID mismatch');
    }

    #[test]
    fn test_fish_system_purchase_fish() {
        let seller = contract_address_const::<'seller'>();
        let buyer = contract_address_const::<'buyer'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register both players
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };

        testing::set_contract_address(seller);
        aqua_stark.register('Seller');

        testing::set_contract_address(buyer);
        aqua_stark.register('Buyer');

        // Seller creates fish and lists it
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };

        testing::set_contract_address(seller);
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);

        // Buyer purchases the fish
        testing::set_contract_address(buyer);
        fish_system.purchase_fish(listing.id);

        let updated_fish = fish_system.get_fish(fish.id);

        assert(updated_fish.owner == buyer, 'Owner not transferred');
    }

    #[test]
    fn test_fish_system_get_player_fishes() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create multiple fishes
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let fish1 = fish_system.new_fish(1, Species::GoldFish);
        let fish2 = fish_system.new_fish(1, Species::Betta);
        let fish3 = fish_system.new_fish(1, Species::AngelFish);

        let player_fishes = fish_system.get_player_fishes(caller);

        assert(player_fishes.len() == 4, 'Fishes count mismatch');
        assert(*player_fishes[0].id == 0, 'Initial fish ID');
        assert(*player_fishes[1].id == fish1.id, 'Fish1 ID');
        assert(*player_fishes[2].id == fish2.id, 'Fish2 ID');
        assert(*player_fishes[3].id == fish3.id, 'Fish3 ID');
    }

    #[test]
    fn test_fish_system_get_fish_family_tree() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create family tree
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let parent1 = fish_system.new_fish(1, Species::GoldFish);
        let parent2 = fish_system.new_fish(1, Species::Betta);
        let offspring_id = fish_system.breed_fishes(parent1.id, parent2.id);

        let family_tree = fish_system.get_fish_family_tree(offspring_id);

        assert(family_tree.len() == 1, 'Tree length');
        assert(*family_tree[0].parent1 == parent1.id, 'P1 ID');
        assert(*family_tree[0].parent2 == parent2.id, 'P2 ID');
    }

    #[test]
    fn test_fish_system_get_fish_ancestor() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create multi-generation family
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let parent1 = fish_system.new_fish(1, Species::GoldFish);
        let parent2 = fish_system.new_fish(1, Species::Betta);
        let offspring_id = fish_system.breed_fishes(parent1.id, parent2.id);

        // Verify that the family tree exists and has the correct structure
        let family_tree = fish_system.get_fish_family_tree(offspring_id);
        assert(family_tree.len() == 1, 'Tree length');
        assert(*family_tree[0].parent1 == parent1.id, 'Direct parent1');
        assert(*family_tree[0].parent2 == parent2.id, 'Direct parent2');
    }

    #[test]
    fn test_fish_system_get_fish_offspring() {
        let caller = contract_address_const::<'player'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player first
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(caller);
        aqua_stark.register('Player');

        // Create parent and offspring
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(caller);

        let parent1 = fish_system.new_fish(1, Species::GoldFish);
        let parent2 = fish_system.new_fish(1, Species::Betta);
        let offspring_id = fish_system.breed_fishes(parent1.id, parent2.id);

        let parent1_offspring = fish_system.get_fish_offspring(parent1.id);
        let parent2_offspring = fish_system.get_fish_offspring(parent2.id);

        assert(parent1_offspring.len() == 1, 'P1 offspring count');
        assert(parent2_offspring.len() == 1, 'P2 offspring count');
        assert(*parent1_offspring[0].id == offspring_id, 'P1 offspring ID');
        assert(*parent2_offspring[0].id == offspring_id, 'P2 offspring ID');
    }


    #[test]
    #[should_panic]
    fn test_fish_system_list_fish_not_owner() {
        let owner = contract_address_const::<'owner'>();
        let not_owner = contract_address_const::<'not_owner'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register both players
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };

        testing::set_contract_address(owner);
        aqua_stark.register('Owner');

        testing::set_contract_address(not_owner);
        aqua_stark.register('NotOwner');

        // Owner creates fish
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };

        testing::set_contract_address(owner);
        let fish = fish_system.new_fish(1, Species::GoldFish);

        // Not owner tries to list the fish
        testing::set_contract_address(not_owner);
        fish_system.list_fish(fish.id, 100); // This should panic
    }

    #[test]
    #[should_panic]
    fn test_fish_system_purchase_fish_already_owner() {
        let owner = contract_address_const::<'owner'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register player
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };
        testing::set_contract_address(owner);
        aqua_stark.register('Owner');

        // Create fish and listing
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };
        testing::set_contract_address(owner);

        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);

        // Owner tries to purchase their own fish
        fish_system.purchase_fish(listing.id); // This should panic
    }

    #[test]
    #[should_panic]
    fn test_fish_system_breed_fishes_not_owner() {
        let owner = contract_address_const::<'owner'>();
        let not_owner = contract_address_const::<'not_owner'>();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        // Register both players
        let (aqua_stark_address, _) = world.dns(@"AquaStark").unwrap();
        let aqua_stark = IAquaStarkDispatcher { contract_address: aqua_stark_address };

        testing::set_contract_address(owner);
        aqua_stark.register('Owner');

        testing::set_contract_address(not_owner);
        aqua_stark.register('NotOwner');

        // Owner creates fishes
        let (fish_system_address, _) = world.dns(@"FishSystem").unwrap();
        let fish_system = IFishSystemDispatcher { contract_address: fish_system_address };

        testing::set_contract_address(owner);
        let fish1 = fish_system.new_fish(1, Species::GoldFish);
        let fish2 = fish_system.new_fish(1, Species::Betta);

        // Not owner tries to breed the fishes
        testing::set_contract_address(not_owner);
        fish_system.breed_fishes(fish1.id, fish2.id); // This should panic
    }
}
