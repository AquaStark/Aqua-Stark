use dojo_starter::entities::friends::FriendRequest;
use dojo_starter::entities::player::Player;

#[starknet::interface]
pub trait IFriendState<TContractState> {
    fn get_friend_request(self: @TContractState, request_id: u64, player: Player) -> FriendRequest;
    fn send_friend_request(ref self: TContractState, sender: Player, receiver: Player) -> u64;
    fn accept_friend_request(ref self: TContractState, request_id: u64, player: Player);
    fn reject_friend_request(ref self: TContractState, request_id: u64, player: Player);
    fn delete_friend_request(ref self: TContractState, request_id: u64, player: Player);
    fn friends_list(self: @TContractState, player: Player) -> Array<u64>;
}

#[dojo::contract]
pub mod FriendState {
    use core::array::ArrayTrait;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo_starter::entities::base::{
        FriendRequestAccepted, FriendRequestDeleted, FriendRequestRejected, FriendRequestSent,
    };
    use dojo_starter::entities::friends::{
        FriendRequest, FriendRequestCount, FriendRequestStatus, FriendsList,
    };
    use dojo_starter::entities::player::Player;
    use super::*;


    #[abi(embed_v0)]
    impl FriendsImpl of IFriendState<ContractState> {
        fn get_friend_request(
            self: @ContractState, request_id: u64, player: Player,
        ) -> FriendRequest {
            let mut world = self.world_default();
            let mut request: FriendRequest = world.read_model((request_id, player.id));
            assert(request.sent, 'Friend Request not found');
            request
        }
        fn send_friend_request(ref self: ContractState, sender: Player, receiver: Player) -> u64 {
            let mut world = self.world_default();

            // Generate new request id from friendrequestcount
            let mut request_count: FriendRequestCount = world.read_model(receiver.id);
            request_count.count = request_count.count + 1;

            // Create new friend request
            let request = FriendRequest {
                player: (request_count.count, receiver.id),
                sender: sender.id,
                sent: true,
                accepted: false,
                status: FriendRequestStatus::PENDING.into(),
            };

            // Write to world state
            world.write_model(@request);
            // Write new count to world state
            world.write_model(@request_count);

            // Emit event
            let request_event = FriendRequestSent {
                request_id: request_count.count, player: receiver.id, sender: sender.id,
            };
            world.emit_event(@request_event);

            request_count.count
        }
        fn accept_friend_request(ref self: ContractState, request_id: u64, player: Player) {
            let mut world = self.world_default();

            let mut request: FriendRequest = world.read_model((request_id, player.id));
            assert(request.sent, 'Friend Request not found');

            request.accepted = true;
            request.status = FriendRequestStatus::ACCEPTED.into();

            let mut friend_list: FriendsList = world.read_model(player.id);
            friend_list.friends.append(request.sender);

            world.write_model(@request);
            world.write_model(@friend_list);

            // Emit event
            let request_event = FriendRequestAccepted {
                request_id, player: player.id, sender: request.sender,
            };
            world.emit_event(@request_event);
        }
        fn reject_friend_request(ref self: ContractState, request_id: u64, player: Player) {
            let mut world = self.world_default();

            let mut request: FriendRequest = world.read_model((request_id, player.id));
            assert(request.sent, 'Friend Request not found');

            request.status = FriendRequestStatus::REJECTED.into();
            world.write_model(@request);

            // Emit event
            let request_event = FriendRequestRejected {
                request_id, player: player.id, sender: request.sender,
            };
            world.emit_event(@request_event);
        }
        fn delete_friend_request(ref self: ContractState, request_id: u64, player: Player) {
            let mut world = self.world_default();

            let mut request: FriendRequest = world.read_model((request_id, player.id));
            assert(request.sent, 'Friend Request not found');

            request.sent = false;
            world.write_model(@request);

            // Emit event
            let request_event = FriendRequestDeleted {
                request_id, player: player.id, sender: request.sender,
            };
            world.emit_event(@request_event);
        }
        fn friends_list(self: @ContractState, player: Player) -> Array<u64> {
            let mut world = self.world_default();

            let mut friend_list: FriendsList = world.read_model(player.id);

            let mut array_of_friends: Array<u64> = ArrayTrait::new();
            for index in 0..friend_list.friends.len() {
                array_of_friends.append(*friend_list.friends.at(index));
            }
            array_of_friends
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            // self.world(@"aquastark")
            self.world(@"dojo_starter")
        }
    }
}
