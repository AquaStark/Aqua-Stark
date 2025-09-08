#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
pub enum Rarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
}

pub impl RarityIntoFelt252 of Into<Rarity, felt252> {
    fn into(self: Rarity) -> felt252 {
        match self {
            Rarity::Common => 0,
            Rarity::Uncommon => 1,
            Rarity::Rare => 2,
            Rarity::Epic => 3,
            Rarity::Legendary => 4,
        }
    }
}


#[cfg(test)]
mod tests {
    use super::{Rarity, RarityIntoFelt252};

    #[test]
    fn test_achievement_rarity_into_felt252() {
        let common = Rarity::Common;
        let uncommon = Rarity::Uncommon;
        let rare = Rarity::Rare;
        let epic = Rarity::Epic;
        let legendary = Rarity::Legendary;

        assert_eq!(common.into(), 0, "Common deberia convertirse a 0");
        assert_eq!(uncommon.into(), 1, "Uncommon deberia convertirse a 1");
        assert_eq!(rare.into(), 2, "Rare deberia convertirse a 2");
        assert_eq!(epic.into(), 3, "Epic deberia convertirse a 3");
        assert_eq!(legendary.into(), 4, "Legendary deberia convertirse a 4");
    }
}
