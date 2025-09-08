#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
pub enum Types {
    FirstWin,
    TenWins,
    HundredWins,
    FirstBeast,
    TenBeasts,
    RareBeast,
    FirstNPCInteraction,
    RandomBattleChampion,
    BeastMaster,
    LegendaryPlayer,
    TopScorer,
}

pub impl TypesIntoFelt252 of Into<Types, felt252> {
    fn into(self: Types) -> felt252 {
        match self {
            Types::FirstWin => 0,
            Types::TenWins => 1,
            Types::HundredWins => 2,
            Types::FirstBeast => 3,
            Types::TenBeasts => 4,
            Types::RareBeast => 5,
            Types::FirstNPCInteraction => 6,
            Types::RandomBattleChampion => 7,
            Types::BeastMaster => 8,
            Types::LegendaryPlayer => 9,
            Types::TopScorer => 10,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Types, TypesIntoFelt252};

    #[test]
    fn test_achievement_type_into_felt252() {
        let first_win = Types::FirstWin;
        let ten_wins = Types::TenWins;
        let hundred_wins = Types::HundredWins;
        let first_beast = Types::FirstBeast;
        let ten_beast = Types::TenBeasts;
        let rare_beast = Types::RareBeast;
        let first_npc_interaction = Types::FirstNPCInteraction;
        let random_battle = Types::RandomBattleChampion;
        let beast_master = Types::BeastMaster;
        let legendary_player = Types::LegendaryPlayer;
        let top_scorer = Types::TopScorer;

        assert_eq!(first_win.into(), 0, "FirstWin deberia convertirse a 0");
        assert_eq!(ten_wins.into(), 1, "TenWins deberia convertirse a 1");
        assert_eq!(hundred_wins.into(), 2, "HundredWins deberia convertirse a 2");
        assert_eq!(first_beast.into(), 3, "FirstBeast deberia convertirse a 3");
        assert_eq!(ten_beast.into(), 4, "TenBeasts deberia convertirse a 4");
        assert_eq!(rare_beast.into(), 5, "RareBeast deberia convertirse a 5");
        assert_eq!(first_npc_interaction.into(), 6, "FirstNPCInteraction deberia convertirse a 6");
        assert_eq!(random_battle.into(), 7, "RandomBattleChampion deberia convertirse a 7");
        assert_eq!(beast_master.into(), 8, "BeastMaster deberia convertirse a 8");
        assert_eq!(legendary_player.into(), 9, "LegendaryPlayer deberia convertirse a 9");
        assert_eq!(top_scorer.into(), 10, "TopScorer deberia convertirse a 10");
    }
}
