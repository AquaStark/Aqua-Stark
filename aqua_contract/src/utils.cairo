use aqua_stark::models::daily_challange::DailyChallengeType;
use aqua_stark::models::fish_model::Pattern;
use aqua_stark::models::trade_model::{MatchCriteria, TradeOfferStatus};
use core::traits::Into;


// Pattern <-> u8
pub impl IntoPatternU8 of Into<Pattern, u8> {
    fn into(self: Pattern) -> u8 {
        match self {
            Pattern::Plain => 0,
            Pattern::Spotted => 1,
            Pattern::Stripes => 2,
        }
    }
}

pub impl IntoU8Pattern of Into<u8, Pattern> {
    fn into(self: u8) -> Pattern {
        match self {
            0 => Pattern::Plain,
            1 => Pattern::Spotted,
            2 => Pattern::Stripes,
            _ => Pattern::Plain,
        }
    }
}

// Pattern <-> felt252
pub impl IntoPatternFelt of Into<Pattern, felt252> {
    fn into(self: Pattern) -> felt252 {
        let v: u8 = self.into();
        v.into()
    }
}

pub impl IntoFeltPattern of Into<felt252, Pattern> {
    fn into(self: felt252) -> Pattern {
        match self {
            0 => Pattern::Plain,
            1 => Pattern::Spotted,
            2 => Pattern::Stripes,
            _ => Pattern::Plain,
        }
    }
}

// TradeOfferStatus <-> u8
pub impl IntoTradeOfferStatusU8 of Into<TradeOfferStatus, u8> {
    fn into(self: TradeOfferStatus) -> u8 {
        match self {
            TradeOfferStatus::Active => 0,
            TradeOfferStatus::Completed => 1,
            TradeOfferStatus::Cancelled => 2,
            TradeOfferStatus::Expired => 3,
        }
    }
}

pub impl IntoU8TradeOfferStatus of Into<u8, TradeOfferStatus> {
    fn into(self: u8) -> TradeOfferStatus {
        match self {
            0 => TradeOfferStatus::Active,
            1 => TradeOfferStatus::Completed,
            2 => TradeOfferStatus::Cancelled,
            3 => TradeOfferStatus::Expired,
            _ => TradeOfferStatus::Active,
        }
    }
}

// TradeOfferStatus <-> felt252
pub impl IntoTradeOfferStatusFelt of Into<TradeOfferStatus, felt252> {
    fn into(self: TradeOfferStatus) -> felt252 {
        let v: u8 = self.into();
        v.into()
    }
}

pub impl IntoFeltTradeOfferStatus of Into<felt252, TradeOfferStatus> {
    fn into(self: felt252) -> TradeOfferStatus {
        match self {
            0 => TradeOfferStatus::Active,
            1 => TradeOfferStatus::Completed,
            2 => TradeOfferStatus::Cancelled,
            3 => TradeOfferStatus::Expired,
            _ => TradeOfferStatus::Active,
        }
    }
}

// MatchCriteria <-> u8
pub impl IntoMatchCriteriaU8 of Into<MatchCriteria, u8> {
    fn into(self: MatchCriteria) -> u8 {
        match self {
            MatchCriteria::ExactId => 0,
            MatchCriteria::Species => 1,
            MatchCriteria::SpeciesAndGen => 2,
            MatchCriteria::Traits => 3,
        }
    }
}

pub impl IntoU8MatchCriteria of Into<u8, MatchCriteria> {
    fn into(self: u8) -> MatchCriteria {
        match self {
            0 => MatchCriteria::ExactId,
            1 => MatchCriteria::Species,
            2 => MatchCriteria::SpeciesAndGen,
            3 => MatchCriteria::Traits,
            _ => MatchCriteria::ExactId,
        }
    }
}

// MatchCriteria <-> felt252
pub impl IntoMatchCriteriaFelt of Into<MatchCriteria, felt252> {
    fn into(self: MatchCriteria) -> felt252 {
        let v: u8 = self.into();
        v.into()
    }
}

pub impl IntoFeltMatchCriteria of Into<felt252, MatchCriteria> {
    fn into(self: felt252) -> MatchCriteria {
        match self {
            0 => MatchCriteria::ExactId,
            1 => MatchCriteria::Species,
            2 => MatchCriteria::SpeciesAndGen,
            3 => MatchCriteria::Traits,
            _ => MatchCriteria::ExactId,
        }
    }
}

// DailyChallengeType reverse: felt252 -> enum (forward enum->felt already exists in model)
pub impl IntoFeltDailyChallengeType of Into<felt252, DailyChallengeType> {
    fn into(self: felt252) -> DailyChallengeType {
        if self == 1 {
            return DailyChallengeType::BreedTarget;
        }
        if self == 2 {
            return DailyChallengeType::FishCountGoal;
        }
        if self == 3 {
            return DailyChallengeType::DecorationMaster;
        }
        if self == 4 {
            return DailyChallengeType::SurvivalStreak;
        }
        if self == 5 {
            return DailyChallengeType::HealthAbove;
        }
        if self == 6 {
            return DailyChallengeType::NoDeaths;
        }
        if self == 7 {
            return DailyChallengeType::RareDecorations;
        }
        DailyChallengeType::BreedTarget
    }
}

