pub mod systems {
    pub mod actions;
    pub mod ownership;
}

pub mod components {
    pub mod auction;
    pub mod aquarium;
    pub mod fish;
}

pub mod models;

pub mod entities {
    pub mod auction;
    pub mod aquarium;
    pub mod base;
    pub mod decoration;
    pub mod fish;
    pub mod player;
}

pub mod tests {
    mod mocks {
        pub mod erc20_mock;
    }
    #[cfg(test)]
    mod test_auction;
    #[cfg(test)]
    mod test_aquarium;
    #[cfg(test)]
    mod test_fish;
    #[cfg(test)]
    mod test_ownership;
    #[cfg(test)]
    mod test_utils;
    mod test_world;
}
