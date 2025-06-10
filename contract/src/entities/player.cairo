use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub wallet: ContractAddress,
    pub username: felt252,
    pub id: u64,
    pub inventory_ref: ContractAddress,
    pub is_verified: bool,
    pub registered_at: u64,
    pub experience: u64,
    pub level: u32,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct UsernamePlayerMapping {
    #[key]
    username: felt252,
    wallet: ContractAddress
}

#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn is_registered(self: @Player) -> bool {
        self.id > @0_u64 && self.wallet != @starknet::contract_address_const::<0>()
    }

    fn can_level_up(self: @Player, required_exp: u64) -> bool {
        self.experience >= @required_exp
    }
}

#[cfg(test)]
mod tests {
    use starknet::{contract_address_const, get_block_timestamp};
    use super::{*, Player};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_player_creation() {
        let time = get_block_timestamp();
        let player = Player {
            wallet: zero_address(),
            id: 1_u64,
            inventory_ref: zero_address(),
            is_verified: false,
            registered_at: time,
            experience: 0_u64,
            level: 1_u32,
        };
        assert(player.id == 1, 'Player ID should match');
        assert(player.experience == 0, 'Initial experience should be 0');
        assert(player.level == 1, 'Initial level should be 1');
    }

    #[test]
    fn test_can_level_up() {
        let player = Player {
            wallet: zero_address(),
            id: 1_u64,
            inventory_ref: zero_address(),
            is_verified: false,
            registered_at: get_block_timestamp(),
            experience: 150_u64,
            level: 1_u32,
        };

        assert(player.can_level_up(100), 'Should be able to level up');
        assert(!player.can_level_up(200), 'Should not be able to level up');
    }
}
