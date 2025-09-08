use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Decoration {
    #[key]
    pub id: u64,
    pub decoration_type: u32,
    pub owner: ContractAddress,
}

#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use super::{*, Decoration};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_decoration_creation() {
        let decoration = Decoration { id: 1_u64, decoration_type: 1, owner: zero_address() };
        assert(decoration.decoration_type == 1, 'Decoration type should match');
    }
}
