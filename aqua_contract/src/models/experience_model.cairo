use starknet::{ContractAddress, get_caller_address};

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct Experience {
    #[key]
    pub player: ContractAddress,
    pub total_experience: u64,
    pub current_level: u32,
    pub experience_in_current_level: u64,
    pub last_updated: u64,
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct ExperienceCounter {
    #[key]
    pub id: felt252,
    pub total_grants: u256,
}

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct ExperienceConfig {
    #[key]
    pub id: felt252,
    pub base_experience: u64,
    pub experience_multiplier: u64,
    pub max_level: u32,
}

pub trait ExperienceTrait {
    fn grant_experience(
        experience: Experience, player: ContractAddress, amount: u64, config: ExperienceConfig,
    ) -> Experience;

    fn calculate_level_from_experience(total_experience: u64, config: ExperienceConfig) -> u32;

    fn get_experience_threshold(level: u32, config: ExperienceConfig) -> u64;

    fn get_experience_for_next_level(experience: Experience, config: ExperienceConfig) -> u64;

    fn get_level_progress(experience: Experience, config: ExperienceConfig) -> (u64, u64);
}

impl ExperienceImpl of ExperienceTrait {
    fn grant_experience(
        mut experience: Experience, player: ContractAddress, amount: u64, config: ExperienceConfig,
    ) -> Experience {
        experience.player = player;
        experience.total_experience += amount;

        let old_level = experience.current_level;
        let new_level = Self::calculate_level_from_experience(experience.total_experience, config);
        experience.current_level = new_level;

        // Calculate experience in current level
        let current_level_threshold = Self::get_experience_threshold(new_level, config);
        experience.experience_in_current_level = experience.total_experience
            - current_level_threshold;

        // Update timestamp
        experience.last_updated = starknet::get_block_timestamp();

        experience
    }

    fn calculate_level_from_experience(total_experience: u64, config: ExperienceConfig) -> u32 {
        if total_experience == 0 {
            return 1;
        }

        let mut level = 1_u32;

        loop {
            if level >= config.max_level {
                break config.max_level;
            }

            let next_threshold = Self::get_experience_threshold(level + 1, config);
            if total_experience < next_threshold {
                break level;
            }

            level += 1;
        }
    }

    fn get_experience_threshold(level: u32, config: ExperienceConfig) -> u64 {
        if level <= 1 {
            return 0;
        }

        let mut threshold = 0_u64;
        let mut current_level = 2_u32;

        loop {
            if current_level > level {
                break threshold;
            }

            // Calculate experience needed for this level using exponential progression
            let level_factor = Self::calculate_level_factor(current_level - 1, config);
            threshold += config.base_experience * level_factor / 100;

            current_level += 1;
        }
    }

    fn get_experience_for_next_level(experience: Experience, config: ExperienceConfig) -> u64 {
        if experience.current_level >= config.max_level {
            return 0; // Max level reached
        }

        Self::get_experience_threshold(experience.current_level + 1, config)
    }

    fn get_level_progress(experience: Experience, config: ExperienceConfig) -> (u64, u64) {
        if experience.current_level >= config.max_level {
            return (0, 0); // Max level reached
        }

        let current_level_threshold = Self::get_experience_threshold(
            experience.current_level, config,
        );
        let next_level_threshold = Self::get_experience_threshold(
            experience.current_level + 1, config,
        );

        let current_exp_in_level = experience.total_experience - current_level_threshold;
        let exp_needed_for_next = next_level_threshold - experience.total_experience;

        (current_exp_in_level, exp_needed_for_next)
    }
}

impl ExperienceInternalImpl of ExperienceTrait {
    fn calculate_level_factor(level: u32, config: ExperienceConfig) -> u64 {
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

            factor = factor * config.experience_multiplier / 100;
            i += 1;
        }
    }
}

#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use super::*;

    #[test]
    fn test_grant_experience() {
        let player = contract_address_const::<0x123>();
        let config = ExperienceConfig {
            id: 'config', base_experience: 100, experience_multiplier: 150, max_level: 100,
        };

        let experience = Experience {
            player: player,
            total_experience: 0,
            current_level: 1,
            experience_in_current_level: 0,
            last_updated: 0,
        };

        let updated_experience = ExperienceTrait::grant_experience(experience, player, 150, config);

        assert(updated_experience.total_experience == 150, 'total experience error');
        assert(updated_experience.current_level == 2, 'level error');
        assert(updated_experience.player == player, 'player error');
    }

    #[test]
    fn test_calculate_level_from_experience() {
        let config = ExperienceConfig {
            id: 'config', base_experience: 100, experience_multiplier: 150, max_level: 100,
        };

        let level = ExperienceTrait::calculate_level_from_experience(0, config);
        assert(level == 1, 'level 0 exp error');

        let level = ExperienceTrait::calculate_level_from_experience(100, config);
        assert(level == 2, 'level 100 exp error');
    }

    #[test]
    fn test_get_experience_threshold() {
        let config = ExperienceConfig {
            id: 'config', base_experience: 100, experience_multiplier: 150, max_level: 100,
        };

        let threshold = ExperienceTrait::get_experience_threshold(1, config);
        assert(threshold == 0, 'level 1 threshold error');

        let threshold = ExperienceTrait::get_experience_threshold(2, config);
        assert(threshold == 100, 'level 2 threshold error');
    }
}

