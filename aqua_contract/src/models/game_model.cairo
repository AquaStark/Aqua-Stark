// use starknet::{ContractAddress, contract_address_const};
// Keeps track of the state of the game

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct GameCounter {
    #[key]
    pub id: felt252,
    pub current_val: u64,
}


#[derive(Drop, Serde)]
#[dojo::model]
pub struct Game {
    #[key]
    id: u64, // Unique ID of the game instance
    created_by: felt252, // Wallet address that initialized the game
    is_initialized: bool, // Indicates if the game has been properly initialized
    // Core entity tracking
    total_players: u32,
    total_aquariums: u32,
    total_fish: u32,
    total_decorations: u32,
    // Genetic system data
    fish_genealogy_enabled: bool, // Whether full genealogy tracking is active
    fish_genes_onchain: bool, // Whether gene computations are on-chain
    // Marketplace and ownership tracking
    marketplace_enabled: bool,
    auctions_enabled: bool,
    // Status tracking
    active_events: Array<felt252>, // List of active event IDs
    leaderboard: Array<(felt252, u64)>, // (player_address, score)
    // Timestamp & game metadata
    created_at: u64,
    last_updated: u64,
}


pub trait GameTrait {
    // Create and return a new game
    fn new(id: u64, created_by: felt252) -> Game;
    fn restart(ref self: Game);
    fn terminate_game(ref self: Game);
}
// impl GameImpl of GameTrait {
//     fn new(
//         id: u64,
//         created_by: felt252,
//         game_mode: GameMode,
//         player_hat: felt252,
//         player_car: felt252,
//         player_dog: felt252,
//         player_thimble: felt252,
//         player_iron: felt252,
//         player_battleship: felt252,
//         player_boot: felt252,
//         player_wheelbarrow: felt252,
//         number_of_players: u8,
//     ) -> Game {
//         let zero_address = contract_address_const::<0x0>();
//         Game {
//             id,
//             created_by,
//             is_initialised: true,
//             status: GameStatus::Pending,
//             mode: game_mode,
//             ready_to_start: false,
//             player_hat,
//             player_car,
//             player_dog,
//             player_thimble,
//             player_iron,
//             player_battleship,
//             player_boot,
//             player_wheelbarrow,
//             next_player: zero_address.into(),
//             winner: zero_address.into(),
//             rolls_times: 0,
//             rolls_count: 0,
//             number_of_players,
//             dice_face: 0,
//             player_chance: zero_address.into(),
//             has_thrown_dice: false,
//             game_condition: array![
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//                 0_u32,
//             ],
//             hat: 'hat',
//             car: 'car',
//             dog: 'dog',
//             thimble: 'thimble',
//             iron: 'iron',
//             battleship: 'battleship',
//             boot: 'boot',
//             wheelbarrow: 'wheelbarrow',
//         }
//     }

//     fn restart(ref self: Game) {
//         let zero_address = contract_address_const::<0x0>();
//         self.next_player = zero_address.into();
//         self.rolls_times = 0;
//         self.rolls_count = 0;
//         self.number_of_players = 0;
//         self.dice_face = 0;
//         self.player_chance = zero_address.into();
//         self.has_thrown_dice = false;
//     }

//     fn terminate_game(ref self: Game) {
//         self.status = GameStatus::Ended;
//     }
// }


