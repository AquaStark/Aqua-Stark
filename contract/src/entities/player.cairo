use starknet::{ContractAddress};

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub id: u64,
    pub wallet: ContractAddress,
    pub inventory_ref: ContractAddress,
}

#[cfg(test)]
mod tests {
    use super::Player;
    use super::*;
    use starknet::contract_address_const;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_player_creation() {
        let player = Player { id: 1_u64, wallet: zero_address(), inventory_ref: zero_address() };
        assert(player.id == 1, 'Player ID should match');
    }
}
