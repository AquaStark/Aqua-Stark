pub mod systems {
    pub mod AquaStark;
    pub mod Auctions;
    pub mod ShopCatalog;
    pub mod FishSystem;
    // pub mod experience;
    pub mod daily_challenge;
    pub mod Trade;
    pub mod session;
}

// pub mod aquarium;

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
    pub mod IFish;
    // pub mod IExperience;
    pub mod ITrade;
}

pub mod models {
    pub mod aquarium_model;
    pub mod auctions_model;
    pub mod daily_challange;
    pub mod decoration_model;
    pub mod fish_model;
    pub mod game_model;
    pub mod player_model;
    pub mod shop_model;
    pub mod trade_model;
    // pub mod experience_model;
    pub mod transaction_model;
    pub mod session;
}

#[cfg(test)]
pub mod tests {
    pub mod test_daily_challenge;
    pub mod utils;
    pub mod test_world;
    pub mod test_trading;
    pub mod test_auction;
    pub mod test_fish;
    // mod test_experience;
    mod test_aquarium;
    // mod simple_session_test;

}


pub mod utils;


pub mod helpers {
    pub mod session_validation;
}

