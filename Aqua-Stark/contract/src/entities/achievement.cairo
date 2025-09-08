use aqua_stark::types::rarity::{Rarity, RarityIntoFelt252};
use aqua_stark::types::types::{Types, TypesIntoFelt252};
use core::array::ArrayTrait;
use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Achievement {
    #[key]
    pub achievement_id: u64, // Unique ID for the achievement
    pub achievement_type: Types, // Type of achievement (e.g., FirstWin, TenWins)
    pub rarity: Rarity, // Rarity of the achievement
    pub name: felt252, // Name of the achievement
    pub description: ByteArray, // Detailed description of the achievement
    pub is_hidden: bool, // Whether the achievement is hidden by default
    pub is_unlocked: bool // Whether the achievement has been unlocked by the player
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct AchievementProgress {
    #[key]
    pub player_id: ContractAddress, // Player ContractAddress
    pub achievement_id: u64, // Achievement ID
    pub progress: u32, // Progress to unlock achievement
    pub is_unlocked: bool // If achievement is unlock or not
}

#[generate_trait]
pub impl AchievementImpl of AchievementTrait {
    fn check_unlock_condition(self: @Achievement, progress: u32) -> bool {
        match self.achievement_type {
            Types::FirstWin => progress >= 1,
            Types::TenWins => progress >= 10,
            Types::HundredWins => progress >= 100,
            Types::FirstBeast => progress >= 1,
            Types::TenBeasts => progress >= 10,
            Types::RareBeast => progress >= 1,
            Types::FirstNPCInteraction => progress >= 1,
            Types::RandomBattleChampion => progress >= 3,
            Types::BeastMaster => progress >= 5,
            Types::LegendaryPlayer => progress >= 50,
            Types::TopScorer => progress >= 100,
        }
    }

    fn unlock(ref self: Achievement, ref progress: AchievementProgress) -> bool {
        if !progress.is_unlocked && self.check_unlock_condition(progress.progress) {
            progress.is_unlocked = true;
            self.is_unlocked = true;
            true
        } else {
            false
        }
    }
}


fn initialize_default_achievements() -> Array<Achievement> {
    let mut achievements = ArrayTrait::new();

    achievements
        .append(
            Achievement {
                achievement_id: 1,
                achievement_type: Types::FirstWin,
                rarity: Rarity::Common,
                name: 'First Victory',
                description: "Win your first battle",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 2,
                achievement_type: Types::TenWins,
                rarity: Rarity::Uncommon,
                name: 'Battle Veteran',
                description: "Win 10 battles",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 3,
                achievement_type: Types::HundredWins,
                rarity: Rarity::Rare,
                name: 'Centurion',
                description: "Win 100 battles",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 4,
                achievement_type: Types::FirstBeast,
                rarity: Rarity::Common,
                name: 'Beast Tamer',
                description: "Capture your first beast",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 5,
                achievement_type: Types::TenBeasts,
                rarity: Rarity::Uncommon,
                name: 'Beast Collector',
                description: "Capture 10 different beasts",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 6,
                achievement_type: Types::RareBeast,
                rarity: Rarity::Rare,
                name: 'Rare Find',
                description: "Capture a rare beast",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 7,
                achievement_type: Types::FirstNPCInteraction,
                rarity: Rarity::Common,
                name: 'Social Butterfly',
                description: "Interact with your first NPC",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 8,
                achievement_type: Types::RandomBattleChampion,
                rarity: Rarity::Uncommon,
                name: 'Lucky Victor',
                description: "Win 3 random encounters in a row",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 9,
                achievement_type: Types::BeastMaster,
                rarity: Rarity::Epic,
                name: 'Beast Master',
                description: "Fully evolve 5 different beasts",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 10,
                achievement_type: Types::LegendaryPlayer,
                rarity: Rarity::Legendary,
                name: 'Living Legend',
                description: "Complete all main story quests",
                is_hidden: true,
                is_unlocked: false,
            },
        );

    achievements
        .append(
            Achievement {
                achievement_id: 11,
                achievement_type: Types::TopScorer,
                rarity: Rarity::Epic,
                name: 'High Scorer',
                description: "Achieve a total score of 100,000 points",
                is_hidden: false,
                is_unlocked: false,
            },
        );

    achievements
}


fn initialize_player_achievement_progress(address: ContractAddress) -> Array<AchievementProgress> {
    let default_achievements = initialize_default_achievements();
    let mut player_progress = ArrayTrait::new();

    let mut i = 0;
    loop {
        if i == default_achievements.len() {
            break;
        }
        let achievement = default_achievements.at(i);
        player_progress
            .append(
                AchievementProgress {
                    player_id: address,
                    achievement_id: *achievement.achievement_id,
                    progress: 0,
                    is_unlocked: false,
                },
            );
        i += 1;
    }

    player_progress
}


fn update_achievement_progress(
    ref achievement: Achievement, ref progress: AchievementProgress, increment: u32,
) -> felt252 {
    if progress.is_unlocked {
        // If it is unlocked, just update the progress
        progress.progress += increment;
        return 'Progress updated';
    }

    // If it is not unlocked, just update the progress and verify if it should be unlock
    progress.progress += increment;
    if achievement.check_unlock_condition(progress.progress) {
        progress.is_unlocked = true;
        achievement.is_unlocked = true;
        'Achievement unlocked!'
    } else {
        'Progress updated'
    }
}


fn get_unlocked_achievements(player_progress: Array<AchievementProgress>) -> Array<u64> {
    let mut unlocked = ArrayTrait::new();
    let mut i = 0;
    loop {
        if i == player_progress.len() {
            break;
        }
        let progress = player_progress.at(i);
        if *progress.is_unlocked {
            unlocked.append(*progress.achievement_id);
        }
        i += 1;
    }
    unlocked
}


#[cfg(test)]
mod tests {
    use core::array::ArrayTrait;
    use starknet::{ContractAddress, contract_address_const};
    use super::{
        Achievement, AchievementImpl, AchievementProgress, Rarity, Types, get_unlocked_achievements,
        initialize_default_achievements, initialize_player_achievement_progress,
        update_achievement_progress,
    };

    #[test]
    fn test_initialize_default_achievements() {
        let achievements = initialize_default_achievements();

        // Verify all achievements are created
        assert(achievements.len() == 11, 'Should have 11 achievements');

        // Verify first achievement
        let first_achievement = achievements.at(0);
        assert(*first_achievement.achievement_id == 1, 'First achievement ID should be');
        assert(*first_achievement.name == 'First Victory', 'First achievement name mismatch');
        assert(
            *first_achievement.achievement_type == Types::FirstWin,
            'First achievement type mismatch',
        );
        assert(*first_achievement.rarity == Rarity::Common, 'Achievement rarity mismatch');
        assert(!*first_achievement.is_hidden, 'This should not be hidden');
        assert(!*first_achievement.is_unlocked, 'This should not be unlocked');

        // Verify last achievement
        let last_achievement = achievements.at(10);
        assert(*last_achievement.achievement_id == 11, 'Achievement ID should be 11');
        assert(*last_achievement.name == 'High Scorer', 'Last achievement name mismatch');
        assert(
            *last_achievement.achievement_type == Types::TopScorer,
            'Last achievement type mismatch',
        );
    }


    #[test]
    fn test_initialize_player_achievement_progress() {
        let mut address: ContractAddress = contract_address_const::<0x123>();
        let progress = initialize_player_achievement_progress(address);

        assert(progress.len() == 11, 'Should have 11 progress entries');

        let first_progress = progress.at(0);
        assert(*first_progress.player_id == address, 'Player ContractAddress mismatch');
        assert(*first_progress.achievement_id == 1, 'Achievement ID should be 1');
        assert(*first_progress.progress == 0, 'Initial progress should be 0');
        assert(!*first_progress.is_unlocked, 'Should not be unlocked');
    }


    #[test]
    fn test_get_unlocked_achievements() {
        let mut progress_array = ArrayTrait::new();
        let mut address: ContractAddress = contract_address_const::<0x123>();

        progress_array
            .append(
                AchievementProgress {
                    player_id: address, achievement_id: 1, progress: 1, is_unlocked: true,
                },
            );
        progress_array
            .append(
                AchievementProgress {
                    player_id: address, achievement_id: 2, progress: 5, is_unlocked: false,
                },
            );
        progress_array
            .append(
                AchievementProgress {
                    player_id: address, achievement_id: 3, progress: 10, is_unlocked: true,
                },
            );

        let unlocked = get_unlocked_achievements(progress_array);
        assert(unlocked.len() == 2, 'Have 2 unlocked achievements');
        assert(*unlocked.at(0) == 1, 'First unlocked should be ID 1');
        assert(*unlocked.at(1) == 3, 'Second unlocked should be ID 3');
    }


    #[test]
    fn test_update_achievement_progress() {
        let mut address: ContractAddress = contract_address_const::<0x123>();

        let mut achievement = Achievement {
            achievement_id: 1,
            achievement_type: Types::FirstWin,
            rarity: Rarity::Common,
            name: 'First Victory',
            description: "Win your first battle",
            is_hidden: false,
            is_unlocked: false,
        };

        let mut progress = AchievementProgress {
            player_id: address, achievement_id: 1, progress: 0, is_unlocked: false,
        };

        let result = update_achievement_progress(ref achievement, ref progress, 1);
        assert(result == 'Achievement unlocked!', 'Should unlock achievement');
        assert(progress.is_unlocked, 'Progress should be unlocked');
        assert(achievement.is_unlocked, 'Achievement should be unlocked');
        assert(progress.progress == 1, 'Progress should be 1');

        let result2 = update_achievement_progress(ref achievement, ref progress, 1);
        assert(result2 == 'Progress updated', 'Should only update progress');
        assert(progress.progress == 2, 'Progress should be 2');
        assert(progress.is_unlocked, 'Progress should be unlocked');
        assert(achievement.is_unlocked, 'Achievement should be unlocked');
    }
}
