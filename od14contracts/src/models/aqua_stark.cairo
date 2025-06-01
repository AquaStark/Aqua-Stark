use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Fish {
    #[key]
    pub id: u64,
    pub fish_type: u32,
    pub age: u32, // in days
    pub hunger_level: u32, // 0-100 scale
    pub health: u32, // 0-100 scale
    pub growth: u32, // 0-100 scale
    pub owner: ContractAddress,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Id {
    #[key]
    pub target: felt252,
    pub nonce: u64,
}

// #[generate_trait]
// impl FishImpl of FishTrait {
//     fn is_dead(self: @Fish) -> bool {
//         self.health == @0_u32
//     }

//     fn is_hungry(self: @Fish) -> bool {
//         self.hunger_level < @20_u32
//     }

//     fn is_fully_grown(self: @Fish) -> bool {
//         self.growth >= @100_u32
//     }

//     fn can_eat(self: @Fish) -> bool {
//         self.hunger_level < @100_u32
//     }
// }

