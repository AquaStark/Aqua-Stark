use starknet::{ContractAddress, get_caller_address};

#[derive(Drop, Serde, Debug, Clone)]
#[dojo::model]
pub struct Decoration {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub aquarium_id: u256,
    pub name: felt252,
    pub description: felt252,
    pub price: u256,
    pub rarity: felt252,
}


#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct DecorationCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
}


pub trait DecorationTrait {
    fn decoration(
        decoration: Decoration,
        id: u256,
        aquarium_id: u256,
        name: felt252,
        description: felt252,
        price: u256,
        rarity: felt252,
    ) -> Decoration;
}

impl DecorationImpl of DecorationTrait {
    fn decoration(
        mut decoration: Decoration,
        id: u256,
        aquarium_id: u256,
        name: felt252,
        description: felt252,
        price: u256,
        rarity: felt252,
    ) -> Decoration {
        let caller = get_caller_address();
        decoration.owner = caller;
        decoration.id = id;
        decoration.aquarium_id = aquarium_id;
        decoration.name = name;
        decoration.description = description;
        decoration.price = price;
        decoration.rarity = rarity;
        decoration
    }
}
#[cfg(test)]
mod tests {
    use super::Decoration;
    use super::*;
    #[test]
    fn test_create_decoration() {
        let caller = get_caller_address();
        let decoration = Decoration {
            id: 0, owner: caller, aquarium_id: 0, name: '', description: '', price: 0, rarity: 0,
        };

        let decoration: Decoration = DecorationTrait::decoration(
            decoration, 1, 1, 'Aji', 'Ship Wreck', 200, 8,
        );

        assert(decoration.id == 1, 'id error');
        assert(decoration.aquarium_id == 1, 'aquarium_id error');
        assert(decoration.name == 'Aji', 'name error');
        assert(decoration.description == 'Ship Wreck', 'description error');
        assert(decoration.price == 200, 'price error');
        assert(decoration.rarity == 8, 'rarity error');
    }
}
