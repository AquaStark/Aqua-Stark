use starknet::{ContractAddress, get_block_timestamp, get_caller_address};

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct PlayerCounter {
    #[key]
    pub id: felt252,
    pub current_val: u256,
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
    pub experience_points: u256,
    pub decoration_count: u32,
    pub transaction_count: u32,
    pub registered_at: u64,
    pub player_fishes: Array<u256>,
    pub player_aquariums: Array<u256>,
    pub player_decorations: Array<u256>,
    pub transaction_history: Array<u256>,
    pub last_action_reset: u64, // Timestamp of last reset (seconds since epoch)
    pub daily_fish_creations: u32, // Fish creations granting XP today
    pub daily_decoration_creations: u32, // Decoration creations granting XP today
    pub daily_aquarium_creations: u32,
}

pub trait PlayerTrait {
    fn register_player(
        id: u256,
        username: felt252,
        inventory_ref: ContractAddress,
        aquarium_count: u32,
        fish_count: u32,
    ) -> Player;
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
            is_verified: true,
            registered_at: timestamp,
            aquarium_count: 0,
            decoration_count: 0,
            fish_count: 0,
            transaction_count: 0,
            experience_points: 0,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_history: array![],
            last_action_reset: 0,
            daily_fish_creations: 0,
            daily_decoration_creations: 0,
            daily_aquarium_creations: 0,
        };
        player
    }
    // fn add_fish(mut player: Player, mut player_fish: PlayerFish) {
//     let caller = get_caller_address();
//     player_fish.owner = caller;
//     player.fish_count += 1;
// }
// fn add_aquarium(mut player: Player, mut player_aquarium: PlayerAquarium) {
//     let caller = get_caller_address();
//     player_aquarium.owner = caller;
//     player.aquarium_count += 1;
// }
// fn remove_aquarium(
//     aquarium: Aquarium, mut player: Player, mut player_aquarium: PlayerAquarium,
// ) {
//     let zero_address = contract_address_const::<0>();
//     player_aquarium.owner = zero_address;
//     player.aquarium_count -= 1;
// }

    // fn remove_fish(fish: Fish, mut player: Player, mut player_fish: PlayerFish) {
//     let zero_address = contract_address_const::<0>();
//     player_fish.owner = zero_address;
//     player.fish_count -= 1;
// }
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
            id: 1,
            username: 'Aji',
            inventory_ref: zero_address(),
            is_verified: false,
            registered_at: time,
            aquarium_count: 0,
            fish_count: 0,
            decoration_count: 0,
            transaction_count: 0,
            experience_points: 0,
            player_fishes: array![],
            player_aquariums: array![],
            player_decorations: array![],
            transaction_history: array![],
            last_action_reset: 0,
            daily_fish_creations: 0,
            daily_decoration_creations: 0,
            daily_aquarium_creations: 0,
        };
        assert(player.id == 1, 'Player ID should match');
    }
}
