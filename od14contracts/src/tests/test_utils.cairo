use dojo_starter::components::aquarium::AquariumState;
use dojo_starter::components::auction::{AuctionState, IAuctionStateDispatcher};
use dojo_starter::components::experience::{IPlayerExperienceDispatcher, PlayerExperience};
use dojo_starter::components::fish::{FishState, IFishStateDispatcher};
use dojo_starter::components::friends::FriendState;
use dojo_starter::components::playerstate::{IPlayerStateDispatcher, PlayerState};
use dojo_starter::entities::aquarium::m_Aquarium;
use dojo_starter::entities::auction::m_Auction;
use dojo_starter::entities::base;
use dojo_starter::entities::decoration::m_Decoration;
use dojo_starter::entities::fish::m_Fish;
use dojo_starter::entities::friends::{m_FriendRequest, m_FriendRequestCount, m_FriendsList};
use dojo_starter::entities::player::m_Player;
use dojo_starter::tests::mocks::erc20_mock::erc20_mock;
use dojo::world::{WorldStorage, WorldStorageTrait};
use dojo_cairo_test::{
    ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
    spawn_test_world,
};
use openzeppelin_token::erc20::interface::IERC20Dispatcher;
use starknet::testing;

#[derive(Drop)]
pub struct TestContracts {
    pub world: WorldStorage,
    pub fish_system: IFishStateDispatcher,
}

pub fn namespace_def() -> NamespaceDef {
    let ndef = NamespaceDef {
        namespace: "dojo_starter",
        resources: [
            // Models
            TestResource::Model(m_Fish::TEST_CLASS_HASH),
            TestResource::Model(base::m_Id::TEST_CLASS_HASH),
            // Contracts
            TestResource::Contract(FishState::TEST_CLASS_HASH),
            // Fish Events
            TestResource::Event(base::e_FishAdded::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishDamaged::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishRemoved::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishCreated::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishFed::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishGrown::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishHealed::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishHungerUpdated::TEST_CLASS_HASH),
            TestResource::Event(base::e_FishAgeUpdated::TEST_CLASS_HASH),
        ]
            .span(),
    };

    ndef
}

pub fn contract_defs() -> Span<ContractDef> {
    [
        ContractDefTrait::new(@"dojo_starter", @"FishState")
            .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span()),
    ]
        .span()
}

pub fn setup() -> WorldStorage {
    testing::set_block_number(1);
    testing::set_block_timestamp(1);

    let ndef = namespace_def();
    let mut world: WorldStorage = spawn_test_world([ndef].span());
    world.sync_perms_and_inits(contract_defs());

    world
}


pub fn initialize_contacts() -> TestContracts {
    // Intialize world state
    let mut world = setup();


    // Initialize FishState contract
    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    TestContracts { fish_system }
}
pub fn initialize_player_contacts() -> (WorldStorage, IPlayerStateDispatcher) {
    let mut world = setup();
    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_registry = IPlayerStateDispatcher { contract_address: player_address };
    (world, player_registry)
}
// pub fn setup_world() -> (IWorldDispatcher, IAquariumStateDispatcher) {
//     let mut models = array![Aquarium::TEST_CLASS_HASH, Fish::TEST_CLASS_HASH];
//     // Deploy world with models
//     let world = spawn_test_world(models);

//     // deploy systems contract
//     let contract_address = world
//         .deploy_contract('salt', AquariumState::TEST_CLASS_HASH.try_into().unwrap());
//     let aquarium_system = IAquariumStateDispatcher { contract_address };
pub fn initialize_experience_contacts() -> (
    WorldStorage, IPlayerExperienceDispatcher, IPlayerStateDispatcher,
) {
    let mut world = setup();

    let (exp_address, _) = world.dns(@"PlayerExperience").unwrap();
    let experience_system = IPlayerExperienceDispatcher { contract_address: exp_address };

    let (player_address, _) = world.dns(@"PlayerState").unwrap();
    let player_registry = IPlayerStateDispatcher { contract_address: player_address };
    //     (world, aquarium_system)
    // }
    (world, experience_system, player_registry)
}

