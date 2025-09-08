use aqua_stark::types::condition::{Condition, ConditionIntoFelt252};
use aqua_stark::types::reward::{Reward, RewardIntoFelt252};
use aqua_stark::types::status::{Status, StatusIntoFelt252};
use starknet::{ContractAddress, contract_address_const};

#[derive(Drop, Serde, Clone)]
#[dojo::model]
pub struct Mission {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub mission_id: u32,
    pub title: felt252,
    pub description: ByteArray,
    pub condition_type: Condition,
    pub target_value: u64, // Target value for the mission condition
    pub target_id: u32, // Specific ID for fish type, decoration, etc.
    pub reward_type: Reward,
    pub reward_amount: u64, // Amount of reward (e.g., fish, decoration)
    pub reward_item_id: u32, // ID of the reward item (if applicable)
    pub status: Status,
}

#[generate_trait]
pub impl MissionImpl of MissionTrait {
    fn new(
        mission_id: u32,
        title: felt252,
        description: ByteArray,
        condition_type: Condition,
        target_value: u64,
        target_id: u32,
        reward_type: Reward,
        reward_amount: u64,
        reward_item_id: u32,
    ) -> Mission {
        Mission {
            player_id: contract_address_const::<0x0>(),
            mission_id,
            title,
            description,
            condition_type,
            target_value,
            target_id,
            reward_type,
            reward_amount,
            reward_item_id,
            status: Status::NotStarted,
        }
    }

    fn assign_to_player(ref self: Mission, player_id: ContractAddress) {
        self.player_id = player_id;
        self.status = Status::InProgress;
    }

    fn update_status(ref self: Mission, new_status: Status) {
        self.status = new_status;
    }

    fn is_completed(self: @Mission) -> bool {
        *self.status == Status::Completed
    }
}

#[cfg(test)]
mod tests {
    use aqua_stark::types::condition::Condition;
    use aqua_stark::types::reward::Reward;
    use aqua_stark::types::status::Status;
    use starknet::{ContractAddress, contract_address_const};
    use super::MissionImpl;

    #[test]
    fn test_mission_creation() {
        let mission = MissionImpl::new(
            1,
            'Rare Fish Collection',
            "Catch 5 clownfish",
            Condition::CatchFish,
            5,
            123,
            Reward::Shells,
            100,
            0,
        );

        assert(mission.mission_id == 1, 'Wrong mission id');
        assert(mission.title == 'Rare Fish Collection', 'Wrong title');
        assert(mission.condition_type == Condition::CatchFish, 'Wrong condition');
        assert(mission.target_value == 5, 'Wrong target value');
        assert(mission.reward_type == Reward::Shells, 'Wrong reward type');
        assert(mission.reward_amount == 100, 'Wrong reward amount');
        assert(mission.status == Status::NotStarted, 'Wrong initial status');
    }

    #[test]
    fn test_mission_assignment() {
        let mut mission = MissionImpl::new(
            1,
            'Rare Fish Collection',
            "Catch 5 clownfish",
            Condition::CatchFish,
            5,
            123,
            Reward::Shells,
            100,
            0,
        );

        let player_addr: ContractAddress = contract_address_const::<0x123>();

        mission.assign_to_player(player_addr);

        assert(mission.player_id == player_addr, 'Wrong player assigned');
        assert(mission.status == Status::InProgress, 'Wrong status after assignment');
    }

    #[test]
    fn test_mission_status_update() {
        let mut mission = MissionImpl::new(
            1,
            'Rare Fish Collection',
            "Catch 5 clownfish",
            Condition::CatchFish,
            5,
            123,
            Reward::Shells,
            100,
            0,
        );

        let player_addr: ContractAddress = contract_address_const::<0x123>();
        mission.assign_to_player(player_addr);

        // Update status to completed
        mission.update_status(Status::Completed);
        assert(mission.status == Status::Completed, 'Status should be Completed');
        assert(mission.is_completed(), 'Mission should be completed');

        // Update status to failed
        mission.update_status(Status::Failed);
        assert(mission.status == Status::Failed, 'Status should be Failed');
        assert(!mission.is_completed(), 'Mission should not be completed');
    }
}
