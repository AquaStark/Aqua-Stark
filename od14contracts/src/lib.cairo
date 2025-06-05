pub mod systems {
    pub mod actions;
}

pub mod components {
    pub mod fish;
}

pub mod models;

pub mod entities {
    pub mod base;
    pub mod fish;
}

pub mod tests {
    #[cfg(test)]
    mod test_fish;
    #[cfg(test)]
    mod test_utils;
    mod test_world;
}
