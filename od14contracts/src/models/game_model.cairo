use starknet::{ContractAddress, contract_address_const};
// Keeps track of the state of the game

#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
#[dojo::model]
pub struct GameCounter {
    #[key]
    pub id: felt252,
    pub current_val: u64,
}

#[derive(Serde, Copy, Introspect, Drop, PartialEq)]
pub enum GameStatus {
    #[default]
    Pending,
    OnGoing,
    Ended,
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
    status: GameStatus,
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
    fn new_game(id: u64, created_by: felt252) -> Game;
    fn restart_game(game: Game);
    fn terminate_game(game: Game);
}
impl GameImpl of GameTrait {
    fn new_game(id: u64, created_by: ContractAddress) -> Game {
        Game {
            id,
            created_by,
            is_initialized: true,
            total_players: 0,
            total_aquariums: 0,
            total_fish: 0,
            total_decorations: 0,
            status: GameStatus::OnGoing,
            fish_genealogy_enabled: false,
            fish_genes_onchain: false,
            marketplace_enabled: false,
            auctions_enabled: false,
            active_events: Array::new(), // empty array
            leaderboard: Array::new(), // empty leaderboard
            created_at,
            last_updated: created_at,
        }
    }

    fn restart_game(mut game: Game) {
        game.is_initialized = false;
        game.total_players = 0;
        game.total_aquariums = 0;
        game.total_fish = 0;
        game.total_decorations = 0;
        game.status = GameStatus::OnGoing;
        game.fish_genealogy_enabled = false;
        game.fish_genes_onchain = false;
        game.marketplace_enabled = false;
        game.auctions_enabled = false;
        game.active_events.clear();
        game.leaderboard.clear();
        game.last_updated = 0;
    }

    fn terminate_game(mut game: Game) {
        game.status = GameStatus::Ended;
        game.is_initialized = false;
        // Optionally: clear all arrays or do other cleanup
        game.last_updated = 0;
    }
}

