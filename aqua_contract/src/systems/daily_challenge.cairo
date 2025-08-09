//@ryzen-xp
#[starknet::interface]
pub trait IDailyChallenge<T> {
    fn create_challenge(ref self: T, day: u8, seed: u64) -> u64;
    fn join_challenge(ref self: T, challenge_id: u64);
    fn complete_challenge(ref self: T, challenge_id: u64);
    fn claim_reward(ref self: T, challenge_id: u64, amount: u64);
}

//@ryzen-xp
#[dojo::contract]
pub mod daily_challenge {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::get_caller_address;
    use aqua_stark::models::dailyChallange::{
        Challenge_Counter, DailyChallengeTrait, ChallengeParticipation, DailyChallenge,
        ChallengeCreated, RewardClaimed, ParticipantJoined, ChallengeCompleted,
    };
    use super::*;


    #[abi(embed_v0)]
    impl DailyChallengeImpl of IDailyChallenge<ContractState> {
        fn create_challenge(ref self: ContractState, day: u8, seed: u64) -> u64 {
            let mut world = self.world_default();

            let mut counter: Challenge_Counter = world.read_model('challenge_counter');
            let challenge_id = counter.counter + 1_u64;

            let counter_obj = Challenge_Counter { id: 'challenge_counter', counter: challenge_id };
            world.write_model(@counter_obj);

            let (ctype, param1, param2, value1, value2, diff) = generate_challenge(day, seed);

            let challenge = DailyChallenge {
                challenge_id,
                challenge_type: ctype,
                param1,
                param2,
                value1,
                value2,
                difficulty: diff,
                active: true,
            };
            world.write_model(@challenge);

            world
                .emit_event(
                    @ChallengeCreated {
                        challenge_id,
                        challenge_type: ctype,
                        param1,
                        param2,
                        value1,
                        value2,
                        difficulty: diff,
                    },
                );

            challenge_id
        }

        fn join_challenge(ref self: ContractState, challenge_id: u64) {
            let mut world = self.world_default();
            let participant = get_caller_address();

            let challenge: DailyChallenge = world.read_model(challenge_id);

            assert(challenge.active, 'Challenge not active');

            let participation_obj = ChallengeParticipation {
                challenge_id, participant, joined: true, completed: false, reward_claimed: false,
            };
            world.write_model(@participation_obj);

            world.emit_event(@ParticipantJoined { challenge_id, participant });
        }

        fn complete_challenge(ref self: ContractState, challenge_id: u64) {
            let mut world = self.world_default();
            let participant = get_caller_address();

            let mut participation: ChallengeParticipation = world
                .read_model((challenge_id, participant));

            assert(participation.joined, 'Participant_has_not_joined');

            participation.completed = true;
            world.write_model(@participation);

            world.emit_event(@ChallengeCompleted { challenge_id, participant });
        }

        fn claim_reward(ref self: ContractState, challenge_id: u64, amount: u64) {
            let mut world = self.world_default();
            let participant = get_caller_address();

            let mut participation: ChallengeParticipation = world
                .read_model((challenge_id, participant));

            assert(participation.completed, 'Challenge_not_completed');
            assert(participation.reward_claimed, 'Reward_already_claimed');

            participation.reward_claimed = true;
            world.write_model(@participation);

            world.emit_event(@RewardClaimed { challenge_id, participant, reward_amount: amount });
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }
    }

    // Challenge parameter generator
    pub fn generate_challenge(day: u8, seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        match day {
            0 => DailyChallengeTrait::generate_sunday_challenge(seed),
            1 => DailyChallengeTrait::generate_monday_challenge(seed),
            2 => DailyChallengeTrait::generate_tuesday_challenge(seed),
            3 => DailyChallengeTrait::generate_wednesday_challenge(seed),
            4 => DailyChallengeTrait::generate_thursday_challenge(seed),
            5 => DailyChallengeTrait::generate_friday_challenge(seed),
            _ => DailyChallengeTrait::generate_saturday_challenge(seed),
        }
    }
}
