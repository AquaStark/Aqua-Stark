pub mod systems {
    pub mod actions;
    pub mod ownership;
}

pub mod components {
    pub mod auction;
    pub mod aquarium;
    pub mod fish;
    pub mod ShopCatalog;
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
    mod test_aquarium;
    mod test_fish;
    mod test_ownership;
    mod test_utils;
    mod test_world;
    mod test_shop_catalog;
}
