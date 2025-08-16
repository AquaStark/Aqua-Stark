use aqua_stark::tests::utils::{namespace_def, contract_defs, OWNER};
use starknet::{contract_address_const, testing, get_block_timestamp, ContractAddress};
use aqua_stark::interfaces::IFish::{IFishDispatcher, IFishDispatcherTrait};
use aqua_stark::models::fish_model::{Species, Listing};
use aqua_stark::interfaces::IAquaStark::{IAquaStarkDispatcher, IAquaStarkDispatcherTrait};
use dojo_cairo_test::{
    ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
    spawn_test_world,
};
use dojo::world::WorldStorageTrait;
use dojo::world::IWorldDispatcherTrait;

#[test]
fn test_create_fish() {
    // Initialize test environment
    let caller = contract_address_const::<'aji'>();
    let ndef = namespace_def();
    let mut world = spawn_test_world([ndef].span());
    world.sync_perms_and_inits(contract_defs());
    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);
    actions_system_aqua.register('Aji');
    let fish = actions_system.new_fish(1, Species::GoldFish);
    let player = actions_system_aqua.get_player(caller);
    assert(fish.owner == caller, 'Fish owner mismatch');
    assert(fish.species == Species::GoldFish, 'Fish species mismatch');
    assert(player.fish_count == 2, 'Player fish count mismatch');
    assert(*player.player_fishes[1] == fish.id, 'Player fish ID mismatch');
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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };

    testing::set_contract_address(caller_1);
    actions_system_aqua.register(username);
    let parent_2 = actions_system.new_fish(1, Species::Betta);
    assert(parent_2.owner == caller_1, 'Parent Fish Error');
    assert(parent_2.species == Species::Betta, 'Parent Fish Species Error');
    assert(parent_2.id == 2, 'Parent Fish ID Error');
    assert(parent_2.owner == caller_1, 'Parent Fish Owner Error');

    let offsping = actions_system.breed_fishes(1, parent_2.id);

    let player = actions_system_aqua.get_player(caller_1);

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
    let (contract_address, _) = world.dns(@"Fish").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);

    actions_system_aqua.register('Aji');
    let aquarium = actions_system_aqua.new_aquarium(caller, 10, 10);

    let fish = actions_system.new_fish(1, Species::GoldFish);

    let move_result = actions_system.move_fish_to_aquarium(fish.id, 1, aquarium.id);

    let updated_fish = actions_system.get_fish(fish.id);
    let updated_aquarium = actions_system_aqua.get_aquarium(aquarium.id);
    let player = actions_system_aqua.get_player(caller);

    assert(move_result, 'Fish move failed');
    assert(updated_fish.aquarium_id == aquarium.id, 'Fish aquarium ID mismatch');
    assert(updated_aquarium.fish_count == 1, 'Aquarium fish count mismatch');
    assert(*updated_aquarium.housed_fish[0] == updated_fish.id, 'Aquarium fish ID mismatch');
    assert(player.fish_count == 2, 'Player fish count mismatch');
    assert(*player.player_fishes[1] == updated_fish.id, 'Player fish ID mismatch');
}

#[test]
fn test_get_player_fishes() {
    // Initialize test environment
    let caller = contract_address_const::<'aji'>();
    let ndef = namespace_def();
    let mut world = spawn_test_world([ndef].span());
    world.sync_perms_and_inits(contract_defs());
    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);
    actions_system_aqua.register('Aji');
    let fish1 = actions_system.new_fish(1, Species::GoldFish);
    let fish2 = actions_system.new_fish(1, Species::Betta);
    let player_fishes = actions_system.get_player_fishes(caller);
    assert(player_fishes.len() == 3, 'Player fishes count mismatch');
    assert(*player_fishes[1].id == fish1.id, 'Player fish 1 ID mismatch');
    assert(*player_fishes[2].id == fish2.id, 'Player fish 2 ID mismatch');
}

#[test]
fn test_get_fish_family_tree() {
    // Initialize test environment
    let caller = contract_address_const::<'aji'>();
    let ndef = namespace_def();
    let mut world = spawn_test_world([ndef].span());
    world.sync_perms_and_inits(contract_defs());
    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);
    actions_system_aqua.register('Aji');
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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);

    actions_system_aqua.register('Aji');

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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(caller);

    actions_system_aqua.register('Aji');

    let parent_1 = actions_system.new_fish(1, Species::GoldFish);
    let parent_2 = actions_system.new_fish(1, Species::Betta);

    let offspring_id = actions_system.breed_fishes(parent_1.id, parent_2.id);

    let grandchild_id = actions_system.breed_fishes(parent_1.id, offspring_id);

    // This should panic: only 2 generations recorded (0 and 1)
    let _ = actions_system.get_fish_ancestor(grandchild_id, 2);
}

#[test]
fn test_list_fish() {
    let player = contract_address_const::<'player'>();
    let ndef = namespace_def();
    let mut world = spawn_test_world([ndef].span());
    world.sync_perms_and_inits(contract_defs());
    world.dispatcher.grant_owner(0, OWNER());

    let (contract_address, _) = world.dns(@"Fish").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(OWNER());
    actions_system_aqua.register('owner');

    testing::set_contract_address(player);
    actions_system_aqua.register('player');

    let aquarium = actions_system_aqua.new_aquarium(player, 10, 10);
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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(OWNER());
    actions_system_aqua.register('owner');

    testing::set_contract_address(player);
    actions_system_aqua.register('player');

    let aquarium = actions_system_aqua.new_aquarium(player, 10, 10);
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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(OWNER());
    actions_system_aqua.register('owner');

    testing::set_contract_address(player);
    actions_system_aqua.register('player');

    testing::set_contract_address(player2);
    actions_system_aqua.register('player2');

    // Create a new aquarium for the player
    testing::set_contract_address(player);
    let aquarium = actions_system_aqua.new_aquarium(player, 10, 10);

    let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);
    let listing = actions_system.list_fish(fish.id, 100);

    // Change caller to player2
    testing::set_contract_address(player2);
    // Purchase the fish
    actions_system.purchase_fish(listing.id);

    let fish = actions_system.get_fish(fish.id);
    assert(fish.owner == player2, 'Fish owner mismatch');
    let listing: Listing = actions_system_aqua.get_listing(listing.id);
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

    let (contract_address, _) = world.dns(@"FishSystem").unwrap();
    let actions_system = IFishDispatcher { contract_address };
    let actions_system_aqua = IAquaStarkDispatcher { contract_address };
    testing::set_contract_address(player);
    actions_system_aqua.register('player');

    let aquarium = actions_system_aqua.new_aquarium(player, 10, 10);
    let fish = actions_system.new_fish(aquarium.id, Species::GoldFish);
    let listing = actions_system.list_fish(fish.id, 100);

    testing::set_contract_address(player);
    actions_system.purchase_fish(listing.id); // should fail because player already owns the fish
}
