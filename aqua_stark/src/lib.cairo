pub mod systems {
    pub mod AquaStark;
    pub mod Auctions;
    pub mod FishSystem;
    pub mod ShopCatalog;
    pub mod Trade;
    pub mod daily_challenge;
    pub mod game;
    pub mod session;
    pub mod transaction;
}


pub mod base {
    pub mod events;
    pub mod game_events;
}

// pub mod contracts {
//     pub mod auctions;
// }

pub mod interfaces {
    pub mod IAquaStark;
    // pub mod IExperience;
    pub mod IFishSystem;
    pub mod IGame;
    pub mod IShopCatalog;
    pub mod ITrade;
    pub mod ITransaction;
    pub mod ITransactionHistory;
}

pub mod models {
    pub mod aquarium_model;
    pub mod auctions_model;
    pub mod daily_challange;
    pub mod decoration_model;
    pub mod fish_model;
    pub mod game_model;
    pub mod player_model;
    pub mod session;
    pub mod shop_model;
    pub mod trade_model;
    // pub mod experience_model;
    pub mod transaction_model;
}
pub mod tests {
    // mod test_experience;
    mod test_aquarium;
    mod test_auction;
    mod test_daily_challenge;
    mod test_fish_system;
    mod test_game;
    mod test_trading;
    // mod test_world;
// mod simple_session_test;

}


pub mod utils;


pub mod helpers {
    pub mod session_validation;
}

