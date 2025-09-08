#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
pub enum Reward {
    Shells,
    Pearls,
    FishEgg,
    Decoration,
    AquariumExpansion,
    RareFish,
    Experience,
}

pub impl RewardIntoFelt252 of Into<Reward, felt252> {
    fn into(self: Reward) -> felt252 {
        match self {
            Reward::Shells => 0,
            Reward::Pearls => 1,
            Reward::FishEgg => 2,
            Reward::Decoration => 3,
            Reward::AquariumExpansion => 4,
            Reward::RareFish => 5,
            Reward::Experience => 6,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Reward, RewardIntoFelt252};

    #[test]
    fn test_mission_reward_into_felt252() {
        let shells = Reward::Shells;
        let pearls = Reward::Pearls;
        let fish_egg = Reward::FishEgg;
        let decoration = Reward::Decoration;
        let aquarium_expansion = Reward::AquariumExpansion;
        let rare_fish = Reward::RareFish;
        let experience = Reward::Experience;

        assert_eq!(shells.into(), 0, "Shells should convert to 0");
        assert_eq!(pearls.into(), 1, "Pearls should convert to 1");
        assert_eq!(fish_egg.into(), 2, "FishEgg should convert to 2");
        assert_eq!(decoration.into(), 3, "Decoration should convert to 3");
        assert_eq!(aquarium_expansion.into(), 4, "AquariumExpansion should convert to 4");
        assert_eq!(rare_fish.into(), 5, "RareFish should convert to 5");
        assert_eq!(experience.into(), 6, "Experience should convert to 6");
    }
}
