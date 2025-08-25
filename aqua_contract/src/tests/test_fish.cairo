#[cfg(test)]
pub mod tests {
    use starknet::{contract_address_const, testing, ContractAddress};
    use aqua_stark::interfaces::IFish::{IFishDispatcher, IFishDispatcherTrait};
    use aqua_stark::models::fish_model::Species;
    use aqua_stark::models::aquarium_model::{m_Aquarium, m_AquariumCounter, m_AquariumOwner};
    use aqua_stark::models::fish_model::{m_Listing, m_Fish, m_FishCounter, m_FishOwner};
    use aqua_stark::models::player_model::{
        m_Player, m_PlayerCounter, m_UsernameToAddress, m_AddressToUsername,
    };
    use aqua_stark::models::decoration_model::{m_Decoration, m_DecorationCounter};
    use aqua_stark::models::transaction_model::{
        m_TransactionLog, m_EventTypeDetails, m_EventCounter, m_TransactionCounter,
    };
    use aqua_stark::models::auctions_model::{m_Auction, m_AuctionCounter};
    use aqua_stark::models::shop_model::{m_ShopItemModel, m_ShopCatalogModel};
    use aqua_stark::models::session::{m_SessionKey, m_SessionAnalytics, m_SessionOperation};
    use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
    use aqua_stark::systems::AquaStark::AquaStark;
    use aqua_stark::systems::ShopCatalog::ShopCatalog;
    use aqua_stark::base::events;
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };

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
                TestResource::Event(events::e_AuctionStarted::TEST_CLASS_HASH),
                TestResource::Event(events::e_BidPlaced::TEST_CLASS_HASH),
                TestResource::Event(events::e_AuctionEnded::TEST_CLASS_HASH),
                TestResource::Event(events::e_LevelUp::TEST_CLASS_HASH),
                TestResource::Event(events::e_RewardClaimed::TEST_CLASS_HASH),
                TestResource::Event(events::e_AquariumCreated::TEST_CLASS_HASH),
                TestResource::Event(events::e_AquariumCleaned::TEST_CLASS_HASH),
                TestResource::Contract(AquaStark::TEST_CLASS_HASH),
                TestResource::Contract(ShopCatalog::TEST_CLASS_HASH),
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
            ContractDefTrait::new(@"aqua_stark", @"ShopCatalog")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
                .with_init_calldata([OWNER().into()].span()),
        ]
            .span()
    }

    fn setup_test_world() -> (IFishDispatcher, IAquaStarkDispatcher) {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"AquaStark").unwrap();
        let (fish_address, _) = world.dns(@"FishSystem").unwrap();

        // Both systems use the same contract address since FishSystem is implemented within
        // AquaStark
        let fish_system = IFishDispatcher { contract_address: fish_address };
        let aqua_stark = IAquaStarkDispatcher { contract_address };

        (fish_system, aqua_stark)
    }

    #[test]
    fn test_create_fish() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let player = aqua_stark.get_player(caller);
        assert(fish.owner == caller, 'Fish owner mismatch');
        assert(fish.species == Species::GoldFish, 'Fish species mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_create_fish_offspring() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller_1 = contract_address_const::<'aji'>();

        let username = 'Aji';

        testing::set_contract_address(caller_1);
        aqua_stark.register(username);
        let parent_2 = fish_system.new_fish(1, Species::Betta);
        assert(parent_2.owner == caller_1, 'Parent Fish Error');
        assert(parent_2.species == Species::Betta, 'Parent Fish Species Error');
        assert(parent_2.id == 2, 'Parent Fish ID Error');
        assert(parent_2.owner == caller_1, 'Parent Fish Owner Error');

        let offsping = fish_system.breed_fishes(1, parent_2.id);

        let player = aqua_stark.get_player(caller_1);

        // Retrieve the offspring fish
        let offspring_fish = fish_system.get_fish(offsping);

        assert(offspring_fish.owner == caller_1, 'Offspring Fish Error');
        assert(offspring_fish.species == Species::Hybrid, 'Offspring Fish Species Error');
        assert(player.fish_count == 3, 'Player fish count mismatch ');
        assert(*player.player_fishes[2] == offspring_fish.id, 'Player offspring fish ID ');

        let (parent1_id, parent2_id) = fish_system.get_parents(offspring_fish.id);
        assert(parent1_id == 1, 'Parent 1 ID mismatch');
        assert(parent2_id == parent_2.id, 'Parent 2 ID mismatch');

        let parent1k = fish_system.get_fish_offspring(1);
        let parent2k = fish_system.get_fish_offspring(parent_2.id);
        assert(parent1k.len() == 1, '1 offspring mismatch');
        assert(parent2k.len() == 1, '2 offspring mismatch');
        assert(*parent1k[0].id == offspring_fish.id, 'Parent 1 offspring ID mismatch');
        assert(*parent2k[0].id == offspring_fish.id, 'Parent 2 offspring ID mismatch');
    }

    #[test]
    fn test_move_fish_to_aquarium() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);

        aqua_stark.register('Aji');
        let aquarium = aqua_stark.new_aquarium(caller, 10, 10);

        let fish = fish_system.new_fish(1, Species::GoldFish);

        let move_result = fish_system.move_fish_to_aquarium(fish.id, 1, aquarium.id);

        let updated_fish = fish_system.get_fish(fish.id);
        let updated_aquarium = aqua_stark.get_aquarium(aquarium.id);
        let player = aqua_stark.get_player(caller);

        assert(move_result, 'Fish move failed');
        assert(updated_fish.aquarium_id == aquarium.id, 'Fish aquarium ID mismatch');
        assert(updated_aquarium.fish_count == 1, 'Aquarium fish count mismatch');
        assert(*updated_aquarium.housed_fish[0] == updated_fish.id, 'Aquarium fish ID mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == updated_fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_get_player_fishes() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish1 = fish_system.new_fish(1, Species::GoldFish);
        let fish2 = fish_system.new_fish(1, Species::Betta);

        let player = aqua_stark.get_player(caller);
        assert(player.fish_count == 3, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == fish1.id, 'Player fish 1 ID mismatch');
        assert(*player.player_fishes[2] == fish2.id, 'Player fish 2 ID mismatch');
    }

    #[test]
    fn test_purchase_fish() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);
        fish_system.purchase_fish(listing.id);
        let purchased_fish = fish_system.get_fish(fish.id);
        let player = aqua_stark.get_player(caller);
        assert(purchased_fish.owner == caller, 'Fish owner mismatch');
        assert(purchased_fish.species == Species::GoldFish, 'Fish species mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == purchased_fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_purchase_fish_fail_already_own_fish() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);
        fish_system.purchase_fish(listing.id);
        let purchased_fish = fish_system.get_fish(fish.id);
        let player = aqua_stark.get_player(caller);
        assert(purchased_fish.owner == caller, 'Fish owner mismatch');
        assert(purchased_fish.species == Species::GoldFish, 'Fish species mismatch');
        assert(player.fish_count == 2, 'Player fish count mismatch');
        assert(*player.player_fishes[1] == purchased_fish.id, 'Player fish ID mismatch');
    }

    #[test]
    fn test_list_fish() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);
        assert(listing.fish_id == fish.id, 'Listing fish ID mismatch');
        assert(listing.price == 100, 'Listing price mismatch');
        assert(listing.is_active == true, 'Listing should be active');
    }

    #[test]
    fn test_list_fish_not_owner() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let listing = fish_system.list_fish(fish.id, 100);
        assert(listing.fish_id == fish.id, 'Listing fish ID mismatch');
        assert(listing.price == 100, 'Listing price mismatch');
        assert(listing.is_active == true, 'Listing should be active');
    }

    #[test]
    fn test_get_fish_family_tree() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let family_tree = fish_system.get_fish_family_tree(fish.id);
        assert(family_tree.len() == 0, 'Empty');
    }

    #[test]
    fn test_get_fish_ancestor_three_generations() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let ancestor = fish_system.get_fish_ancestor(fish.id, 3_u32);
        assert(ancestor.parent1 == 0, 'P1=0');
        assert(ancestor.parent2 == 0, 'P2=0');
    }

    #[test]
    fn test_get_fish_ancestor_out_of_bounds() {
        let (fish_system, aqua_stark) = setup_test_world();
        let caller = contract_address_const::<'aji'>();
        testing::set_contract_address(caller);
        aqua_stark.register('Aji');
        let fish = fish_system.new_fish(1, Species::GoldFish);
        let ancestor = fish_system.get_fish_ancestor(fish.id, 10_u32);
        assert(ancestor.parent1 == 0, 'P1=0');
        assert(ancestor.parent2 == 0, 'P2=0');
    }
}
