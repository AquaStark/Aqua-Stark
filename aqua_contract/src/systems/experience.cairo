#[dojo::contract]
pub mod experience {
    use dojo::world::{IWorldDispatcherTrait, WorldStorage};
    use dojo::model::ModelStorage;
    use dojo::event::EventStorage;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};

    use aqua_stark::models::experience_model::{
        Experience, ExperienceConfig, ExperienceCounter, ExperienceTrait,
    };
    use aqua_stark::models::player_model::Player;
    use aqua_stark::base::events::{
        ExperienceEarned, LevelUp, RewardClaimed, ExperienceConfigUpdated,
    };
    use aqua_stark::interfaces::IExperience::IExperience;

    #[abi(embed_v0)]
    impl ExperienceImpl of IExperience<ContractState> {
        fn grant_experience(ref self: ContractState, player: ContractAddress, amount: u64) {
            let mut world = self.world_default();

            // Get current experience and config
            let mut experience: Experience = world.read_model(player);
            let config: ExperienceConfig = world.read_model('default');

            // Store old level for event comparison
            let old_level = experience.current_level;

            // Grant experience using the trait
            experience = ExperienceTrait::grant_experience(experience, player, amount, config);

            // Update experience counter
            let mut counter: ExperienceCounter = world.read_model('total_grants');
            counter.total_grants += amount.into();

            // Write updated models
            world.write_model(@experience);
            world.write_model(@counter);

            // Emit experience earned event
            world
                .emit_event(
                    @ExperienceEarned {
                        player,
                        amount,
                        total_experience: experience.total_experience,
                        timestamp: get_block_timestamp(),
                    },
                );

            // Emit level up event if level changed
            if experience.current_level > old_level {
                world
                    .emit_event(
                        @LevelUp {
                            player,
                            old_level,
                            new_level: experience.current_level,
                            total_experience: experience.total_experience,
                            timestamp: get_block_timestamp(),
                        },
                    );
            }
        }

        fn get_player_experience(self: @ContractState, player: ContractAddress) -> Experience {
            let world = self.world_default();
            world.read_model(player)
        }

        fn get_experience_config(self: @ContractState) -> ExperienceConfig {
            let world = self.world_default();
            world.read_model('default')
        }

        fn update_experience_config(
            ref self: ContractState,
            base_experience: u64,
            experience_multiplier: u64,
            max_level: u32,
        ) {
            let mut world = self.world_default();

            let mut config: ExperienceConfig = world.read_model('default');
            config.base_experience = base_experience;
            config.experience_multiplier = experience_multiplier;
            config.max_level = max_level;

            world.write_model(@config);

            world
                .emit_event(
                    @ExperienceConfigUpdated {
                        base_experience,
                        experience_multiplier,
                        max_level,
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn initialize_player_experience(ref self: ContractState, player: ContractAddress) {
            let mut world = self.world_default();

            let experience = Experience {
                player,
                total_experience: 0,
                current_level: 1,
                experience_in_current_level: 0,
                last_updated: get_block_timestamp(),
            };

            world.write_model(@experience);
        }

        fn get_level_progress(self: @ContractState, player: ContractAddress) -> (u64, u64) {
            let world = self.world_default();
            let experience: Experience = world.read_model(player);
            let config: ExperienceConfig = world.read_model('default');

            ExperienceTrait::get_level_progress(experience, config)
        }

        fn get_experience_for_next_level(self: @ContractState, player: ContractAddress) -> u64 {
            let world = self.world_default();
            let experience: Experience = world.read_model(player);
            let config: ExperienceConfig = world.read_model('default');

            ExperienceTrait::get_experience_for_next_level(experience, config)
        }

        fn claim_level_reward(ref self: ContractState, level: u32) {
            let caller = get_caller_address();
            let mut world = self.world_default();

            let experience: Experience = world.read_model(caller);
            assert(experience.current_level >= level, 'Level not reached');

            // Here you would implement reward logic
            // For now, just emit the event
            world
                .emit_event(
                    @RewardClaimed {
                        player: caller,
                        level,
                        reward_type: 'level_reward',
                        timestamp: get_block_timestamp(),
                    },
                );
        }

        fn get_total_experience_granted(self: @ContractState) -> u256 {
            let world = self.world_default();
            let counter: ExperienceCounter = world.read_model('total_grants');
            counter.total_grants
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "aqua_stark". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@"aqua_stark")
        }
    }
}
