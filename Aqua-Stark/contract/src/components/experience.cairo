use starknet::ContractAddress;

#[starknet::interface]
pub trait IPlayerExperience<TContractState> {
    fn grant_experience(ref self: TContractState, player: ContractAddress, amount: u64);
    fn get_player_level(self: @TContractState, player: ContractAddress) -> u32;
    fn get_player_experience(self: @TContractState, player: ContractAddress) -> u64;
    fn get_experience_for_next_level(self: @TContractState, player: ContractAddress) -> u64;
    fn get_level_progress(
        self: @TContractState, player: ContractAddress,
    ) -> (u64, u64); // (current_exp_in_level, exp_needed_for_next)
    fn calculate_level_from_experience(self: @TContractState, experience: u64) -> u32;
    fn get_experience_threshold(self: @TContractState, level: u32) -> u64;
    fn can_grant_experience(self: @TContractState, granter: ContractAddress) -> bool;
    fn add_experience_granter(ref self: TContractState, granter: ContractAddress);
    fn remove_experience_granter(ref self: TContractState, granter: ContractAddress);
}

#[dojo::contract]
pub mod PlayerExperience {
    use aqua_stark::entities::base::{CustomErrors, Id};
    use aqua_stark::entities::player::Player;
    use aqua_stark::systems::ownership::Ownership;
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use starknet::{contract_address_const, get_caller_address};
    use super::*;

    // Experience progression table - exponential growth
    // Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
    const BASE_EXPERIENCE: u64 = 100;
    const EXPERIENCE_MULTIPLIER: u64 = 150; // 1.5x multiplier per level
    const MAX_LEVEL: u32 = 100;

    component!(path: Ownership, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableMixinImpl = Ownership::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = Ownership::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: Ownership::Storage,
        experience_granters: LegacyMap<ContractAddress, bool>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: Ownership::Event,
        ExperienceGranted: ExperienceGranted,
        LevelUp: LevelUp,
        ExperienceGranterAdded: ExperienceGranterAdded,
        ExperienceGranterRemoved: ExperienceGranterRemoved,
    }

    #[derive(Drop, Serde)]
    #[dojo::event]
    struct ExperienceGranted {
        #[key]
        pub player: ContractAddress,
        pub amount: u64,
        pub total_experience: u64,
        pub granter: ContractAddress,
    }

    #[derive(Drop, Serde)]
    #[dojo::event]
    struct LevelUp {
        #[key]
        pub player: ContractAddress,
        pub old_level: u32,
        pub new_level: u32,
        pub total_experience: u64,
    }

    #[derive(Drop, Serde)]
    #[dojo::event]
    struct ExperienceGranterAdded {
        #[key]
        pub granter: ContractAddress,
        pub added_by: ContractAddress,
    }

    #[derive(Drop, Serde)]
    #[dojo::event]
    struct ExperienceGranterRemoved {
        #[key]
        pub granter: ContractAddress,
        pub removed_by: ContractAddress,
    }

    fn dojo_init(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl PlayerExperienceImpl of IPlayerExperience<ContractState> {
        fn grant_experience(ref self: ContractState, player: ContractAddress, amount: u64) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            // Check if caller is authorized to grant experience
            assert(self.can_grant_experience(caller), 'UNAUTHORIZED_EXPERIENCE_GRANT');

            // Read current player state
            let mut player_data: Player = world.read_model(player);

            // Check if player is registered
            assert(player_data.is_registered(), 'PLAYER_NOT_REGISTERED');

            let old_level = player_data.level;
            let old_experience = player_data.experience;

            // Add experience
            player_data.experience += amount;

            // Calculate new level
            let new_level = self.calculate_level_from_experience(player_data.experience);
            player_data.level = new_level;

            // Write updated player data
            world.write_model(@player_data);

            // Emit experience granted event
            let exp_event = ExperienceGranted {
                player, amount, total_experience: player_data.experience, granter: caller,
            };
            world.emit_event(@exp_event);

            // Emit level up event if level changed
            if new_level > old_level {
                let level_event = LevelUp {
                    player, old_level, new_level, total_experience: player_data.experience,
                };
                world.emit_event(@level_event);
            }
        }

        fn get_player_level(self: @ContractState, player: ContractAddress) -> u32 {
            let world = self.world_default();
            let player_data: Player = world.read_model(player);
            player_data.level
        }

        fn get_player_experience(self: @ContractState, player: ContractAddress) -> u64 {
            let world = self.world_default();
            let player_data: Player = world.read_model(player);
            player_data.experience
        }

        fn get_experience_for_next_level(self: @ContractState, player: ContractAddress) -> u64 {
            let world = self.world_default();
            let player_data: Player = world.read_model(player);

            if player_data.level >= MAX_LEVEL {
                return 0; // Max level reached
            }

            self.get_experience_threshold(player_data.level + 1)
        }

        fn get_level_progress(self: @ContractState, player: ContractAddress) -> (u64, u64) {
            let world = self.world_default();
            let player_data: Player = world.read_model(player);

            if player_data.level >= MAX_LEVEL {
                return (0, 0); // Max level reached
            }

            let current_level_threshold = self.get_experience_threshold(player_data.level);
            let next_level_threshold = self.get_experience_threshold(player_data.level + 1);

            let current_exp_in_level = player_data.experience - current_level_threshold;
            let exp_needed_for_next = next_level_threshold - player_data.experience;

            (current_exp_in_level, exp_needed_for_next)
        }

        fn calculate_level_from_experience(self: @ContractState, experience: u64) -> u32 {
            if experience == 0 {
                return 1;
            }

            let mut level = 1_u32;
            let mut threshold = 0_u64;

            loop {
                if level >= MAX_LEVEL {
                    break MAX_LEVEL;
                }

                let next_threshold = self.get_experience_threshold(level + 1);
                if experience < next_threshold {
                    break level;
                }

                level += 1;
                threshold = next_threshold;
            }
        }

        fn get_experience_threshold(self: @ContractState, level: u32) -> u64 {
            if level <= 1 {
                return 0;
            }

            // Exponential progression: BASE_EXPERIENCE * (level - 1) * (EXPERIENCE_MULTIPLIER /
            // 100) ^ (level - 2)
            let mut threshold = 0_u64;
            let mut current_level = 2_u32;

            loop {
                if current_level > level {
                    break threshold;
                }

                // Calculate experience needed for this level
                // Formula: BASE_EXPERIENCE * level_factor where level_factor increases
                // exponentially
                let level_factor = self.calculate_level_factor(current_level - 1);
                threshold += BASE_EXPERIENCE * level_factor / 100;

                current_level += 1;
            }
        }

        fn can_grant_experience(self: @ContractState, granter: ContractAddress) -> bool {
            // Owner can always grant experience
            if granter == self.ownable.owner() {
                return true;
            }

            // Check if granter is in authorized list
            self.experience_granters.read(granter)
        }

        fn add_experience_granter(ref self: ContractState, granter: ContractAddress) {
            self.ownable.assert_only_owner();
            let mut world = self.world_default();

            self.experience_granters.write(granter, true);

            let event = ExperienceGranterAdded { granter, added_by: get_caller_address() };
            world.emit_event(@event);
        }

        fn remove_experience_granter(ref self: ContractState, granter: ContractAddress) {
            self.ownable.assert_only_owner();
            let mut world = self.world_default();

            self.experience_granters.write(granter, false);

            let event = ExperienceGranterRemoved { granter, removed_by: get_caller_address() };
            world.emit_event(@event);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn calculate_level_factor(self: @ContractState, level: u32) -> u64 {
            // Calculate exponential factor for level progression
            // Returns factor * 100 to maintain precision (divide by 100 when using)
            if level == 0 {
                return 100; // 1.0 * 100
            }

            let mut factor = 100_u64; // Start with 1.0 * 100
            let mut i = 0_u32;

            loop {
                if i >= level {
                    break factor;
                }

                factor = factor * EXPERIENCE_MULTIPLIER / 100;
                i += 1;
            }
        }
    }
}
