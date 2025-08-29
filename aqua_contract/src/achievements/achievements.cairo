// Dojo achievements import
use achievement::types::task::{Task, TaskTrait};

// Into trait import
use core::traits::Into;

// Achievement enum
#[derive(Copy, Drop)]
pub enum Achievement {
    None,
    FirstFish,
    UnderwaterExplorer,
    SuccessfulBreeding,
    Collector,
    DecoratedAquarium,
}

#[generate_trait]
pub impl AchievementImpl of AchievementTrait {
    #[inline]
    fn identifier(self: Achievement) -> felt252 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 'FirstFish', // Player receives their first fish
            Achievement::UnderwaterExplorer => 'UnderwaterExplorer', // Player participates in first event
            Achievement::SuccessfulBreeding => 'SuccessfulBreeding', // Player completes breeding
            Achievement::Collector => 'Collector', // Player owns 10 unique fish
            Achievement::DecoratedAquarium => 'DecoratedAquarium' // Player places 3+ decorations
        }
    }

    #[inline]
    fn hidden(self: Achievement) -> bool {
        match self {
            Achievement::None => true,
            Achievement::FirstFish => false,
            Achievement::UnderwaterExplorer => false,
            Achievement::SuccessfulBreeding => false,
            Achievement::Collector => false,
            Achievement::DecoratedAquarium => false,
        }
    }

    #[inline]
    fn index(self: Achievement) -> u8 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 0,
            Achievement::UnderwaterExplorer => 1,
            Achievement::SuccessfulBreeding => 2,
            Achievement::Collector => 3,
            Achievement::DecoratedAquarium => 4,
        }
    }

    #[inline]
    fn points(self: Achievement) -> u16 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 10,
            Achievement::UnderwaterExplorer => 15,
            Achievement::SuccessfulBreeding => 25,
            Achievement::Collector => 35,
            Achievement::DecoratedAquarium => 20,
        }
    }

    #[inline]
    fn start(self: Achievement) -> u64 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 0,
            Achievement::UnderwaterExplorer => 0,
            Achievement::SuccessfulBreeding => 0,
            Achievement::Collector => 0,
            Achievement::DecoratedAquarium => 0,
        }
    }

    #[inline]
    fn end(self: Achievement) -> u64 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 0,
            Achievement::UnderwaterExplorer => 0,
            Achievement::SuccessfulBreeding => 0,
            Achievement::Collector => 0,
            Achievement::DecoratedAquarium => 0,
        }
    }

    #[inline]
    fn group(self: Achievement) -> felt252 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 'Aqua Pioneer',
            Achievement::UnderwaterExplorer => 'Aqua Pioneer',
            Achievement::SuccessfulBreeding => 'Aqua Pioneer',
            Achievement::Collector => 'Aqua Pioneer',
            Achievement::DecoratedAquarium => 'Aqua Pioneer',
        }
    }

    #[inline]
    fn icon(self: Achievement) -> felt252 {
        match self {
            Achievement::None => '',
            Achievement::FirstFish => 'fa-fish',
            Achievement::UnderwaterExplorer => 'fa-water',
            Achievement::SuccessfulBreeding => 'fa-heart',
            Achievement::Collector => 'fa-trophy',
            Achievement::DecoratedAquarium => 'fa-star',
        }
    }

    #[inline]
    fn title(self: Achievement) -> felt252 {
        match self {
            Achievement::None => '',
            Achievement::FirstFish => 'First Fish',
            Achievement::UnderwaterExplorer => 'Underwater Explorer',
            Achievement::SuccessfulBreeding => 'Successful Breeding',
            Achievement::Collector => 'Collector',
            Achievement::DecoratedAquarium => 'Decorated Aquarium',
        }
    }

    #[inline]
    fn description(self: Achievement) -> ByteArray {
        match self {
            Achievement::None => "",
            Achievement::FirstFish => "You obtained your first fish NFT!",
            Achievement::UnderwaterExplorer => "You visited your first aquarium event",
            Achievement::SuccessfulBreeding => "You bred a new fish",
            Achievement::Collector => "You own at least 10 unique fish",
            Achievement::DecoratedAquarium => "You placed at least 3 decorations",
        }
    }

    #[inline]
    fn tasks(self: Achievement) -> Span<Task> {
        match self {
            Achievement::None => [].span(),
            Achievement::FirstFish => array![
                TaskTrait::new('FirstFish', 1, "Obtain your first fish NFT"),
            ]
                .span(),
            Achievement::UnderwaterExplorer => array![
                TaskTrait::new('UnderwaterExplorer', 1, "Participate in your first aquarium event"),
            ]
                .span(),
            Achievement::SuccessfulBreeding => array![
                TaskTrait::new('SuccessfulBreeding', 1, "Complete a breeding action"),
            ]
                .span(),
            Achievement::Collector => array![
                TaskTrait::new('Collector', 10, "Own 10 different fish NFTs"),
            ]
                .span(),
            Achievement::DecoratedAquarium => array![
                TaskTrait::new(
                    'DecoratedAquarium', 3, "Place 3 or more decorations in your aquarium",
                ),
            ]
                .span(),
        }
    }

    #[inline]
    fn data(self: Achievement) -> ByteArray {
        ""
    }
}

pub impl IntoAchievementU8 of Into<Achievement, u8> {
    #[inline]
    fn into(self: Achievement) -> u8 {
        match self {
            Achievement::None => 0,
            Achievement::FirstFish => 1,
            Achievement::UnderwaterExplorer => 2,
            Achievement::SuccessfulBreeding => 3,
            Achievement::Collector => 4,
            Achievement::DecoratedAquarium => 5,
        }
    }
}

pub impl IntoU8Achievement of Into<u8, Achievement> {
    #[inline]
    fn into(self: u8) -> Achievement {
        match self {
            0 => Achievement::None,
            1 => Achievement::FirstFish,
            2 => Achievement::UnderwaterExplorer,
            3 => Achievement::SuccessfulBreeding,
            4 => Achievement::Collector,
            5 => Achievement::DecoratedAquarium,
            // Default case
            _ => Achievement::None,
        }
    }
}
