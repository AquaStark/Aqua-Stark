#[cfg(test)]
pub mod Test {
    use super::*;
    use dojo::world::WorldStorageTrait;
    use dojo::model::ModelStorage;
    use aqua_stark::models::daily_challange::{
        e_RewardClaimed, e_ParticipantJoined, e_ChallengeCreated, m_DailyChallenge,
        m_Challenge_Counter, m_ChallengeParticipation, e_ChallengeCompleted, Challenge_Counter,
        DailyChallenge, ChallengeParticipation,
    };
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use aqua_stark::systems::daily_challenge::{
        IDailyChallengeDispatcher, IDailyChallengeDispatcherTrait, daily_challenge,
    };

    fn namespace_def() -> NamespaceDef {
        NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_DailyChallenge::TEST_CLASS_HASH),
                TestResource::Model(m_Challenge_Counter::TEST_CLASS_HASH),
                TestResource::Model(m_ChallengeParticipation::TEST_CLASS_HASH),
                TestResource::Event(e_ChallengeCreated::TEST_CLASS_HASH),
                TestResource::Event(e_RewardClaimed::TEST_CLASS_HASH),
                TestResource::Event(e_ParticipantJoined::TEST_CLASS_HASH),
                TestResource::Event(e_ChallengeCompleted::TEST_CLASS_HASH),
                TestResource::Contract(daily_challenge::TEST_CLASS_HASH),
            ]
                .span(),
        }
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"daily_challenge")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
        ]
            .span()
    }

    #[test]
    fn test_Create_Challenge() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Initialize the challenge counter (required by contract logic)
        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 2; // Tuesday
        let seed: u64 = 78901;
        let challenge_id = actions_system.create_challenge(day, seed);

        // Assert: Challenge_Counter updated
        let counter: Challenge_Counter = world.read_model('challenge_counter');
        assert!(counter.counter == challenge_id, "Challenge counter not incremented");

        // Assert: DailyChallenge written
        let challenge: DailyChallenge = world.read_model(challenge_id);
        assert!(challenge.challenge_id == challenge_id, "Challenge_ID_mismatch");
        assert!(challenge.active, "Challenge should be active");
    }

    #[test]
    fn test_Join_Challenge() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Counter initialization
        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 2;
        let seed: u64 = 12345;
        let challenge_id = actions_system.create_challenge(day, seed);
        actions_system.join_challenge(challenge_id);

        // Assert participation written
        let participant = starknet::get_caller_address();
        let participation: ChallengeParticipation = world.read_model((challenge_id, participant));
        assert!(participation.joined, "Participation not marked as joined");
        assert!(!participation.completed, "Should not be completed yet");
        assert!(!participation.reward_claimed, "Reward should not be claimed yet");
    }

    #[test]
    fn test_Complete_Challenge() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Counter initialization
        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 3;
        let seed: u64 = 55555;
        let challenge_id = actions_system.create_challenge(day, seed);
        actions_system.join_challenge(challenge_id);
        actions_system.complete_challenge(challenge_id);

        let participant = starknet::get_caller_address();
        let participation: ChallengeParticipation = world.read_model((challenge_id, participant));
        assert!(participation.joined, "Joined flag broken");
        assert!(participation.completed, "Completed flag missing");
        assert!(!participation.reward_claimed, "Reward should not be claimed yet");
    }

    #[test]
    fn test_Claim_Reward() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 4;
        let seed: u64 = 77777;
        let challenge_id = actions_system.create_challenge(day, seed);
        actions_system.join_challenge(challenge_id);
        actions_system.complete_challenge(challenge_id);
        actions_system.claim_reward(challenge_id);

        let participant = starknet::get_caller_address();
        let participation: ChallengeParticipation = world.read_model((challenge_id, participant));
        assert!(participation.joined, "Should be joined");
        assert!(participation.completed, "Should be completed");
        assert!(participation.reward_claimed, "Reward should be claimed");
    }

    #[test]
    #[should_panic]
    fn test_Join_Challenge_Twice() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 2;
        let seed: u64 = 12345;
        let challenge_id = actions_system.create_challenge(day, seed);
        actions_system.join_challenge(challenge_id);

        actions_system.join_challenge(challenge_id);
    }

    #[test]
    #[should_panic]
    fn test_Join_NonActive_Challenge() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 3;
        let seed: u64 = 88888;
        let challenge_id = actions_system.create_challenge(day, seed);

        // Manually mark as inactive
        let mut challenge: DailyChallenge = world.read_model(challenge_id);
        challenge.active = false;
        world.write_model(@challenge);

        actions_system.join_challenge(challenge_id);
    }

    #[test]
    #[should_panic]
    fn test_Complete_Without_Join() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 4;
        let seed: u64 = 33333;
        let challenge_id = actions_system.create_challenge(day, seed);

        actions_system.complete_challenge(challenge_id);
    }

    #[test]
    #[should_panic]
    fn test_Claim_Twice() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world.write_model(@Challenge_Counter { id: 'challenge_counter', counter: 0_u64 });
        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let day: u8 = 1;
        let seed: u64 = 54321;
        let challenge_id = actions_system.create_challenge(day, seed);
        actions_system.join_challenge(challenge_id);
        actions_system.complete_challenge(challenge_id);
        actions_system.claim_reward(challenge_id);

        actions_system.claim_reward(challenge_id);
    }

    #[test]
    #[should_panic]
    fn test_Join_Nonexistent_Challenge() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"daily_challenge").unwrap();
        let mut actions_system = IDailyChallengeDispatcher { contract_address };

        let invalid_challenge_id = 999999_u64;

        actions_system.join_challenge(invalid_challenge_id);
    }
}
