
use starknet::ContractAddress;

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct Player {
    #[key]
    pub id: u256,
    pub last_login_day: u64, // day number
    pub streak_counter: u64,
    pub rewards_delivered: u64,

use starknet::{ContractAddress, get_block_timestamp, get_caller_address, contract_address_const};
use crate::models::aquarium_model::{Aquarium};
use crate::models::fish_model::{Fish};


#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct PlayerCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
}

#[derive(Serde, Clone, Drop, Introspect)]
#[dojo::model]
pub struct PlayerFishes {
    #[key]
    pub id: u256,
    pub owner: ContractAddress,
    pub fish: Fish,
}

#[derive(Serde, Copy, Drop, Introspect)]
#[dojo::model]
pub struct PlayerFish {
    #[key]
    pub fish: Fish,
    #[key]
    pub game_id: u256,
    pub owner: ContractAddress,
}

#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct UsernameToAddress {
    #[key]
    pub username: felt252,
    pub address: ContractAddress,
}

#[derive(Drop, Copy, Serde)]
#[dojo::model]
pub struct AddressToUsername {
    #[key]
    pub address: ContractAddress,
    pub username: felt252,
}

// #[derive(Serde, Clone, Drop, Introspect)]
// #[dojo::model]
// pub struct PlayerAquarium {
//     #[key]
//     pub aquarium: Aquarium,
//     #[key]
//     pub game_id: u256,
//     pub owner: ContractAddress,
// }

#[derive(Clone, Drop, Serde)]
#[dojo::model]
pub struct Player {
    #[key]
    pub wallet: ContractAddress,
    pub id: u256,
    pub username: felt252,
    pub inventory_ref: ContractAddress,
    pub is_verified: bool,
    pub aquarium_count: u32,
    pub fish_count: u32,
    pub decoration_count: u32,
    pub registered_at: u64,
}

pub trait PlayerTrait {
    fn register_player(
        id: u256,
        username: felt252,
        inventory_ref: ContractAddress,
        aquarium_count: u32,
        fish_count: u32,
    ) -> Player;
    // fn add_fish(player: Player, player_fish: PlayerFish);
// fn add_aquarium(player: Player, player_aquarium: PlayerAquarium);
// fn remove_aquarium(aquarium: Aquarium, player: Player, player_aquarium: PlayerAquarium);
// fn remove_fish(fish: Fish, player: Player, player_fish: PlayerFish);
}
impl PlayerImpl of PlayerTrait {
    fn register_player(
        id: u256,
        username: felt252,
        inventory_ref: ContractAddress,
        aquarium_count: u32,
        fish_count: u32,
    ) -> Player {
        let timestamp = get_block_timestamp();
        let caller = get_caller_address();

        let player = Player {
            wallet: caller,
            id: id,
            username: username,
            inventory_ref: inventory_ref,
            is_verified: false,
            registered_at: timestamp,
            aquarium_count: 0,
            decoration_count: 0,
            fish_count: 0,
        };
        player
    }

}

#[cfg(test)]
mod tests {
    use super::Player;
    use super::*;
    use starknet::{contract_address_const, get_block_timestamp};

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_player_creation() {
        let time = get_block_timestamp();
        let player = Player {
            wallet: zero_address(),
            id: 1,
            username: 'Aji',
            inventory_ref: zero_address(),
            is_verified: false,
            registered_at: time,
            aquarium_count: 0,
            fish_count: 0,
            decoration_count: 0,
        };
        assert(player.id == 1, 'Player ID should match');
    }

}
