#[cfg(test)]
mod test {
    use starknet::ContractAddress;
    use aqua_stark::achievements::achievements::{Achievement, AchievementTrait};

    // pub enum Achievement {
    //     None,
    //     FirstFish,
    //     UnderwaterExplorer,
    //     SuccessfulBreeding,
    //     Collector,
    //     DecoratedAquarium,
    // }

    fn get_achievements() -> Array<Achievement> {
        array![
            Achievement::None,
            Achievement::FirstFish,
            Achievement::UnderwaterExplorer,
            Achievement::SuccessfulBreeding,
            Achievement::Collector,
            Achievement::DecoratedAquarium,
        ]
    }

    fn d(achievements: Array<Achievement>, pos: u32) -> Achievement {
        *achievements.at(pos)
    }

    #[test]
    fn test_achievement_identifiers() {
        let arr = get_achievements();
        assert!(arr.len() == 6, "Should have 6 achievements");
        assert_eq!(d(arr.clone(), 0).identifier(), 0, "None identifier should be 0");
        assert_eq!(d(arr.clone(), 1).identifier(), 'FirstFish', "FirstFish identifier mismatch");
        assert_eq!(
            d(arr.clone(), 2).identifier(),
            'UnderwaterExplorer',
            "UnderwaterExplorer identifier mismatch",
        );
        assert_eq!(
            d(arr.clone(), 3).identifier(),
            'SuccessfulBreeding',
            "SuccessfulBreeding identifier mismatch",
        );
        assert_eq!(d(arr.clone(), 4).identifier(), 'Collector', "Collector identifier mismatch");
        assert_eq!(
            d(arr.clone(), 5).identifier(),
            'DecoratedAquarium',
            "DecoratedAquarium identifier mismatch",
        );
    }

    #[test]
    fn test_achievement_points() {
        let arr = get_achievements();
        assert!(arr.len() == 6, "Should have 6 achievements");
        assert_eq!(d(arr.clone(), 0).points(), 0, "None points should be 0");
        assert_eq!(d(arr.clone(), 1).points(), 10, "FirstFish points mismatch");
        assert_eq!(d(arr.clone(), 2).points(), 15, "UnderwaterExplorer points mismatch");
        assert_eq!(d(arr.clone(), 3).points(), 25, "SuccessfulBreeding points mismatch");
        assert_eq!(d(arr.clone(), 4).points(), 35, "Collector points mismatch");
        assert_eq!(d(arr.clone(), 5).points(), 20, "DecoratedAquarium points mismatch");
    }

    #[test]
    fn test_achievement_visibility() {
        let arr = get_achievements();
        assert!(arr.len() == 6, "Should have 6 achievements");
        assert!(d(arr.clone(), 0).hidden(), "None should be hidden");
        assert!(!d(arr.clone(), 1).hidden(), "FirstFish should be visible");
        assert!(!d(arr.clone(), 2).hidden(), "UnderwaterExplorer should be visible");
        assert!(!d(arr.clone(), 3).hidden(), "SuccessfulBreeding should be visible");
        assert!(!d(arr.clone(), 4).hidden(), "Collector should be visible");
        assert!(!d(arr.clone(), 5).hidden(), "DecoratedAquarium should be visible");
    }

    #[test]
    fn test_achievement_grouping() {
        let arr = get_achievements();
        let group = 'Aqua Pioneer';
        assert!(arr.len() == 6, "Should have 6 achievements");
        assert_eq!(d(arr.clone(), 0).group(), 0, "None group should be 0");
        assert_eq!(d(arr.clone(), 1).group(), group, "FirstFish group mismatch");
        assert_eq!(d(arr.clone(), 2).group(), group, "UnderwaterExplorer group mismatch");
        assert_eq!(d(arr.clone(), 3).group(), group, "SuccessfulBreeding group mismatch");
        assert_eq!(d(arr.clone(), 4).group(), group, "Collector group mismatch");
        assert_eq!(d(arr.clone(), 5).group(), group, "DecoratedAquarium group mismatch");
    }

    #[test]
    fn test_achievenment_icons() {
        let arr = get_achievements();
        assert!(arr.len() == 6, "Should have 6 achievements");
        assert_eq!(d(arr.clone(), 0).icon(), '', "None icon should be empty");
        assert_eq!(d(arr.clone(), 1).icon(), 'fa-fish', "FirstFish icon mismatch");
        assert_eq!(d(arr.clone(), 2).icon(), 'fa-water', "UnderwaterExplorer icon mismatch");
        assert_eq!(d(arr.clone(), 3).icon(), 'fa-heart', "SuccessfulBreeding icon mismatch");
        assert_eq!(d(arr.clone(), 4).icon(), 'fa-trophy', "Collector icon mismatch");
        assert_eq!(d(arr.clone(), 5).icon(), 'fa-star', "DecoratedAquarium icon mismatch");
    }
}

