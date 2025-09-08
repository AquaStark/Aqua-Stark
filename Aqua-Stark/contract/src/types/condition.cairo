#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
pub enum Condition {
    CatchFish,
    BreedFish,
    EvolveFish,
    DecorateAquarium,
    WinTournament,
    CompleteCollection,
    MaintainHappiness,
}

pub impl ConditionIntoFelt252 of Into<Condition, felt252> {
    fn into(self: Condition) -> felt252 {
        match self {
            Condition::CatchFish => 0,
            Condition::BreedFish => 1,
            Condition::EvolveFish => 2,
            Condition::DecorateAquarium => 3,
            Condition::WinTournament => 4,
            Condition::CompleteCollection => 5,
            Condition::MaintainHappiness => 6,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Condition, ConditionIntoFelt252};

    #[test]
    fn test_mission_condition_into_felt252() {
        let catch_fish = Condition::CatchFish;
        let breed_fish = Condition::BreedFish;
        let evolve_fish = Condition::EvolveFish;
        let decorate_aquarium = Condition::DecorateAquarium;
        let win_tournament = Condition::WinTournament;
        let complete_collection = Condition::CompleteCollection;
        let maintain_happiness = Condition::MaintainHappiness;

        assert_eq!(catch_fish.into(), 0, "CatchFish should convert to 0");
        assert_eq!(breed_fish.into(), 1, "BreedFish should convert to 1");
        assert_eq!(evolve_fish.into(), 2, "EvolveFish should convert to 2");
        assert_eq!(decorate_aquarium.into(), 3, "DecorateAquarium should convert to 3");
        assert_eq!(win_tournament.into(), 4, "WinTournament should convert to 4");
        assert_eq!(complete_collection.into(), 5, "CompleteCollection should convert to 5");
        assert_eq!(maintain_happiness.into(), 6, "MaintainHappiness should convert to 6");
    }
}
