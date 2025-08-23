#[derive(Copy, Drop)]
pub enum FriendRequestStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
}
pub impl FriendRequestStatusIntoU8 of Into<FriendRequestStatus, u8> {
    fn into(self: FriendRequestStatus) -> u8 {
        match self {
            FriendRequestStatus::PENDING => 0,
            FriendRequestStatus::ACCEPTED => 1,
            FriendRequestStatus::REJECTED => 2,
        }
    }
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct FriendRequest {
    #[key]
    pub player: (u64, u64), // request_id, player_id
    pub sender: u64, // player_id
    pub sent: bool,
    pub accepted: bool,
    pub status: u8,
    // 0 => PENDING, 1 => ACCEPTED, 2 => REJECTED
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct FriendRequestCount {
    #[key]
    pub player: u64,
    pub count: u64,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct FriendsList {
    #[key]
    pub player: u64,
    pub friends: Array<u64>,
}

