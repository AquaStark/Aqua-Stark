use aqua_stark::components::auction::IAuctionStateDispatcherTrait;
use aqua_stark::components::fish::IFishStateDispatcherTrait;
use aqua_stark::entities::auction::Auction;
use aqua_stark::entities::fish::Fish;
use aqua_stark::models::AuctionStatus;
use aqua_stark::tests::mocks::erc20_mock::{
    IERC20MockPublicDispatcher, IERC20MockPublicDispatcherTrait,
};
use aqua_stark::tests::test_utils::{TestContracts, initialize_contacts};
use dojo::model::ModelStorage;
use openzeppelin_token::erc20::interface::IERC20DispatcherTrait;
use starknet::{ContractAddress, contract_address_const, get_block_timestamp, testing};

fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn BIDDER1() -> ContractAddress {
    contract_address_const::<'bidder1'>()
}

fn BIDDER2() -> ContractAddress {
    contract_address_const::<'bidder2'>()
}

fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0>()
}

#[test]
fn test_auction_creation() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Cretae Fish model instance and fetch from world state
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Cretae Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;

    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    assert(auction_id == 1_u64, 'Auction ID should be 1');

    // Verify aquarium initialization details
    let auction: Auction = world.read_model(auction_id);
    assert(auction.creator == OWNER(), 'Auction creator should match');
    assert(auction.fish_id == fish_id, 'Auction fish id should match');
    assert(auction.start_price == start_price, 'Start price should match');
    assert(auction.final_price == 0_u256, 'Final price should be zero');
    assert(auction.end_date == end_date, 'Auction end date should match');
    assert(auction.highest_bid.is_none(), 'Highest bid should be none');
    assert(auction.no_of_bids == 0, 'Auction bids should be zero');
    assert(auction.payment_token == erc20_token.contract_address, 'Auction token should match');
    assert(auction.status == AuctionStatus::Active, 'Auction status should be active');
}

#[test]
#[should_panic(expected: ('END DATE IN PAST', 'ENTRYPOINT_FAILED'))]
fn test_auction_creation_fail_with_invalid_date() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Cretae Fish model instance and fetch from world state
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Cretae Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = 0;

    let _ = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);
}

#[test]
#[should_panic(expected: ('INVALID START PRICE', 'ENTRYPOINT_FAILED'))]
fn test_auction_creation_fail_with_invalid_start_price() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Cretae Fish model instance and fetch from world state
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Cretae Auction model instance and fetch from world state
    let start_price = 0;
    let end_date = get_block_timestamp() + 1000_u64;

    let _ = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);
}

#[test]
#[should_panic(expected: ('INVALID TOKEN', 'ENTRYPOINT_FAILED'))]
fn test_auction_creation_fail_with_invalid_token() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token: _,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Cretae Fish model instance and fetch from world state
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Cretae Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;

    let _ = auction_system.create_auction(fish_id, start_price, end_date, ZERO_ADDRESS());
}


#[test]
fn test_auction_bid() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Set caller as Bidder
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount);
    // Make bid
    auction_system.make_bid(auction_id, bid_amount);
    // Verify aquarium initialization details
    let auction: Auction = world.read_model(auction_id);
    assert(auction.highest_bid.is_some(), 'Highest bid should be some');
    assert(auction.no_of_bids == 1, 'Auction bids should be 1');

    if let Option::Some(highest_bid) = auction.highest_bid {
        assert(highest_bid.bid_amount == bid_amount, 'Bid amount should match');
        assert(highest_bid.bidder == BIDDER1(), 'Bidder should match');
    }
}


#[test]
fn test_auction_multiple_bids() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);

    // Get Bidder 1 balance after bidding (to check for refund)
    let bidder_1_balance_after_bidding = erc20_token.balance_of(BIDDER1());

    // Bidder 2
    // Set caller as Bidder2
    testing::set_contract_address(BIDDER2());

    // Set bid amount
    let bid_amount_2 = 1500_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER2(), bid_amount_2);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_2);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_2);

    // Get bidder1 balance after bid replaced
    let bidder_1_balance_after_bid_replaced = erc20_token.balance_of(BIDDER1());

    // Verify aquarium initialization details
    let auction: Auction = world.read_model(auction_id);
    assert(auction.highest_bid.is_some(), 'Highest bid should be some');
    assert(auction.no_of_bids == 2, 'Auction bids should be 1');

    if let Option::Some(highest_bid) = auction.highest_bid {
        assert(highest_bid.bid_amount == bid_amount_2, 'Bid amount should match');
        assert(highest_bid.bidder == BIDDER2(), 'Bidder should match');
    }

    assert(
        bidder_1_balance_after_bidding + bid_amount_1 == bidder_1_balance_after_bid_replaced,
        'Balance should increase',
    );
}

#[test]
#[should_panic(expected: ('INVALID BID', 'ENTRYPOINT_FAILED'))]
fn test_auction_invalid_bid_lower_than_start_price() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount: Invalid bid below start bid
    let bid_amount_1 = 900_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);
}

#[test]
#[should_panic(expected: ('INVALID BID', 'ENTRYPOINT_FAILED'))]
fn test_auction_invalid_bid_lower_than_highest_bid() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);

    // Bidder 2
    // Set caller as Bidder2
    testing::set_contract_address(BIDDER2());

    // Set bid amount: Invalid bid amount for bidder 2 (lower than than highest bid)
    let bid_amount_2 = 1000_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER2(), bid_amount_2);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_2);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_2);
}

#[test]
fn test_auction_cancel() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Cancel auction
    auction_system.cancel_auction(auction_id);

    let auction: Auction = world.read_model(auction_id);
    assert(auction.status == AuctionStatus::Cancelled, 'Status should be cancelled');
}

#[test]
#[should_panic(expected: ('CANNOT CANCEL AUCTION', 'ENTRYPOINT_FAILED'))]
fn test_auction_cancel_fail_when_bid_already_recorded() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Cancel auction
    auction_system.cancel_auction(auction_id);
}

#[test]
#[should_panic(expected: ('AUCTION ALREADY CANCELED', 'ENTRYPOINT_FAILED'))]
fn test_auction_bid_fail_when_auction_cancelled() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Cancel auction
    auction_system.cancel_auction(auction_id);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);
}

#[test]
fn test_end_auction_with_bids() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);

    // Move time to end of auction

    testing::set_block_timestamp(end_date + 10_u64);

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    auction_system.end_auction(auction_id);

    let auction: Auction = world.read_model(auction_id);
    assert(auction.final_price == bid_amount_1, 'Bid amount should match');
    assert(auction.highest_bid.is_some(), 'Highest bid should exist');
    assert(auction.status == AuctionStatus::Completed, 'Status should be completed');

    if let Option::Some(highest_bid) = auction.highest_bid {
        assert(highest_bid.bid_amount == bid_amount_1, 'Bid amount should match');
        assert(highest_bid.bidder == BIDDER1(), 'Bidder should match');
    }

    // Check that fish was transferred
    let fish: Fish = world.read_model(fish_id);
    assert(fish.owner == BIDDER1(), 'Fish owner should match');
}

#[test]
fn test_end_auction_when_no_bids() {
    // Initialize test environment with test contracts;
    let TestContracts { world, auction_system, fish_system, erc20_token } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Move time to end of auction

    testing::set_block_timestamp(end_date + 10_u64);

    auction_system.end_auction(auction_id);

    let auction: Auction = world.read_model(auction_id);
    assert(auction.final_price == 0, 'Bid amount should match');
    assert(auction.highest_bid.is_none(), 'Highest bid should be none');
    assert(auction.status == AuctionStatus::Completed, 'Status should be completed');

    // Check that fish was not transferred
    let fish: Fish = world.read_model(fish_id);
    assert(fish.owner == OWNER(), 'Fish owner should match');
}


#[test]
#[should_panic(expected: ('AUCTION ENDED', 'ENTRYPOINT_FAILED'))]
fn test_bid_fails_when_auction_ended() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    // Move time to end of auction
    testing::set_block_timestamp(end_date + 10_u64);

    // Bidder 1
    // Set caller as Bidder 1
    testing::set_contract_address(BIDDER1());

    // Set bid amount
    let bid_amount_1 = 1200_u256;

    // Mint tokens
    IERC20MockPublicDispatcher { contract_address: erc20_token.contract_address }
        .mint(BIDDER1(), bid_amount_1);

    // Approve auction contract to spend bid amount
    erc20_token.approve(auction_system.contract_address, bid_amount_1);

    // Make bid
    auction_system.make_bid(auction_id, bid_amount_1);
}

#[test]
#[should_panic(expected: ('AUCTION NOT ENDED', 'ENTRYPOINT_FAILED'))]
fn test_end_auction_fails_when_auction_still_running() {
    // Initialize test environment with test contracts;
    let TestContracts {
        world: _, auction_system, fish_system, erc20_token,
    } = initialize_contacts();

    // Set caller as Owner
    testing::set_contract_address(OWNER());

    // Create Fish model
    let fish_id = fish_system.create_fish(OWNER(), 1_32);

    // Create Auction model instance and fetch from world state
    let start_price = 1000_u256;
    let end_date = get_block_timestamp() + 1000_u64;
    let auction_id = auction_system
        .create_auction(fish_id, start_price, end_date, erc20_token.contract_address);

    auction_system.end_auction(auction_id);
}
