pub mod systems {
    pub mod AquaStark;
    pub mod Aquarium_systems;
}

pub mod interfaces {
    pub mod IAquaStark;
    pub mod i_aquarium;
}

pub mod constants {
    pub mod aquarium_constants;
}

pub mod events {
    pub mod aquarium_events;
}

pub mod models {
    pub mod fish_model;
    pub mod aquarium_model;
    pub mod decoration_model;
    pub mod game_model;
    pub mod player_model;
}
pub mod tests {
    mod test_world;
}

