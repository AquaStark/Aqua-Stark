#[cfg(test)]
pub mod Test {
    use aqua_stark::base::events::{
        ExperienceConfigUpdated, ExperienceEarned, LevelUp, RewardClaimed,
        e_ExperienceConfigUpdated, e_ExperienceEarned, e_LevelUp, e_RewardClaimed,
    };
    use aqua_stark::interfaces::IExperience::{IExperienceDispatcher, IExperienceDispatcherTrait};
    use aqua_stark::models::experience_model::{
        Experience, ExperienceConfig, ExperienceCounter, m_Experience, m_ExperienceConfig,
        m_ExperienceCounter,
    };
    use aqua_stark::systems::experience::experience;
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use starknet::{contract_address_const, testing};
    use super::*;

    fn namespace_def() -> NamespaceDef {
        NamespaceDef {
            namespace: "aqua_stark",
            resources: [
                TestResource::Model(m_Experience::TEST_CLASS_HASH),
                TestResource::Model(m_ExperienceConfig::TEST_CLASS_HASH),
                TestResource::Model(m_ExperienceCounter::TEST_CLASS_HASH),
                TestResource::Event(e_ExperienceEarned::TEST_CLASS_HASH),
                TestResource::Event(e_LevelUp::TEST_CLASS_HASH),
                TestResource::Event(e_RewardClaimed::TEST_CLASS_HASH),
                TestResource::Event(e_ExperienceConfigUpdated::TEST_CLASS_HASH),
                TestResource::Contract(experience::TEST_CLASS_HASH),
            ]
                .span(),
        }
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"aqua_stark", @"experience")
                .with_writer_of([dojo::utils::bytearray_hash(@"aqua_stark")].span())
        ]
            .span()
    }

    #[test]
    fn test_initialize_player_experience() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Initialize default config
        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);

        let experience: Experience = world.read_model(player);
        assert!(experience.player == player, "Player address mismatch");
        assert!(experience.total_experience == 0, "Initial experience should be 0");
        assert!(experience.current_level == 1, "Initial level should be 1");
        assert!(experience.experience_in_current_level == 0, "Initial level exp should be 0");
    }

    #[test]
    fn test_grant_experience() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        // Initialize default config and counter
        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );
        world.write_model(@ExperienceCounter { id: 'total_grants', total_grants: 0 });

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);
        actions_system.grant_experience(player, 150);

        let experience: Experience = world.read_model(player);
        assert!(experience.total_experience == 150, "Total experience incorrect");
        assert!(experience.current_level == 2, "Level should be 2");
        assert!(experience.player == player, "Player address incorrect");

        // Check counter was updated
        let counter: ExperienceCounter = world.read_model('total_grants');
        assert!(counter.total_grants == 150, "Counter not updated");
    }

    #[test]
    fn test_level_up_multiple_levels() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );
        world.write_model(@ExperienceCounter { id: 'total_grants', total_grants: 0 });

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);
        actions_system.grant_experience(player, 500);

        let experience: Experience = world.read_model(player);
        assert!(experience.total_experience == 500, "Total experience incorrect");
        assert!(experience.current_level > 1, "Should have leveled up");
    }

    #[test]
    fn test_get_level_progress() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );
        world.write_model(@ExperienceCounter { id: 'total_grants', total_grants: 0 });

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);
        actions_system.grant_experience(player, 75);

        let (current_exp, exp_needed) = actions_system.get_level_progress(player);
        assert!(current_exp > 0, "Should have progress in level");
        assert!(exp_needed > 0, "Should need more exp for next level");
    }

    #[test]
    fn test_update_experience_config() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        actions_system.update_experience_config(200, 125, 50);

        let config = actions_system.get_experience_config();
        assert!(config.base_experience == 200, "Base experience not updated");
        assert!(config.experience_multiplier == 125, "Multiplier not updated");
        assert!(config.max_level == 50, "Max level not updated");
    }

    #[test]
    fn test_claim_level_reward() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );
        world.write_model(@ExperienceCounter { id: 'total_grants', total_grants: 0 });

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);
        actions_system.grant_experience(player, 150);
        actions_system.claim_level_reward(2);
        // Test passes if no assertion fails
    }

    #[test]
    fn test_get_total_experience_granted() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );
        world.write_model(@ExperienceCounter { id: 'total_grants', total_grants: 0 });

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);

        let initial_total = actions_system.get_total_experience_granted();
        actions_system.grant_experience(player, 100);

        let final_total = actions_system.get_total_experience_granted();
        assert!(final_total == initial_total + 100, "Counter not updated correctly");
    }

    #[test]
    #[should_panic]
    fn test_claim_reward_level_not_reached() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);
        actions_system.claim_level_reward(5);
    }

    #[test]
    fn test_get_experience_for_next_level() {
        let mut world = spawn_test_world([namespace_def()].span());
        world.sync_perms_and_inits(contract_defs());

        world
            .write_model(
                @ExperienceConfig {
                    id: 'default', base_experience: 100, experience_multiplier: 150, max_level: 100,
                },
            );

        let (contract_address, _) = world.dns(@"experience").unwrap();
        let mut actions_system = IExperienceDispatcher { contract_address };

        let player = contract_address_const::<'player'>();
        testing::set_contract_address(player);

        actions_system.initialize_player_experience(player);

        let next_level_exp = actions_system.get_experience_for_next_level(player);
        assert!(next_level_exp > 0, "Should need experience for next level");
    }
}
