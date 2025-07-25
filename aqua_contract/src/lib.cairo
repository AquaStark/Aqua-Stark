pub mod systems {
    pub mod AquaStark;
}

pub mod achievements {
    pub mod achievements;
}
pub mod base {
    pub mod events;
}

pub mod contracts {
    pub mod auctions;
}

pub mod interfaces {
    pub mod IAquaStark;
    pub mod ITransactionHistory;
}

pub mod models {
    pub mod aquarium_model;
    pub mod decoration_model;
    pub mod fish_model;
    pub mod game_model;
    pub mod player_model;
    pub mod transaction_model;
    pub mod auction_model;
}
pub mod tests {
    mod test_world;
}

