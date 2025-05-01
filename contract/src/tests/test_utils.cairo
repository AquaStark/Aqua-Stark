use dojo_cairo_test::{
    spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    WorldStorageTestTrait,
};
use dojo::world::{WorldStorage, WorldStorageTrait};
use dojo_starter::entities::base;
use dojo_starter::entities::auction::m_Auction;
use dojo_starter::entities::aquarium::m_Aquarium;
use dojo_starter::entities::fish::m_Fish;
use dojo_starter::entities::decoration::m_Decoration;
use dojo_starter::entities::player::m_Player;
use dojo_starter::components::aquarium::AquariumState;
use dojo_starter::components::auction::{AuctionState, IAuctionStateDispatcher};
use dojo_starter::components::fish::{FishState, IFishStateDispatcher};
use dojo_starter::tests::mocks::erc20_mock::erc20_mock;
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
        namespace: "dojo_starter",
        resources: [
            // Models
            TestResource::Model(m_Auction::TEST_CLASS_HASH),
            TestResource::Model(m_Aquarium::TEST_CLASS_HASH),
            TestResource::Model(m_Fish::TEST_CLASS_HASH),
            TestResource::Model(m_Decoration::TEST_CLASS_HASH),
            TestResource::Model(m_Player::TEST_CLASS_HASH),
            TestResource::Model(base::m_Id::TEST_CLASS_HASH),
            // Contracts
            TestResource::Contract(AquariumState::TEST_CLASS_HASH),
            TestResource::Contract(FishState::TEST_CLASS_HASH),
            TestResource::Contract(AuctionState::TEST_CLASS_HASH),
            TestResource::Contract(erc20_mock::TEST_CLASS_HASH),
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
        ]
            .span(),
    };

    ndef
}

pub fn contract_defs() -> Span<ContractDef> {
    [
        ContractDefTrait::new(@"dojo_starter", @"AquariumState")
            .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span()),
        ContractDefTrait::new(@"dojo_starter", @"FishState")
            .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span()),
        ContractDefTrait::new(@"dojo_starter", @"AuctionState")
            .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span()),
        ContractDefTrait::new(@"dojo_starter", @"erc20_mock")
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
// pub fn setup_world() -> (IWorldDispatcher, IAquariumStateDispatcher) {
//     let mut models = array![Aquarium::TEST_CLASS_HASH, Fish::TEST_CLASS_HASH];
//     // Deploy world with models
//     let world = spawn_test_world(models);

//     // deploy systems contract
//     let contract_address = world
//         .deploy_contract('salt', AquariumState::TEST_CLASS_HASH.try_into().unwrap());
//     let aquarium_system = IAquariumStateDispatcher { contract_address };

//     (world, aquarium_system)
// }


