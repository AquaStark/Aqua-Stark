pub mod systems {
    pub mod actions;
    pub mod ownership;
}

pub mod types {
    pub mod condition;
    pub mod rarity;
    pub mod reward;
    pub mod status;
    pub mod types;
}

pub mod components {
    pub mod aquarium;
    pub mod auction;
    pub mod experience;
    pub mod fish;
    pub mod friends;
    pub mod playerstate;
    pub mod voting;
}

pub mod models;

pub mod entities {
    pub mod achievement;
    pub mod aquarium;
    pub mod auction;
    pub mod base;
    pub mod decoration;
    pub mod fish;
    pub mod friends;
    pub mod mission;
    pub mod player;
    pub mod voting;
}

pub mod tests {
    mod mocks {
        pub mod erc20_mock;
    }
    #[cfg(test)]
    mod test_aquarium;
    #[cfg(test)]
    mod test_auction;
    #[cfg(test)]
    mod test_experience;
    #[cfg(test)]
    mod test_fish;
    #[cfg(test)]
    mod test_friends;
    #[cfg(test)]
    mod test_integration;
    #[cfg(test)]
    mod test_ownership;
    #[cfg(test)]
    mod test_playerstate;
    #[cfg(test)]
    mod test_utils;
    mod test_world;
}
