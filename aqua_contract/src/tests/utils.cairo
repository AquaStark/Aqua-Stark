use dojo::world::IWorldDispatcherTrait;
use dojo::model::ModelStorage;
use aqua_stark::models::aquarium_model::{m_Aquarium, m_AquariumCounter, m_AquariumOwner};
use aqua_stark::models::decoration_model::{m_Decoration, m_DecorationCounter};
use aqua_stark::models::fish_model::{m_Listing, m_Fish, m_FishCounter, m_FishOwner};
use aqua_stark::models::player_model::{
    m_AddressToUsername, m_Player, m_PlayerCounter, m_UsernameToAddress,
};
use aqua_stark::models::shop_model::{m_ShopItemModel, m_ShopCatalogModel};
use aqua_stark::models::transaction_model::{
    m_TransactionLog, m_EventTypeDetails, m_EventCounter, m_TransactionCounter,
};
use aqua_stark::models::auctions_model::{m_Auction, m_AuctionCounter};


use aqua_stark::systems::AquaStark::AquaStark;
use aqua_stark::systems::ShopCatalog::ShopCatalog;
use aqua_stark::systems::Fish::Fish;
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
            TestResource::Contract(AquaStark::TEST_CLASS_HASH),
            TestResource::Contract(ShopCatalog::TEST_CLASS_HASH),
            TestResource::Contract(Fish::TEST_CLASS_HASH),
        ]
            .span(),
    };

    ndef
}

fn contract_defs() -> Span<ContractDef> {
    [
        ContractDefTrait::new(@"aqua_stark", @"AquaStark")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"Fish")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span()),
        ContractDefTrait::new(@"aqua_stark", @"ShopCatalog")
            .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
            .with_init_calldata([OWNER().into()].span()),
    ]
        .span()
}
