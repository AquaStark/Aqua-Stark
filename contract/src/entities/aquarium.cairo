use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Aquarium {
    #[key]
    pub id: u64,
    pub owner: ContractAddress,
    pub max_capacity: u32,
    pub cleanliness: u32, // 0-100 scale
    pub housed_fish: Array<u64>,
}

#[cfg(test)]
mod tests {
    use super::Aquarium;
    use super::*;
    use starknet::contract_address_const;
    use core::array::ArrayTrait;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_aquarium_creation() {
        let aquarium = Aquarium {
            id: 1_u64,
            owner: zero_address(),
            max_capacity: 10,
            cleanliness: 100,
            housed_fish: ArrayTrait::new(),
        };
        assert(aquarium.max_capacity == 10, 'Aquarium capacity should match');
    }
}
