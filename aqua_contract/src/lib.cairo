pub mod systems {
    pub mod AquaStark;
    pub mod Auctions;
    pub mod ShopCatalog;
    // pub mod experience;
    pub mod daily_challenge;
    pub mod Trade;
    pub mod session;
}

pub mod inventory;

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
    // pub mod IExperience;
    pub mod ITrade;
    pub mod IInventory;
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
    pub mod inventory_model;
    // pub mod experience_model;
    pub mod transaction_model;
    pub mod session;
}
pub mod tests {
    mod test_auction;
    mod test_daily_challenge;
    mod test_trading;
    // mod test_experience;
    mod test_aquarium;
    mod test_world;
    // mod simple_session_test;
    mod test_inventory;

}


pub mod utils;


pub mod helpers {
    pub mod session_validation;
}

