use core::traits::Into;
use starknet::ContractAddress;

////////////////////////////////////////
///   MODELS
///////////////////////////////////////
#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct Challenge_Counter {
    #[key]
    pub id: felt252,
    pub counter: u64,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo::model]
pub struct DailyChallenge {
    #[key]
    pub challenge_id: u64,
    pub challenge_type: felt252,
    pub param1: felt252,
    pub param2: felt252,
    pub value1: u64,
    pub value2: u64,
    pub difficulty: u8,
    pub active: bool,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo::model]
pub struct ChallengeParticipation {
    #[key]
    pub challenge_id: u64,
    #[key]
    pub participant: ContractAddress,
    pub joined: bool,
    pub completed: bool,
    pub reward_claimed: bool,
}

////////////// Events//////////////////////

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ChallengeCreated {
    #[key]
    pub challenge_id: u64,
    pub challenge_type: felt252,
    pub param1: felt252,
    pub param2: felt252,
    pub value1: u64,
    pub value2: u64,
    pub difficulty: u8,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ChallengeCompleted {
    #[key]
    pub challenge_id: u64,
    pub participant: ContractAddress,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct RewardClaimed {
    #[key]
    pub challenge_id: u64,
    #[key]
    pub participant: ContractAddress,
    pub reward_amount: u256,
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct ParticipantJoined {
    #[key]
    pub challenge_id: u64,
    pub participant: ContractAddress,
}

///////////////////////////////////////////

#[derive(Copy, Drop, Serde, Debug)]
pub enum DailyChallengeType {
    BreedTarget, // Breed X fish of species
    FishCountGoal, // Have Y fish in aquarium
    DecorationMaster, // Place Z rare decorations
    SurvivalStreak, // Days without fish deaths
    HealthAbove, // Keep avg health above %
    NoDeaths, // Keep all fish alive
    RareDecorations // Place X rare items
}

impl DailyChallengeTypeImpl of Into<DailyChallengeType, felt252> {
    fn into(self: DailyChallengeType) -> felt252 {
        match self {
            DailyChallengeType::BreedTarget => 1,
            DailyChallengeType::FishCountGoal => 2,
            DailyChallengeType::DecorationMaster => 3,
            DailyChallengeType::SurvivalStreak => 4,
            DailyChallengeType::HealthAbove => 5,
            DailyChallengeType::NoDeaths => 6,
            DailyChallengeType::RareDecorations => 7,
        }
    }
}

pub trait DailyChallengeTrait {
    fn generate_sunday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_monday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_tuesday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_wednesday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_thursday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_friday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
    fn generate_saturday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8);
}

pub impl DailyChallengeImpl of DailyChallengeTrait {
    fn generate_sunday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::BreedTarget.into();
        let species_selector = seed % 3;
        let species = match species_selector {
            0 => 'GoldFish'.into(),
            1 => 'Betta'.into(),
            _ => 'Guppy'.into(),
        };
        let target_count = 5 + (seed % 5); // breed 5-9
        let difficulty = 3;
        (challenge_type, species, 0.into(), target_count, 0, difficulty)
    }

    fn generate_monday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::FishCountGoal.into();
        let min_fish = 10 + (seed % 5); // 10-14
        let difficulty = 2;
        (challenge_type, min_fish.into(), 0.into(), min_fish, 0, difficulty)
    }

    fn generate_tuesday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::DecorationMaster.into();
        let rare_needed = 3 + (seed % 4); // 3-6
        let rarity = 'Rare'.into();
        let difficulty = 3;
        (challenge_type, rarity, 0.into(), rare_needed, 0, difficulty)
    }

    fn generate_wednesday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::SurvivalStreak.into();
        let days = 2 + (seed % 3); // 2-4 days no deaths
        let difficulty = 4;
        (challenge_type, days.into(), 0.into(), days, 0, difficulty)
    }

    fn generate_thursday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::HealthAbove.into();
        let min_health = 80 + (seed % 10); // 80%-89%
        let difficulty = 3;
        (challenge_type, min_health.into(), 0.into(), 0, min_health, difficulty)
    }

    fn generate_friday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::NoDeaths.into();
        let duration = 1 + (seed % 2); // day(s)
        let difficulty = 5;
        (challenge_type, duration.into(), 0.into(), duration, 0, difficulty)
    }

    fn generate_saturday_challenge(seed: u64) -> (felt252, felt252, felt252, u64, u64, u8) {
        let challenge_type = DailyChallengeType::RareDecorations.into();
        let count = 4 + (seed % 3); // 4-6
        let difficulty = 4;
        (challenge_type, count.into(), 0.into(), count, 0, difficulty)
    }
}

#[cfg(test)]
mod tests {
    use super::{*, DailyChallengeTrait};

    #[test]
    fn test_sunday_challenge() {
        let (ctype, species, _, count, _, diff) = DailyChallengeTrait::generate_sunday_challenge(5);
        assert(ctype == DailyChallengeType::BreedTarget.into(), 'Sunday type');
        assert(count >= 5 && count <= 9, 'Sunday count');
        assert(diff == 3, 'Sunday diff');
    }

    #[test]
    fn test_monday_challenge() {
        let (ctype, min_fish, _, count, _, diff) = DailyChallengeTrait::generate_monday_challenge(
            7,
        );
        let mf: u64 = min_fish.try_into().unwrap();
        assert(ctype == DailyChallengeType::FishCountGoal.into(), 'Monday type');
        assert(mf >= 10 && mf <= 14, 'Monday fish');
        assert(count == mf, 'Monday count match');
        assert(diff == 2, 'Monday diff');
    }

    #[test]
    fn test_tuesday_challenge() {
        let (ctype, rarity, _, rare_needed, _, diff) =
            DailyChallengeTrait::generate_tuesday_challenge(
            3,
        );
        assert(ctype == DailyChallengeType::DecorationMaster.into(), 'Tuesday type');
        assert(rare_needed >= 3 && rare_needed <= 6, 'Tuesday rare count');
        assert(diff == 3, 'Tuesday diff');
    }

    #[test]
    fn test_wednesday_challenge() {
        let (ctype, days, _, day_target, _, diff) =
            DailyChallengeTrait::generate_wednesday_challenge(
            1,
        );
        let d: u64 = days.try_into().unwrap();
        assert(ctype == DailyChallengeType::SurvivalStreak.into(), 'Wednesday type');
        assert(d >= 2 && d <= 4, 'Wednesday days');
        assert(day_target == d, 'Wednesday day match');
        assert(diff == 4, 'Wednesday diff');
    }

    #[test]
    fn test_thursday_challenge() {
        let (ctype, min_health, _, _, health, diff) =
            DailyChallengeTrait::generate_thursday_challenge(
            9,
        );
        let mh: u64 = min_health.try_into().unwrap();
        assert(ctype == DailyChallengeType::HealthAbove.into(), 'Thursday type');
        assert(mh >= 80 && mh <= 89, 'Thursday health');
        assert(health == mh, 'Thursday health match');
        assert(diff == 3, 'Thursday diff');
    }

    #[test]
    fn test_friday_challenge() {
        let (ctype, duration, _, dur_count, _, diff) =
            DailyChallengeTrait::generate_friday_challenge(
            4,
        );
        let dur: u64 = duration.try_into().unwrap();
        assert(ctype == DailyChallengeType::NoDeaths.into(), 'Friday type');
        assert(dur >= 1 && dur <= 2, 'Friday duration');
        assert(dur_count == dur, 'Friday duration match');
        assert(diff == 5, 'Friday diff');
    }

    #[test]
    fn test_saturday_challenge() {
        let (ctype, count, _, c_count, _, diff) = DailyChallengeTrait::generate_saturday_challenge(
            11,
        );
        let co: u64 = count.try_into().unwrap();
        assert(ctype == DailyChallengeType::RareDecorations.into(), 'Saturday type');
        assert(co >= 4 && co <= 6, 'Saturday count');
        assert(c_count == co, 'Saturday count match');
        assert(diff == 4, 'Saturday diff');
    }
}
