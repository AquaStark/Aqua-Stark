use aqua_stark::components::aquarium::AquariumState;
use aqua_stark::components::auction::{AuctionState, IAuctionStateDispatcher};
use aqua_stark::components::experience::{IPlayerExperienceDispatcher, PlayerExperience};
use aqua_stark::components::fish::{FishState, IFishStateDispatcher};
use aqua_stark::components::friends::FriendState;
use aqua_stark::components::playerstate::{IPlayerStateDispatcher, PlayerState};
use aqua_stark::entities::aquarium::m_Aquarium;
use aqua_stark::entities::auction::m_Auction;
use aqua_stark::entities::base;
use aqua_stark::entities::decoration::m_Decoration;
use aqua_stark::entities::fish::m_Fish;
use aqua_stark::entities::friends::{m_FriendRequest, m_FriendRequestCount, m_FriendsList};
use aqua_stark::entities::player::m_Player;
use aqua_stark::tests::mocks::erc20_mock::erc20_mock;
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
    pub auction_system: IAuctionStateDispatcher,
    pub fish_system: IFishStateDispatcher,
    pub erc20_token: IERC20Dispatcher,
}

pub fn namespace_def() -> NamespaceDef {
    let ndef = NamespaceDef {
        namespace: "aqua_stark",
        resources: [
            // Models
            TestResource::Model(m_Auction::TEST_CLASS_HASH),
            TestResource::Model(m_Aquarium::TEST_CLASS_HASH),
            TestResource::Model(m_Fish::TEST_CLASS_HASH),
            TestResource::Model(m_Decoration::TEST_CLASS_HASH),
            TestResource::Model(m_Player::TEST_CLASS_HASH),
            TestResource::Model(m_FriendRequest::TEST_CLASS_HASH),
            TestResource::Model(m_FriendRequestCount::TEST_CLASS_HASH),
            TestResource::Model(m_FriendsList::TEST_CLASS_HASH),
            TestResource::Model(base::m_Id::TEST_CLASS_HASH),
            // Contracts
            TestResource::Contract(AquariumState::TEST_CLASS_HASH),
            TestResource::Contract(FishState::TEST_CLASS_HASH),
            TestResource::Contract(AuctionState::TEST_CLASS_HASH),
            TestResource::Contract(erc20_mock::TEST_CLASS_HASH),
            TestResource::Contract(FriendState::TEST_CLASS_HASH),
            TestResource::Contract(PlayerState::TEST_CLASS_HASH),
            TestResource::Contract(PlayerExperience::TEST_CLASS_HASH),
            // Aquarium Events
            TestResource::Event(base::e_AquariumCreated::TEST_CLASS_HASH),
            TestResource::Event(base::e_AquariumCleaned::TEST_CLASS_HASH),
            TestResource::Event(base::e_CleanlinessUpdated::TEST_CLASS_HASH),
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
            // Auction Events
            TestResource::Event(base::e_AuctionCreated::TEST_CLASS_HASH),
            TestResource::Event(base::e_AuctionCanceled::TEST_CLASS_HASH),
            TestResource::Event(base::e_AuctionCompleted::TEST_CLASS_HASH),
            TestResource::Event(base::e_NewBid::TEST_CLASS_HASH),
            // Friends Events
            TestResource::Event(base::e_FriendRequestSent::TEST_CLASS_HASH),
            TestResource::Event(base::e_FriendRequestAccepted::TEST_CLASS_HASH),
            TestResource::Event(base::e_FriendRequestRejected::TEST_CLASS_HASH),
            TestResource::Event(base::e_FriendRequestDeleted::TEST_CLASS_HASH),
            // Experience Events
            TestResource::Event(PlayerExperience::e_ExperienceGranted::TEST_CLASS_HASH),
            TestResource::Event(PlayerExperience::e_LevelUp::TEST_CLASS_HASH),
            TestResource::Event(PlayerExperience::e_ExperienceGranterAdded::TEST_CLASS_HASH),
            TestResource::Event(PlayerExperience::e_ExperienceGranterRemoved::TEST_CLASS_HASH),
        ]
            .span(),
    };

    ndef
}

pub fn contract_defs() -> Span<ContractDef> {
    [
        ContractDefTrait::new(@"aqua_stark", @"AquariumState")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"FishState")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"AuctionState")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"erc20_mock")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"PlayerState")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"FriendState")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"PlayerExperience")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
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

    // Initialize erc20Mock contract
    let (erc20_address, _) = world.dns(@"erc20_mock").unwrap();
    let erc20_token = IERC20Dispatcher { contract_address: erc20_address };

    // Initialize AuctionState contract
    let (contract_address, _) = world.dns(@"AuctionState").unwrap();
    let auction_system = IAuctionStateDispatcher { contract_address };

    // Initialize FishState contract
    let (fish_address, _) = world.dns(@"FishState").unwrap();
    let fish_system = IFishStateDispatcher { contract_address: fish_address };

    TestContracts { world, auction_system, fish_system, erc20_token }
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

