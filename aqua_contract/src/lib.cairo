pub mod systems {
    pub mod AquaStark;
    pub mod daily_challenge;
    pub mod Auctions;
    pub mod ShopCatalog;
    pub mod experience;
}

pub mod achievements {
    pub mod achievements;
}
pub mod base {
    pub mod events;
}

// pub mod contracts {
//     pub mod auctions;
// }

pub mod interfaces {
    pub mod IAquaStark;
    pub mod IShopCatalog;
    pub mod ITransactionHistory;
    pub mod IExperience;
}

pub mod models {
    pub mod aquarium_model;
    pub mod decoration_model;
    pub mod fish_model;
    pub mod game_model;
    pub mod player_model;
    pub mod shop_model;
    pub mod transaction_model;
    pub mod auctions_model;
    pub mod trade_model;
    pub mod daily_challange;
    pub mod experience_model;
}
pub mod tests {
    mod test_daily_challenge;
    mod test_world;
    mod test_trading;
    mod test_auction;
    mod test_experience;
}

