use starknet::ContractAddress;
use aqua_stark::entities::player::Player;

const PLAYER_ID_TARGET: felt252 = 'PLAYER';

#[starknet::interface]
pub trait IPlayerState<ContractState> {
    fn register(ref self: ContractState, wallet: ContractAddress, username: felt252) -> u64;
    fn get_player(ref self: ContractState, wallet: ContractAddress) -> Player;
    fn get_username_from_address(ref self: ContractState, wallet: ContractAddress) -> felt252;
    fn is_player_registered(self: @ContractState, wallet: ContractAddress) -> bool;
    fn get_player_id(self: @ContractState, wallet: ContractAddress) -> u64;
    fn is_player_verified(self: @ContractState, wallet: ContractAddress) -> bool;
    fn verify_player(ref self: ContractState, wallet: ContractAddress) -> bool;
    fn get_player_data(
        self: @ContractState, wallet: ContractAddress,
    ) -> (u64, u64, u32, bool); // (id, experience, level, is_verified)
}

#[dojo::contract]
pub mod PlayerState {
    use aqua_stark::entities::base::{CustomErrors, Id};
    use aqua_stark::entities::player::{Player, UsernamePlayerMapping};
    use core::num::traits::Zero;
    use dojo::model::ModelStorage;
    use starknet::{contract_address_const, get_block_timestamp};
    use super::*;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    struct PlayerCreated {
        #[key]
        wallet: ContractAddress,
        username: felt252,
        id: u64,
        inventory_ref: ContractAddress,
        is_verified: bool,
        registered_at: u64,
        experience: u64,
        level: u32,
    }

    #[abi(embed_v0)]
    impl PlayerStateImpl of IPlayerState<ContractState> {
        fn register(ref self: ContractState, wallet: ContractAddress, username: felt252) -> u64 {
            let mut world = self.world_default();

            let existing: Player = world.read_model(wallet);
            assert(existing.registered_at == 0_u64, CustomErrors::ALREADY_REGISTERED);

            // Check that the username does not exist
            let existing_username: UsernamePlayerMapping = world.read_model(username);
            assert(existing_username.wallet == Zero::zero(), CustomErrors::USERNAME_EXISTS);

            let new_id = self.generate_player_id();

            let player = Player {
                wallet,
                username,
                id: new_id,
                inventory_ref: contract_address_const::<0>(),
                is_verified: false,
                registered_at: get_block_timestamp(),
                experience: 0_u64,
                level: 1_u32,
            };
            let username_mapping = UsernamePlayerMapping {
                username,
                wallet
            }

            world.write_model(@player);
            world.write_model(@username_mapping);

            // emit player registered event
            world.emit_event(@PlayerCreated{
                wallet,
                username,
                id: new_id,
                inventory_ref: contract_address_const::<0>(),
                is_verified: false,
                registered_at: get_block_timestamp(),
                experience: 0_u64,
                level: 1_u32,
            });

            new_id
        }

        fn get_player(ref self: ContractState, wallet: ContractAddress) -> Player {
            let mut world = self.world_default();

            let player: Player = world.read_model(wallet);
            player
        }

        fn get_username_from_address(ref self: ContractState, wallet: ContractAddress) -> felt252 {
            let mut world = self.world_default();

            let player: Player = world.read_model(wallet);
            player.username
        }

        fn verify_player(ref self: ContractState, wallet: ContractAddress) -> bool {
            let mut world = self.world_default();
            let mut player: Player = world.read_model(wallet);
            player.is_verified = true;
            world.write_model(@player);
            true
        }

        fn is_player_registered(self: @ContractState, wallet: ContractAddress) -> bool {
            let mut world = self.world_default();
            let player: Player = world.read_model(wallet);
            player.id > 0_u64 && player.wallet != contract_address_const::<0>()
        }

        fn is_player_verified(self: @ContractState, wallet: ContractAddress) -> bool {
            let mut world = self.world_default();
            let player: Player = world.read_model(wallet);
            player.is_verified
        }

        fn get_player_id(self: @ContractState, wallet: ContractAddress) -> u64 {
            let mut world = self.world_default();
            let player: Player = world.read_model(wallet);
            player.id
        }

        fn get_player_data(self: @ContractState, wallet: ContractAddress) -> (u64, u64, u32, bool) {
            let mut world = self.world_default();
            let player: Player = world.read_model(wallet);
            (player.id, player.experience, player.level, player.is_verified)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"aqua_stark")
        }

        fn generate_player_id(self: @ContractState) -> u64 {
            let mut world = self.world_default();
            let mut id_struct: Id = world.read_model(PLAYER_ID_TARGET);
            let new_id = id_struct.nonce + 1;
            id_struct.nonce = new_id;
            world.write_model(@id_struct);
            new_id
        }
    }
}
