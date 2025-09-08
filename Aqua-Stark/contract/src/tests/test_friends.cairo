use dojo::world::WorldStorageTrait;
use dojo_starter::components::friends::{IFriendStateDispatcher, IFriendStateDispatcherTrait};
use dojo_starter::entities::friends::FriendRequestStatus;
use dojo_starter::entities::player::Player;
use dojo_starter::tests::test_utils::setup;
use starknet::{ContractAddress, contract_address_const};

fn OWNER() -> ContractAddress {
    contract_address_const::<'owner'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'user'>()
}

fn deploy() -> IFriendStateDispatcher {
    // Initialize test environment with world and caller
    let mut world = setup();

    // Initialize Friends contract
    let (contract_address, _) = world.dns(@"FriendState").unwrap();
    IFriendStateDispatcher { contract_address }
}


#[test]
fn test_send_friend_request() {
    let sender = Player {
        id: 1,
        wallet: contract_address_const::<'wallet1'>(),
        inventory_ref: contract_address_const::<'inventory1'>(),
    };
    let receiver = Player {
        id: 2,
        wallet: contract_address_const::<'wallet2'>(),
        inventory_ref: contract_address_const::<'inventory2'>(),
    };
    let contract_dispatcher = deploy();
    let request_id = contract_dispatcher.send_friend_request(sender, receiver);

    let request = contract_dispatcher.get_friend_request(request_id, receiver);
    assert(request.sent, 'Request was not sent');
    assert(request.status == FriendRequestStatus::PENDING.into(), 'Request was not sent');
}

#[test]
fn test_accept_friend_request() {
    let sender = Player {
        id: 1,
        wallet: contract_address_const::<'wallet1'>(),
        inventory_ref: contract_address_const::<'inventory1'>(),
    };
    let receiver = Player {
        id: 2,
        wallet: contract_address_const::<'wallet2'>(),
        inventory_ref: contract_address_const::<'inventory2'>(),
    };
    let contract_dispatcher = deploy();
    // Send Friend Request
    let request_id = contract_dispatcher.send_friend_request(sender, receiver);

    // Accept Friend Request
    contract_dispatcher.accept_friend_request(request_id, receiver);

    // Get the request to confirm that request is accepted
    let request = contract_dispatcher.get_friend_request(request_id, receiver);
    assert(request.sent, 'Request was not sent');
    assert(request.accepted, 'Request was not accepted');
    assert(
        request.status == FriendRequestStatus::ACCEPTED.into(), 'Request status is not accepted',
    );
}

#[test]
fn test_reject_friend_request() {
    let sender = Player {
        id: 1,
        wallet: contract_address_const::<'wallet1'>(),
        inventory_ref: contract_address_const::<'inventory1'>(),
    };
    let receiver = Player {
        id: 2,
        wallet: contract_address_const::<'wallet2'>(),
        inventory_ref: contract_address_const::<'inventory2'>(),
    };
    let contract_dispatcher = deploy();
    // Send Friend Request
    let request_id = contract_dispatcher.send_friend_request(sender, receiver);

    // Reject Friend Request
    contract_dispatcher.reject_friend_request(request_id, receiver);

    // Get the request to confirm that request is accepted
    let request = contract_dispatcher.get_friend_request(request_id, receiver);
    assert(request.sent, 'Request was not sent');
    assert(!request.accepted, 'Request should not be accepted');
    assert(
        request.status == FriendRequestStatus::REJECTED.into(), 'Request status is not rejected',
    );
}

#[test]
#[should_panic]
fn test_delete_friend_request() {
    let sender = Player {
        id: 1,
        wallet: contract_address_const::<'wallet1'>(),
        inventory_ref: contract_address_const::<'inventory1'>(),
    };
    let receiver = Player {
        id: 2,
        wallet: contract_address_const::<'wallet2'>(),
        inventory_ref: contract_address_const::<'inventory2'>(),
    };
    let contract_dispatcher = deploy();
    // Send Friend Request
    let request_id = contract_dispatcher.send_friend_request(sender, receiver);
    // verify that the request was created
    let request = contract_dispatcher.get_friend_request(request_id, receiver);
    assert(request.sent, 'Request was not sent');

    // Delete Friend Request
    contract_dispatcher.delete_friend_request(request_id, receiver);
    // This should panic as the friend request no longer exists
    contract_dispatcher.get_friend_request(request_id, receiver);
}

