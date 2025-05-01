use starknet::{ContractAddress};

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

#[generate_trait]
impl FishImpl of FishTrait {
    fn is_dead(self: @Fish) -> bool {
        self.health == @0_u32
    }

    fn is_hungry(self: @Fish) -> bool {
        self.hunger_level < @20_u32
    }

    fn is_fully_grown(self: @Fish) -> bool {
        self.growth >= @100_u32
    }

    fn can_eat(self: @Fish) -> bool {
        self.hunger_level < @100_u32
    }
}

#[cfg(test)]
mod tests {
    use super::Fish;
    use super::*;
    use starknet::contract_address_const;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_fish_creation() {
        let fish = Fish {
            id: 1_u64,
            fish_type: 1_u32,
            age: 0,
            hunger_level: 0,
            health: 100,
            growth: 0,
            owner: zero_address(),
        };
        assert(fish.fish_type == 1, 'Fish type should match');
    }
}
